/**
 * Generate a fillable PDF application form from CMS section/field data.
 *
 * Uses pdf-lib to create an accessible, interactive PDF with form fields
 * that users can complete in any PDF reader (Adobe Reader, Preview, Chrome, etc).
 *
 * Field type mapping (CMS → PDF):
 *   Input        → TextField (single line)
 *   Textarea     → TextField (multiline, larger)
 *   Select       → Dropdown
 *   Radios       → RadioGroup
 *   Checkboxes   → CheckBox (one per option)
 *   Input[file]  → note directing user to portal
 */

import {
    PDFDocument,
    rgb,
    type PDFFont,
    type PDFPage,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── Types ──────────────────────────────────────────────────────────────

interface FieldData {
    fields_id: {
        name: string;
        description?: string;
        slug: string;
        type: string; // "Input" | "Select" | "Textarea" | "Radios" | "Checkboxes"
        input_type?: string; // "text" | "email" | "number" | "file" etc.
        required?: boolean;
        select_options?: Array<{
            name: string;
            slug?: string;
            code?: string;
            description?: string;
        }>;
        max_length?: number;
        prefix?: string;
        suffix?: string;
    };
}

interface SectionData {
    sections_id: {
        name: string;
        slug: string;
        description?: string;
        fields: FieldData[];
    };
}

interface GeneratePdfOptions {
    applicationName: string;
    slug: string;
    stageSlug?: string;
    stageText?: string;
    sections: SectionData[];
}

// ─── Constants ──────────────────────────────────────────────────────────

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89; // A4
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 50;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 60;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

// Font sizes
const FONT_SIZE_TITLE = 20;
const FONT_SIZE_SUBTITLE = 12;
const FONT_SIZE_SECTION_HEADING = 14;
const FONT_SIZE_FIELD_LABEL = 10;
const FONT_SIZE_BODY = 9;
const FONT_SIZE_SMALL = 8;

// Spacing
const LINE_HEIGHT_BODY = 13;
const LINE_HEIGHT_SMALL = 11;
const FIELD_GAP = 20; // space between fields
const SECTION_GAP = 30; // space between sections

// Colours
const COLOUR_BLACK = rgb(0, 0, 0);
const COLOUR_DARK_GREY = rgb(0.2, 0.2, 0.2);
const COLOUR_MID_GREY = rgb(0.45, 0.45, 0.45);
const COLOUR_LIGHT_GREY = rgb(0.85, 0.85, 0.85);
const COLOUR_SECTION_BG = rgb(0.93, 0.93, 0.97); // light violet tint
const COLOUR_VIOLET = rgb(0.42, 0.28, 0.64);

// Field widget dimensions
const TEXT_FIELD_HEIGHT = 22;
const TEXTAREA_HEIGHT = 250;
const FIELD_HINT_GAP = 14; // space between a field widget and helper text below it
const RADIO_SIZE = 12;
const CHECKBOX_SIZE = 12;
const DROPDOWN_HEIGHT = 22;
const FORM_FIELD_FONT_SIZE = 10; // consistent size for all interactive fields

// ─── Helpers ────────────────────────────────────────────────────────────

/**
 * Strip markdown/HTML to plain text for PDF rendering.
 * Handles common markdown: bold, italic, links, headers, lists, HTML tags.
 */
function stripMarkdown(text: string): string {
    if (!text) return "";
    let result = text
        // Remove HTML tags
        .replace(/<[^>]+>/g, "")
        // Remove markdown headers
        .replace(/^#{1,6}\s+/gm, "")
        // Remove bold/italic markers
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
        .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
        // Convert markdown links to text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        // Remove images
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
        // Simple list markers → bullet
        .replace(/^[\s]*[-*+]\s+/gm, "- ")
        // Remove blockquotes
        .replace(/^>\s?/gm, "")
        // Collapse multiple newlines
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    // Replace non-WinAnsi characters that standard PDF fonts can't encode
    result = sanitiseForPdf(result);
    return result;
}

/**
 * Normalise common special characters in CMS text so they render
 * predictably across all PDF readers. Embedded Nunito can handle
 * most Unicode, but arrow characters and smart quotes are replaced
 * for consistency and readability.
 */
function sanitiseForPdf(text: string): string {
    return text
        // Common unicode arrows → readable ASCII
        .replace(/[\u2192\u2190\u2191\u2193\u21D2]/g, "->")
        // Smart quotes → straight quotes (more predictable)
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        // Ellipsis → three dots
        .replace(/\u2026/g, "...");
}

/**
 * Wrap a long string into lines that fit within a given pixel width.
 */
function wrapText(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number,
): string[] {
    const lines: string[] = [];
    const safeText = sanitiseForPdf(text);
    const paragraphs = safeText.split("\n");

    for (const paragraph of paragraphs) {
        if (paragraph.trim() === "") {
            lines.push("");
            continue;
        }

        const words = paragraph.split(/\s+/);
        let currentLine = "";

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const width = font.widthOfTextAtSize(testLine, fontSize);

            if (width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
    }

    return lines;
}

// ─── Page cursor ────────────────────────────────────────────────────────

/**
 * Tracks the current drawing position across pages and handles page breaks.
 */
class PageCursor {
    y: number;
    page: PDFPage;
    pageNumber: number;
    private pdfDoc: PDFDocument;
    private headerFont: PDFFont;
    private bodyFont: PDFFont;
    private applicationName: string;

    constructor(
        pdfDoc: PDFDocument,
        page: PDFPage,
        headerFont: PDFFont,
        bodyFont: PDFFont,
        applicationName: string,
    ) {
        this.pdfDoc = pdfDoc;
        this.page = page;
        this.y = PAGE_HEIGHT - MARGIN_TOP;
        this.pageNumber = 1;
        this.headerFont = headerFont;
        this.bodyFont = bodyFont;
        this.applicationName = applicationName;
    }

    /** Remaining space on current page */
    get remaining(): number {
        return this.y - MARGIN_BOTTOM;
    }

    /** Add a new page if not enough room, return whether a new page was added */
    ensureSpace(needed: number): boolean {
        if (this.remaining < needed) {
            this.newPage();
            return true;
        }
        return false;
    }

    /** Start a fresh page with a thin header line */
    newPage(): void {
        this.page = this.pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        this.pageNumber++;
        this.y = PAGE_HEIGHT - MARGIN_TOP;

        // Thin header with app name + page number
        this.page.drawText(this.applicationName, {
            x: MARGIN_LEFT,
            y: PAGE_HEIGHT - 30,
            size: FONT_SIZE_SMALL,
            font: this.bodyFont,
            color: COLOUR_MID_GREY,
        });

        const pageText = `Page ${this.pageNumber}`;
        const pageTextWidth = this.bodyFont.widthOfTextAtSize(
            pageText,
            FONT_SIZE_SMALL,
        );
        this.page.drawText(pageText, {
            x: PAGE_WIDTH - MARGIN_RIGHT - pageTextWidth,
            y: PAGE_HEIGHT - 30,
            size: FONT_SIZE_SMALL,
            font: this.bodyFont,
            color: COLOUR_MID_GREY,
        });

        // Divider line
        this.page.drawLine({
            start: { x: MARGIN_LEFT, y: PAGE_HEIGHT - 38 },
            end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: PAGE_HEIGHT - 38 },
            thickness: 0.5,
            color: COLOUR_LIGHT_GREY,
        });

        this.y = PAGE_HEIGHT - MARGIN_TOP - 10;
    }

    /** Draw wrapped text lines, handling page breaks mid-paragraph */
    drawWrappedText(
        text: string,
        font: PDFFont,
        fontSize: number,
        color = COLOUR_DARK_GREY,
        lineHeight?: number,
        maxWidth?: number,
    ): void {
        const lh = lineHeight ?? fontSize + 4;
        const width = maxWidth ?? CONTENT_WIDTH;
        const lines = wrapText(text, font, fontSize, width);

        for (const line of lines) {
            this.ensureSpace(lh);
            if (line === "") {
                this.y -= lh * 0.5;
                continue;
            }
            this.page.drawText(line, {
                x: MARGIN_LEFT,
                y: this.y,
                size: fontSize,
                font,
                color,
            });
            this.y -= lh;
        }
    }

    /** Draw wrapped text lines with an indent (e.g. for options) */
    drawWrappedTextIndented(
        text: string,
        font: PDFFont,
        fontSize: number,
        indent: number,
        color = COLOUR_DARK_GREY,
        lineHeight?: number,
    ): void {
        const lh = lineHeight ?? fontSize + 4;
        const maxWidth = CONTENT_WIDTH - indent;
        const lines = wrapText(text, font, fontSize, maxWidth);

        for (const line of lines) {
            this.ensureSpace(lh);
            if (line === "") {
                this.y -= lh * 0.5;
                continue;
            }
            this.page.drawText(line, {
                x: MARGIN_LEFT + indent,
                y: this.y,
                size: fontSize,
                font,
                color,
            });
            this.y -= lh;
        }
    }
}

// ─── Field renderers ────────────────────────────────────────────────────

function renderInputField(
    cursor: PageCursor,
    form: ReturnType<PDFDocument["getForm"]>,
    field: FieldData["fields_id"],
    fieldId: string,
    fonts: { bold: PDFFont; regular: PDFFont },
): void {
    // File upload — just a note, no form field
    if (field.input_type === "file") {
        cursor.ensureSpace(40);
        cursor.drawWrappedText(
            "File uploads must be submitted via the Application Portal at portal.unltd.org.uk",
            fonts.regular,
            FONT_SIZE_BODY,
            COLOUR_MID_GREY,
            LINE_HEIGHT_BODY,
        );
        cursor.y -= 4;
        return;
    }

    const labelSuffix = field.prefix ? ` (${field.prefix})` : "";
    const heightNeeded = TEXT_FIELD_HEIGHT + 6;
    cursor.ensureSpace(heightNeeded);

    const tf = form.createTextField(fieldId);
    tf.addToPage(cursor.page, {
        x: MARGIN_LEFT,
        y: cursor.y - TEXT_FIELD_HEIGHT,
        width: CONTENT_WIDTH,
        height: TEXT_FIELD_HEIGHT,
        borderWidth: 1,
        borderColor: COLOUR_LIGHT_GREY,
        font: fonts.regular,
    });
    tf.setFontSize(FORM_FIELD_FONT_SIZE);

    cursor.y -= TEXT_FIELD_HEIGHT + 8;
}

function renderTextareaField(
    cursor: PageCursor,
    form: ReturnType<PDFDocument["getForm"]>,
    field: FieldData["fields_id"],
    fieldId: string,
    fonts: { bold: PDFFont; regular: PDFFont },
): void {
    const heightNeeded = TEXTAREA_HEIGHT + 6;
    cursor.ensureSpace(heightNeeded);

    const tf = form.createTextField(fieldId);
    tf.enableMultiline();
    tf.enableScrolling();
    tf.addToPage(cursor.page, {
        x: MARGIN_LEFT,
        y: cursor.y - TEXTAREA_HEIGHT,
        width: CONTENT_WIDTH,
        height: TEXTAREA_HEIGHT,
        borderWidth: 1,
        borderColor: COLOUR_LIGHT_GREY,
        font: fonts.regular,
    });
    tf.setFontSize(FORM_FIELD_FONT_SIZE);

    if (field.max_length) {
        const maxLen = typeof field.max_length === 'string' ? parseInt(field.max_length, 10) : field.max_length;
        if (!isNaN(maxLen) && maxLen > 0) {
            tf.setMaxLength(maxLen);
        }
        cursor.y -= TEXTAREA_HEIGHT + FIELD_HINT_GAP;
        cursor.drawWrappedText(
            `Maximum ${maxLen.toLocaleString()} characters`,
            fonts.regular,
            FONT_SIZE_SMALL,
            COLOUR_MID_GREY,
            LINE_HEIGHT_SMALL,
        );
        cursor.y -= 4;
    } else {
        cursor.y -= TEXTAREA_HEIGHT + 8;
    }
}

function renderSelectField(
    cursor: PageCursor,
    form: ReturnType<PDFDocument["getForm"]>,
    field: FieldData["fields_id"],
    fieldId: string,
    fieldSlug: string,
    fonts: { bold: PDFFont; regular: PDFFont },
    stageSlug?: string,
): void {
    const options =
        field.select_options?.map((o) => sanitiseForPdf(o.name)).filter(Boolean) ?? [];
    if (options.length === 0) return;

    cursor.ensureSpace(DROPDOWN_HEIGHT + 6);

    const isStageField = fieldSlug.trim() === "please-tell-us-the-stage-your-social-venture-is-at";

    const dd = form.createDropdown(fieldId);
    dd.addOptions(options);

    // Auto-select and lock the stage field
    if (isStageField && stageSlug) {
        const matchingOption = field.select_options?.find(
            (o) => o.slug?.trim() === stageSlug.trim(),
        );
        if (matchingOption) {
            dd.select(sanitiseForPdf(matchingOption.name));
            dd.enableReadOnly();
        }
    }

    dd.addToPage(cursor.page, {
        x: MARGIN_LEFT,
        y: cursor.y - DROPDOWN_HEIGHT,
        width: CONTENT_WIDTH,
        height: DROPDOWN_HEIGHT,
        borderWidth: 1,
        borderColor: COLOUR_MID_GREY,
        backgroundColor: isStageField && stageSlug
            ? rgb(0.93, 0.93, 0.93)
            : rgb(0.97, 0.97, 0.97),
        font: fonts.regular,
    });
    dd.setFontSize(FORM_FIELD_FONT_SIZE);

    // Show a note if locked
    if (isStageField && stageSlug) {
        cursor.y -= DROPDOWN_HEIGHT + FIELD_HINT_GAP;
        cursor.drawWrappedText(
            "This answer is pre-selected because the remaining questions are specific to this stage.",
            fonts.regular,
            FONT_SIZE_SMALL,
            COLOUR_MID_GREY,
            LINE_HEIGHT_SMALL,
        );
        cursor.y -= 4;
    } else {
        cursor.y -= DROPDOWN_HEIGHT + 8;
    }
}

function renderRadiosField(
    cursor: PageCursor,
    form: ReturnType<PDFDocument["getForm"]>,
    field: FieldData["fields_id"],
    fieldId: string,
    fonts: { bold: PDFFont; regular: PDFFont },
): void {
    const options = field.select_options ?? [];
    if (options.length === 0) return;

    const rg = form.createRadioGroup(fieldId);

    for (const option of options) {
        // Estimate space: radio + label + optional description
        const optionLines = option.description
            ? wrapText(
                option.description,
                fonts.regular,
                FONT_SIZE_SMALL,
                CONTENT_WIDTH - 24,
            )
            : [];
        const neededHeight =
            RADIO_SIZE + 4 + optionLines.length * LINE_HEIGHT_SMALL + 4;
        cursor.ensureSpace(neededHeight);

        // Radio widget
        rg.addOptionToPage(option.name, cursor.page, {
            x: MARGIN_LEFT,
            y: cursor.y - RADIO_SIZE,
            width: RADIO_SIZE,
            height: RADIO_SIZE,
        });

        // Option label
        cursor.page.drawText(sanitiseForPdf(option.name), {
            x: MARGIN_LEFT + RADIO_SIZE + 6,
            y: cursor.y - RADIO_SIZE + 2,
            size: FONT_SIZE_BODY,
            font: fonts.regular,
            color: COLOUR_DARK_GREY,
        });

        cursor.y -= RADIO_SIZE + 4;

        // Option description
        if (option.description) {
            cursor.drawWrappedTextIndented(
                option.description,
                fonts.regular,
                FONT_SIZE_SMALL,
                RADIO_SIZE + 6,
                COLOUR_MID_GREY,
                LINE_HEIGHT_SMALL,
            );
            cursor.y -= 2;
        }
    }

    cursor.y -= 4;
}

function renderCheckboxesField(
    cursor: PageCursor,
    form: ReturnType<PDFDocument["getForm"]>,
    field: FieldData["fields_id"],
    fieldId: string,
    fonts: { bold: PDFFont; regular: PDFFont },
): void {
    const options = field.select_options ?? [];
    if (options.length === 0) return;

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        cursor.ensureSpace(CHECKBOX_SIZE + 8);

        const cb = form.createCheckBox(`${fieldId}.${i}`);
        cb.addToPage(cursor.page, {
            x: MARGIN_LEFT,
            y: cursor.y - CHECKBOX_SIZE,
            width: CHECKBOX_SIZE,
            height: CHECKBOX_SIZE,
        });

        // Wrap option label text next to checkbox
        const labelLines = wrapText(
            option.name,
            fonts.regular,
            FONT_SIZE_BODY,
            CONTENT_WIDTH - CHECKBOX_SIZE - 8,
        );

        for (let li = 0; li < labelLines.length; li++) {
            if (li > 0) cursor.ensureSpace(LINE_HEIGHT_BODY);
            cursor.page.drawText(labelLines[li], {
                x: MARGIN_LEFT + CHECKBOX_SIZE + 6,
                y:
                    li === 0
                        ? cursor.y - CHECKBOX_SIZE + 2
                        : cursor.y,
                size: FONT_SIZE_BODY,
                font: fonts.regular,
                color: COLOUR_DARK_GREY,
            });
            if (li > 0) cursor.y -= LINE_HEIGHT_BODY;
        }

        cursor.y -= CHECKBOX_SIZE + 6;
    }

    cursor.y -= 4;
}

// ─── Main generator ─────────────────────────────────────────────────────

export async function generateApplicationPdf(
    options: GeneratePdfOptions,
): Promise<Uint8Array> {
    const { applicationName, slug, stageSlug, stageText, sections } = options;
    const generatedAt = new Date();
    const applyUrl = `unltd.org.uk/awards/${slug}`;
    const downloadUrl = `unltd.org.uk/awards/downloads/${slug}.pdf`;

    const pdfDoc = await PDFDocument.create();

    // Register fontkit for custom font embedding
    pdfDoc.registerFontkit(fontkit);

    // Metadata
    pdfDoc.setTitle(`${applicationName} — Application Form`);
    pdfDoc.setAuthor("UnLtd");
    pdfDoc.setSubject(
        stageText
            ? `Application form for a social venture which ${stageText}`
            : "UnLtd Award Application Form",
    );
    pdfDoc.setCreator("UnLtd (unltd.org.uk)");
    pdfDoc.setProducer("pdf-lib");
    pdfDoc.setCreationDate(new Date());

    // Fonts — Nunito (matches the website)
    const nunitoRegularBytes = readFileSync(
        resolve("public/fonts/Nunito-Regular.ttf"),
    );
    const nunitoBoldBytes = readFileSync(
        resolve("public/fonts/Nunito-Bold.ttf"),
    );
    const nunitoRegular = await pdfDoc.embedFont(nunitoRegularBytes);
    const nunitoBold = await pdfDoc.embedFont(nunitoBoldBytes);
    const fonts = { bold: nunitoBold, regular: nunitoRegular };

    // Logo
    const logoBytes = readFileSync(resolve("public/img/logo.png"));
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoAspect = logoImage.width / logoImage.height;
    const logoHeight = 28;
    const logoWidth = logoHeight * logoAspect;

    // First page
    const firstPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    const cursor = new PageCursor(
        pdfDoc,
        firstPage,
        nunitoBold,
        nunitoRegular,
        applicationName,
    );
    const form = pdfDoc.getForm();

    // ── Logo ────────────────────────────────────────────────────────

    cursor.page.drawImage(logoImage, {
        x: MARGIN_LEFT,
        y: cursor.y - logoHeight + 6,
        width: logoWidth,
        height: logoHeight,
    });
    cursor.y -= logoHeight + 16;

    // ── Title area ──────────────────────────────────────────────────────

    cursor.page.drawText(applicationName, {
        x: MARGIN_LEFT,
        y: cursor.y,
        size: FONT_SIZE_TITLE,
        font: nunitoBold,
        color: COLOUR_BLACK,
    });
    cursor.y -= FONT_SIZE_TITLE + 6;

    cursor.page.drawText("Application Form", {
        x: MARGIN_LEFT,
        y: cursor.y,
        size: FONT_SIZE_SUBTITLE,
        font: nunitoRegular,
        color: COLOUR_VIOLET,
    });
    cursor.y -= FONT_SIZE_SUBTITLE + 6;

    if (stageText) {
        cursor.drawWrappedText(
            `For a social venture which ${stageText}.`,
            nunitoRegular,
            FONT_SIZE_BODY,
            COLOUR_MID_GREY,
            LINE_HEIGHT_BODY,
        );
        cursor.y -= 4;
    }

    // Divider
    cursor.page.drawLine({
        start: { x: MARGIN_LEFT, y: cursor.y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: cursor.y },
        thickness: 1,
        color: COLOUR_LIGHT_GREY,
    });
    cursor.y -= 16;

    // ── Important notice ────────────────────────────────────────────────

    const noticeLines = [
        "This is a fillable PDF to help you draft your answers offline. It is not the application itself.",
        "",
        `To submit your application, visit: ${applyUrl} and apply through the UnLtd Application Portal.`,
        "",
        `This form was generated on ${generatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} at ${generatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}. Because this is an offline document, the questions may have changed since it was created. Always download the latest version from: ${downloadUrl}`,
    ];
    const noticeText = noticeLines.join("\n");

    // Measure the notice block height so we can draw a background
    const noticeWrapped = wrapText(
        noticeText,
        nunitoRegular,
        FONT_SIZE_BODY,
        CONTENT_WIDTH - 20, // inner padding
    );
    const noticeLH = LINE_HEIGHT_BODY;
    const noticeBlockHeight = noticeWrapped.length * noticeLH + 16; // 8px padding top+bottom

    cursor.ensureSpace(noticeBlockHeight + 4);

    // Background box
    const noticeColour = rgb(1.0, 0.97, 0.88); // warm cream
    const noticeBorder = rgb(0.85, 0.75, 0.45); // muted gold
    cursor.page.drawRectangle({
        x: MARGIN_LEFT,
        y: cursor.y - noticeBlockHeight + 8,
        width: CONTENT_WIDTH,
        height: noticeBlockHeight,
        color: noticeColour,
        borderColor: noticeBorder,
        borderWidth: 0.75,
    });

    // Draw the notice text inside the box
    cursor.y -= 4; // top padding
    const savedX = MARGIN_LEFT + 10;
    for (const line of noticeWrapped) {
        cursor.page.drawText(line, {
            x: savedX,
            y: cursor.y,
            size: FONT_SIZE_BODY,
            font: nunitoRegular,
            color: COLOUR_DARK_GREY,
        });
        cursor.y -= noticeLH;
    }
    cursor.y -= 8; // bottom padding

    cursor.y -= SECTION_GAP;

    // ── Sections ────────────────────────────────────────────────────────

    for (let si = 0; si < sections.length; si++) {
        const section = sections[si].sections_id;
        if (!section) continue;

        const sectionNumber = si + 1;
        const sectionTitle = `${sectionNumber}. ${section.name}`;

        // Section heading — ensure room for heading + a bit of content
        cursor.ensureSpace(60);

        // Section heading background
        const headingHeight = 28;
        cursor.page.drawRectangle({
            x: MARGIN_LEFT,
            y: cursor.y - headingHeight + 6,
            width: CONTENT_WIDTH,
            height: headingHeight,
            color: COLOUR_SECTION_BG,
        });

        cursor.page.drawText(sectionTitle, {
            x: MARGIN_LEFT + 10,
            y: cursor.y - headingHeight + 14,
            size: FONT_SIZE_SECTION_HEADING,
            font: nunitoBold,
            color: COLOUR_VIOLET,
        });
        cursor.y -= headingHeight + 8;

        // Section description
        if (section.description) {
            const plainDesc = stripMarkdown(section.description);
            if (plainDesc) {
                cursor.drawWrappedText(
                    plainDesc,
                    nunitoRegular,
                    FONT_SIZE_BODY,
                    COLOUR_MID_GREY,
                    LINE_HEIGHT_BODY,
                );
                cursor.y -= 8;
            }
        }

        // Fields
        const fields = section.fields ?? [];
        for (let fi = 0; fi < fields.length; fi++) {
            const field = fields[fi].fields_id;
            if (!field) continue;

            const fieldNumber = fi + 1;
            const fieldId = `${section.slug}.${field.slug}`;

            // ── Field label ─────────────────────────────────────────────
            const requiredMark = field.required ? " *" : "";
            const labelText = `${sectionNumber}.${fieldNumber}. ${field.name}${requiredMark}`;

            // Estimate total height needed for label + description + widget
            const labelLines = wrapText(labelText, nunitoBold, FONT_SIZE_FIELD_LABEL, CONTENT_WIDTH);
            const labelHeight = labelLines.length * (FONT_SIZE_FIELD_LABEL + 4);
            const minFieldHeight = labelHeight + 30;
            cursor.ensureSpace(minFieldHeight);

            cursor.drawWrappedText(
                labelText,
                nunitoBold,
                FONT_SIZE_FIELD_LABEL,
                COLOUR_DARK_GREY,
                FONT_SIZE_FIELD_LABEL + 4,
            );
            cursor.y -= 2;

            // ── Field description ───────────────────────────────────────
            if (field.description) {
                const plainFieldDesc = stripMarkdown(field.description);
                if (plainFieldDesc) {
                    cursor.drawWrappedText(
                        plainFieldDesc,
                        nunitoRegular,
                        FONT_SIZE_SMALL,
                        COLOUR_MID_GREY,
                        LINE_HEIGHT_SMALL,
                    );
                    cursor.y -= 4;
                }
            }

            // ── Field widget ────────────────────────────────────────────
            switch (field.type) {
                case "Input":
                    renderInputField(cursor, form, field, fieldId, fonts);
                    break;
                case "Textarea":
                    renderTextareaField(cursor, form, field, fieldId, fonts);
                    break;
                case "Select":
                    renderSelectField(cursor, form, field, fieldId, field.slug, fonts, stageSlug);
                    break;
                case "Radios":
                    renderRadiosField(cursor, form, field, fieldId, fonts);
                    break;
                case "Checkboxes":
                    renderCheckboxesField(cursor, form, field, fieldId, fonts);
                    break;
                default:
                    // Unknown field type — just show a text field as fallback
                    renderInputField(cursor, form, field, fieldId, fonts);
                    break;
            }

            // Space between fields
            if (fi < fields.length - 1) {
                cursor.y -= FIELD_GAP;
            }
        }

        // Space between sections
        if (si < sections.length - 1) {
            cursor.y -= SECTION_GAP;
        }
    }

    // ── Footer on last page ─────────────────────────────────────────────

    cursor.ensureSpace(50);
    cursor.y -= 10;
    cursor.page.drawLine({
        start: { x: MARGIN_LEFT, y: cursor.y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: cursor.y },
        thickness: 0.5,
        color: COLOUR_LIGHT_GREY,
    });
    cursor.y -= 16;

    cursor.drawWrappedText(
        `Submit your application at: ${applyUrl}`,
        nunitoBold,
        FONT_SIZE_BODY,
        COLOUR_VIOLET,
        LINE_HEIGHT_BODY,
    );
    cursor.y -= 4;
    cursor.drawWrappedText(
        "This form is for preparation purposes only. Your official submission must be made through the UnLtd Application Portal.",
        nunitoRegular,
        FONT_SIZE_SMALL,
        COLOUR_MID_GREY,
        LINE_HEIGHT_SMALL,
    );
    cursor.y -= 4;
    cursor.drawWrappedText(
        `Download the latest version of this form: ${downloadUrl}`,
        nunitoRegular,
        FONT_SIZE_SMALL,
        COLOUR_MID_GREY,
        LINE_HEIGHT_SMALL,
    );

    // Update all field appearances to use Nunito
    form.updateFieldAppearances(nunitoRegular);

    return pdfDoc.save();
}
