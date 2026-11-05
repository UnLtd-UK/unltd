/**
 * Static PDF endpoint — generates a fillable application form PDF at build time.
 *
 * For each "new" application, Astro builds a static file at:
 *   /awards/downloads/{slug}.pdf
 *
 * Users download this directly — no server required at runtime.
 */

import type { GetStaticPaths } from "astro";
import { applications, getApplicationBySlug } from "@data/applications";
import { generateApplicationPdf } from "@lib/generate-application-pdf";

const isVisibleStatus = (status?: string) => status === "published";

export const getStaticPaths: GetStaticPaths = () => {
    return applications
        .filter((app: { status?: string }) => isVisibleStatus(app.status))
        .map((app: { slug: string }) => ({
            params: { slug: app.slug },
        }));
};

export async function GET({ params }: { params: { slug: string } }) {
    const application = getApplicationBySlug(params.slug);
    if (!application || !isVisibleStatus(application.status)) {
        return new Response("Not found", { status: 404 });
    }

    const pdfBytes = await generateApplicationPdf({
        applicationTitle: application.title,
        applicationSubtitle: application.subtitle,
        slug: application.slug,
        stageSlug: application.portalValue ?? undefined,
        stageText: application.stageText ?? undefined,
        sections: application.sections,
        awards: application.awards,
        resources: application.resources,
    });

    return new Response(pdfBytes.buffer as ArrayBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${application.slug}-application-form.pdf"`,
        },
    });
}
