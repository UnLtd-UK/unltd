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
    PDFName,
    PDFString,
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
        date_updated?: string;
    };
}

interface SectionData {
    sections_id: {
        name: string;
        slug: string;
        description?: string;
        fields: FieldData[];
        date_updated?: string;
    };
}

interface ResourceData {
    name: string;
    slug: string;
    description?: string;
    external_url?: string;
}

interface AwardData {
    name: string;
    grant: number;
    stage: string;
    programme: { name: string };
}

interface GeneratePdfOptions {
    applicationName: string;
    slug: string;
    stageSlug?: string;
    stageText?: string;
    sections: SectionData[];
    awards?: AwardData[];
    resources?: ResourceData[];
    tradingDescription?: string;
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
const COLOUR_WHITE = rgb(1, 1, 1);
const COLOUR_WARNING_BG = rgb(0.85, 0.12, 0.12); // strong red
const COLOUR_WARNING_BORDER = rgb(0.65, 0.08, 0.08);

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

// ─── Link annotations ──────────────────────────────────────────────────

/**
 * Create a clickable URL annotation on a PDF page.
 * Uses the low-level pdf-lib API since there's no high-level link method.
 *
 * @param page  The page to attach the link to
 * @param uri   The full URL (include https://)
 * @param rect  [x1, y1, x2, y2] — lower-left to upper-right bounding box
 */
function addLinkAnnotation(
    page: PDFPage,
    uri: string,
    rect: [number, number, number, number],
): void {
    const context = page.doc.context;
    const linkDict = context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: rect,
        Border: [0, 0, 0],
        C: [0, 0, 0],
        A: {
            Type: "Action",
            S: "URI",
            URI: PDFString.of(uri),
        },
    });
    const linkRef = context.register(linkDict);

    // Append to existing annotations (form fields create widget annotations)
    const annotsRef = page.node.get(PDFName.of("Annots"));
    if (annotsRef) {
        const annots = context.lookup(annotsRef) as any;
        if (annots && typeof annots.push === "function") {
            annots.push(linkRef);
        } else {
            page.node.set(PDFName.of("Annots"), context.obj([annotsRef, linkRef]));
        }
    } else {
        page.node.set(PDFName.of("Annots"), context.obj([linkRef]));
    }
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

    /** Draw a single line of text as a clickable URL link */
    drawLinkedText(
        displayText: string,
        url: string,
        font: PDFFont,
        fontSize: number,
        color = COLOUR_VIOLET,
        xOffset = 0,
    ): void {
        const lh = fontSize + 4;
        this.ensureSpace(lh);

        const x = MARGIN_LEFT + xOffset;
        this.page.drawText(displayText, {
            x,
            y: this.y,
            size: fontSize,
            font,
            color,
        });

        const textWidth = font.widthOfTextAtSize(displayText, fontSize);
        addLinkAnnotation(this.page, url, [
            x,
            this.y - 2,
            x + textWidth,
            this.y + fontSize,
        ]);

        this.y -= lh;
    }

    /** Draw wrapped text that contains a URL — renders the URL portion as a clickable link */
    drawWrappedTextWithLink(
        textBefore: string,
        linkText: string,
        url: string,
        textAfter: string,
        font: PDFFont,
        fontSize: number,
        color = COLOUR_DARK_GREY,
        linkColor = COLOUR_VIOLET,
        lineHeight?: number,
    ): void {
        const lh = lineHeight ?? fontSize + 4;
        this.ensureSpace(lh);

        let x = MARGIN_LEFT;

        if (textBefore) {
            this.page.drawText(textBefore, {
                x,
                y: this.y,
                size: fontSize,
                font,
                color,
            });
            x += font.widthOfTextAtSize(textBefore, fontSize);
        }

        // Draw the linked portion
        this.page.drawText(linkText, {
            x,
            y: this.y,
            size: fontSize,
            font,
            color: linkColor,
        });

        const linkWidth = font.widthOfTextAtSize(linkText, fontSize);
        addLinkAnnotation(this.page, url, [
            x,
            this.y - 2,
            x + linkWidth,
            this.y + fontSize,
        ]);
        x += linkWidth;

        if (textAfter) {
            this.page.drawText(textAfter, {
                x,
                y: this.y,
                size: fontSize,
                font,
                color,
            });
        }

        this.y -= lh;
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
        cursor.drawWrappedTextWithLink(
            "File uploads must be submitted via the Application Portal at ",
            "portal.unltd.org.uk",
            "https://portal.unltd.org.uk",
            "",
            fonts.regular,
            FONT_SIZE_BODY,
            COLOUR_MID_GREY,
            COLOUR_VIOLET,
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
    const { applicationName, slug, stageSlug, stageText, sections, awards, resources } = options;

    // Find the most recent date_updated across all sections and fields
    const allDates: number[] = [];
    for (const sec of sections) {
        if (sec.sections_id?.date_updated) {
            allDates.push(new Date(sec.sections_id.date_updated).getTime());
        }
        for (const field of sec.sections_id?.fields ?? []) {
            if (field.fields_id?.date_updated) {
                allDates.push(new Date(field.fields_id.date_updated).getTime());
            }
        }
    }
    const lastUpdated = allDates.length > 0
        ? new Date(Math.max(...allDates))
        : new Date();

    const applyUrl = `unltd.org.uk/awards/${slug}`;
    const applyUrlFull = `https://${applyUrl}`;
    const downloadUrl = `unltd.org.uk/awards/downloads/${slug}.pdf`;
    const downloadUrlFull = `https://${downloadUrl}`;

    const pdfDoc = await PDFDocument.create();

    // Register fontkit for custom font embedding
    pdfDoc.registerFontkit(fontkit);

    // Metadata
    pdfDoc.setTitle("Draft your UnLtd Award application before you apply");
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
    cursor.y -= logoHeight + 12;

    // ── PDF metadata / version stamp ────────────────────────────────

    const versionDate = lastUpdated.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const versionTime = lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    cursor.drawWrappedText(
        `Based on application data from ${versionDate} at ${versionTime}.`,
        nunitoRegular,
        FONT_SIZE_SMALL,
        COLOUR_MID_GREY,
        LINE_HEIGHT_SMALL,
    );
    cursor.drawWrappedTextWithLink(
        "Ensure you have the latest version: ",
        downloadUrl,
        downloadUrlFull,
        "",
        nunitoRegular,
        FONT_SIZE_SMALL,
        COLOUR_MID_GREY,
        COLOUR_VIOLET,
        LINE_HEIGHT_SMALL,
    );
    cursor.y -= 8;

    // ── Title ───────────────────────────────────────────────────────

    cursor.drawWrappedText(
        "Draft your UnLtd Award application before you apply",
        nunitoBold,
        18,
        COLOUR_BLACK,
        22,
    );
    cursor.y -= 2;

    // ── Fillable PDF explanation ────────────────────────────────────

    cursor.drawWrappedText(
        "This is a fillable PDF — you can type your answers directly into the form fields below. Use it to draft your responses offline before submitting your application online. When you're ready, copy and paste your answers into the online application form.",
        nunitoRegular,
        FONT_SIZE_BODY,
        COLOUR_DARK_GREY,
        LINE_HEIGHT_BODY,
    );
    cursor.y -= 10;

    // Divider
    cursor.page.drawLine({
        start: { x: MARGIN_LEFT, y: cursor.y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: cursor.y },
        thickness: 0.5,
        color: COLOUR_LIGHT_GREY,
    });
    cursor.y -= 10;

    // ── Eligible awards ─────────────────────────────────────────────

    if (awards && awards.length > 0) {
        cursor.page.drawText("Your eligible awards", {
            x: MARGIN_LEFT,
            y: cursor.y,
            size: FONT_SIZE_SUBTITLE,
            font: nunitoBold,
            color: COLOUR_VIOLET,
        });
        cursor.y -= FONT_SIZE_SUBTITLE + 4;

        cursor.drawWrappedText(
            "Based on the eligibility checker, you could be eligible for the following awards:",
            nunitoRegular,
            FONT_SIZE_BODY,
            COLOUR_MID_GREY,
            LINE_HEIGHT_BODY,
        );
        cursor.y -= 2;

        for (const award of awards) {
            const stageLabel = award.stage === "starting-up" ? "Starting Up" : "Scaling Up";
            const grantFormatted = award.grant ? `up to \u00A3${award.grant.toLocaleString("en-GB")}` : "";
            const awardLine = `\u2022  ${stageLabel} — ${award.programme.name}${grantFormatted ? ` (${grantFormatted})` : ""}`;
            cursor.drawWrappedText(
                sanitiseForPdf(awardLine),
                nunitoRegular,
                FONT_SIZE_BODY,
                COLOUR_DARK_GREY,
                LINE_HEIGHT_BODY,
            );
        }
        cursor.y -= 10;

        // Divider
        cursor.page.drawLine({
            start: { x: MARGIN_LEFT, y: cursor.y },
            end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: cursor.y },
            thickness: 0.5,
            color: COLOUR_LIGHT_GREY,
        });
        cursor.y -= 10;
    }

    // ── AI statement ────────────────────────────────────────────────

    cursor.page.drawText("A note on using AI", {
        x: MARGIN_LEFT,
        y: cursor.y,
        size: FONT_SIZE_SUBTITLE,
        font: nunitoBold,
        color: COLOUR_VIOLET,
    });
    cursor.y -= FONT_SIZE_SUBTITLE + 4;

    cursor.drawWrappedText(
        "We know that AI chatbots can be helpful — they can make writing clearer and more structured. We encourage you to use them if they help you share your plans. But we want to hear your voice. If you use AI, please do so thoughtfully — as a tool, not a substitute. The more you personalise your responses and share your genuine values and vision, the stronger your application will be.",
        nunitoRegular,
        FONT_SIZE_BODY,
        COLOUR_DARK_GREY,
        LINE_HEIGHT_BODY,
    );
    cursor.y -= 10;

    // Divider
    cursor.page.drawLine({
        start: { x: MARGIN_LEFT, y: cursor.y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: cursor.y },
        thickness: 0.5,
        color: COLOUR_LIGHT_GREY,
    });
    cursor.y -= 10;

    // ── Resources ───────────────────────────────────────────────────

    if (resources && resources.length > 0) {
        cursor.page.drawText("Helpful resources", {
            x: MARGIN_LEFT,
            y: cursor.y,
            size: FONT_SIZE_SUBTITLE,
            font: nunitoBold,
            color: COLOUR_VIOLET,
        });
        cursor.y -= FONT_SIZE_SUBTITLE + 4;

        cursor.drawWrappedText(
            "The following resources are available to help you with your application:",
            nunitoRegular,
            FONT_SIZE_BODY,
            COLOUR_MID_GREY,
            LINE_HEIGHT_BODY,
        );
        cursor.y -= 4;

        for (const resource of resources) {
            // Resource title
            cursor.ensureSpace(30);
            const resourceUrl = resource.external_url
                ? (resource.external_url.startsWith("http") ? resource.external_url : `https://${resource.external_url}`)
                : `https://unltd.org.uk/spaces/${resource.slug}`;
            const resourceDisplayUrl = resource.external_url
                ? resource.external_url.replace(/^https?:\/\//, "")
                : `unltd.org.uk/spaces/${resource.slug}`;

            // Bold resource name
            cursor.page.drawText(sanitiseForPdf(`\u2022  ${resource.name}`), {
                x: MARGIN_LEFT,
                y: cursor.y,
                size: FONT_SIZE_BODY,
                font: nunitoBold,
                color: COLOUR_DARK_GREY,
            });
            cursor.y -= LINE_HEIGHT_BODY;

            // Resource description
            if (resource.description) {
                cursor.drawWrappedTextIndented(
                    stripMarkdown(resource.description),
                    nunitoRegular,
                    FONT_SIZE_SMALL,
                    14,
                    COLOUR_MID_GREY,
                    LINE_HEIGHT_SMALL,
                );
            }

            // Clickable URL
            cursor.drawLinkedText(
                resourceDisplayUrl,
                resourceUrl,
                nunitoRegular,
                FONT_SIZE_SMALL,
                COLOUR_VIOLET,
                14,
            );
            cursor.y -= 4;
        }
        cursor.y -= 6;

        // Divider
        cursor.page.drawLine({
            start: { x: MARGIN_LEFT, y: cursor.y },
            end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: cursor.y },
            thickness: 0.5,
            color: COLOUR_LIGHT_GREY,
        });
        cursor.y -= 10;
    }

    // ── Where to apply — DO NOT EMAIL warning ───────────────────────

    const warningHeading = "DO NOT email us this form — This is NOT how you apply.";
    const warningBody_before = "This PDF is for drafting your answers offline only. Do not email this form to UnLtd. We will not accept emailed applications.";
    const warningSteps = [
        "How to submit your application:",
        `1. Go to: ${applyUrl}`,
        "2. Click 'Apply now'",
        "3. Sign up or sign in to the Application Portal",
        "4. Start your application online",
        "5. Copy and paste your drafted answers from this PDF into the online form",
    ];
    const warningBody = [warningBody_before, "", ...warningSteps].join("\n");

    // Measure the warning block height
    const warningHeadingLines = wrapText(warningHeading, nunitoBold, FONT_SIZE_SECTION_HEADING, CONTENT_WIDTH - 24);
    const warningBodyLines = wrapText(warningBody, nunitoRegular, FONT_SIZE_BODY, CONTENT_WIDTH - 24);
    const warningHeadingHeight = warningHeadingLines.length * (FONT_SIZE_SECTION_HEADING + 6);
    const warningBodyHeight = warningBodyLines.length * LINE_HEIGHT_BODY;
    const warningBlockHeight = warningHeadingHeight + warningBodyHeight + 32; // padding

    cursor.ensureSpace(warningBlockHeight + 4);

    // Red background box
    const warningBoxTop = cursor.y;
    cursor.page.drawRectangle({
        x: MARGIN_LEFT,
        y: cursor.y - warningBlockHeight + 8,
        width: CONTENT_WIDTH,
        height: warningBlockHeight,
        color: COLOUR_WARNING_BG,
        borderColor: COLOUR_WARNING_BORDER,
        borderWidth: 1.5,
    });

    // Warning heading (bold, white, large)
    cursor.y -= 10; // top padding
    for (const line of warningHeadingLines) {
        cursor.page.drawText(line, {
            x: MARGIN_LEFT + 12,
            y: cursor.y,
            size: FONT_SIZE_SECTION_HEADING,
            font: nunitoBold,
            color: COLOUR_WHITE,
        });
        cursor.y -= FONT_SIZE_SECTION_HEADING + 6;
    }
    cursor.y -= 4;

    // Warning body (regular, white) — track the apply URL line to add link
    for (const line of warningBodyLines) {
        cursor.page.drawText(line, {
            x: MARGIN_LEFT + 12,
            y: cursor.y,
            size: FONT_SIZE_BODY,
            font: nunitoRegular,
            color: COLOUR_WHITE,
        });

        // Make the apply URL clickable within the warning box
        if (line.includes(applyUrl)) {
            const prefixText = line.substring(0, line.indexOf(applyUrl));
            const prefixWidth = prefixText ? nunitoRegular.widthOfTextAtSize(prefixText, FONT_SIZE_BODY) : 0;
            const urlWidth = nunitoRegular.widthOfTextAtSize(applyUrl, FONT_SIZE_BODY);
            addLinkAnnotation(cursor.page, applyUrlFull, [
                MARGIN_LEFT + 12 + prefixWidth,
                cursor.y - 2,
                MARGIN_LEFT + 12 + prefixWidth + urlWidth,
                cursor.y + FONT_SIZE_BODY,
            ]);
        }

        cursor.y -= LINE_HEIGHT_BODY;
    }
    cursor.y -= 12; // bottom padding

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

    // ── Footer warning — DO NOT EMAIL (repeat) ─────────────────────────

    const footerHeading = "REMINDER: Do NOT email this form to UnLtd.";
    const footerBody = [
        "This PDF is for drafting only. We do not accept emailed applications.",
        "",
        `To apply, go to: ${applyUrl}`,
        "Click 'Apply now', sign up or sign in, and submit your application through the online portal.",
        "You can copy and paste your answers from this PDF into the online form.",
    ].join("\n");

    const footerHeadingLines = wrapText(footerHeading, nunitoBold, FONT_SIZE_SECTION_HEADING, CONTENT_WIDTH - 24);
    const footerBodyLines = wrapText(footerBody, nunitoRegular, FONT_SIZE_BODY, CONTENT_WIDTH - 24);
    const footerHeadingHeight = footerHeadingLines.length * (FONT_SIZE_SECTION_HEADING + 6);
    const footerBodyHeight = footerBodyLines.length * LINE_HEIGHT_BODY;
    const footerBlockHeight = footerHeadingHeight + footerBodyHeight + 32;

    cursor.ensureSpace(footerBlockHeight + 20);
    cursor.y -= 10;

    // Red background box
    cursor.page.drawRectangle({
        x: MARGIN_LEFT,
        y: cursor.y - footerBlockHeight + 8,
        width: CONTENT_WIDTH,
        height: footerBlockHeight,
        color: COLOUR_WARNING_BG,
        borderColor: COLOUR_WARNING_BORDER,
        borderWidth: 1.5,
    });

    // Footer heading (bold, white, large)
    cursor.y -= 10;
    for (const line of footerHeadingLines) {
        cursor.page.drawText(line, {
            x: MARGIN_LEFT + 12,
            y: cursor.y,
            size: FONT_SIZE_SECTION_HEADING,
            font: nunitoBold,
            color: COLOUR_WHITE,
        });
        cursor.y -= FONT_SIZE_SECTION_HEADING + 6;
    }
    cursor.y -= 4;

    // Footer body (regular, white) — make apply URL clickable
    for (const line of footerBodyLines) {
        cursor.page.drawText(line, {
            x: MARGIN_LEFT + 12,
            y: cursor.y,
            size: FONT_SIZE_BODY,
            font: nunitoRegular,
            color: COLOUR_WHITE,
        });

        if (line.includes(applyUrl)) {
            const prefixText = line.substring(0, line.indexOf(applyUrl));
            const prefixWidth = prefixText ? nunitoRegular.widthOfTextAtSize(prefixText, FONT_SIZE_BODY) : 0;
            const urlWidth = nunitoRegular.widthOfTextAtSize(applyUrl, FONT_SIZE_BODY);
            addLinkAnnotation(cursor.page, applyUrlFull, [
                MARGIN_LEFT + 12 + prefixWidth,
                cursor.y - 2,
                MARGIN_LEFT + 12 + prefixWidth + urlWidth,
                cursor.y + FONT_SIZE_BODY,
            ]);
        }

        cursor.y -= LINE_HEIGHT_BODY;
    }
    cursor.y -= 12;

    // Update all field appearances to use Nunito
    form.updateFieldAppearances(nunitoRegular);

    return pdfDoc.save();
}
