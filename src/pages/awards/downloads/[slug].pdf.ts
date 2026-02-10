/**
 * Static PDF endpoint — generates a fillable application form PDF at build time.
 *
 * For each "new" application, Astro builds a static file at:
 *   /awards/downloads/{slug}.pdf
 *
 * Users download this directly — no server required at runtime.
 */

import type { GetStaticPaths } from "astro";
import { getNewApplications, getApplicationWithAwards } from "@data/applications.js";
import { generateApplicationPdf } from "@lib/generate-application-pdf";

export const getStaticPaths: GetStaticPaths = () => {
    const applications = getNewApplications();
    return applications.map((app) => ({
        params: { slug: app.slug },
    }));
};

export async function GET({ params }: { params: { slug: string } }) {
    const result = getApplicationWithAwards(params.slug);

    if (!result) {
        return new Response("Not found", { status: 404 });
    }

    const { application } = result;

    const pdfBytes = await generateApplicationPdf({
        applicationName: application.name,
        slug: application.slug,
        stageSlug: application.stage,
        stageText: application.stage_text,
        sections: application.sections ?? [],
    });

    return new Response(pdfBytes, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${application.slug}-application-form.pdf"`,
        },
    });
}
