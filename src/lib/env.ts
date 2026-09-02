// Resolves a build-time secret from process.env, falling back to reading it
// straight out of local dev env files (mirrors src/data/eventCollections.ts),
// since .dev.vars isn't automatically loaded into process.env by Astro/Node.
const candidateFiles = [".dev.vars", ".env.local", ".env"];

function extractValueFromEnvFile(contents: string, key: string): string | undefined {
    const lines = contents.split(/\r?\n/);

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) {
            continue;
        }

        const [lhs, ...rest] = line.split("=");
        if (!lhs || lhs.trim() !== key) {
            continue;
        }

        let value = rest.join("=").trim();
        if (!value) {
            return undefined;
        }

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        return value;
    }

    return undefined;
}

export async function resolveEnvVar(key: string): Promise<string | undefined> {
    const fromProcessEnv = process.env[key];
    if (fromProcessEnv && fromProcessEnv.trim().length > 0) {
        return fromProcessEnv.trim();
    }

    if (typeof process === "undefined" || !process.versions?.node) {
        return undefined;
    }

    const fs = await import("node:fs/promises");

    for (const fileName of candidateFiles) {
        try {
            const fileUrl = new URL(`../../${fileName}`, import.meta.url);
            const fileContents = await fs.readFile(fileUrl, "utf-8");
            const value = extractValueFromEnvFile(fileContents, key);
            if (value) {
                return value;
            }
        } catch (error: any) {
            if (error?.code && error.code !== "ENOENT") {
                console.warn(`[env] Unable to read ${fileName} for ${key}:`, error);
            }
        }
    }

    return undefined;
}
