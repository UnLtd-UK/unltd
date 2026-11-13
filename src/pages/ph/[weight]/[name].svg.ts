import type { APIRoute, GetStaticPaths } from "astro";
import fs from "node:fs";
import path from "node:path";

// Phosphor icons as static files (/ph/<weight>/<name>.svg), written at build
// time. They are served from the assets, so they stay out of the Worker
// bundle, which has a size limit; PhosphorIcon reads the one it needs.
export const prerender = true;

const WEIGHTS = ["regular", "fill"] as const;
const root = path.resolve("node_modules/@phosphor-icons/core/assets");

// Phosphor names the files <name>.svg for regular and <name>-fill.svg for fill.
const fileName = (weight: string, name: string) => (weight === "regular" ? `${name}.svg` : `${name}-${weight}.svg`);

export const getStaticPaths = (() =>
  WEIGHTS.flatMap((weight) =>
    fs
      .readdirSync(path.join(root, weight))
      .filter((file) => file.endsWith(".svg"))
      .map((file) => file.replace(/\.svg$/, ""))
      .map((base) => ({
        params: { weight, name: weight === "regular" ? base : base.replace(new RegExp(`-${weight}$`), "") },
      })),
  )) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const svg = fs.readFileSync(path.join(root, params.weight!, fileName(params.weight!, params.name!)), "utf8");
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
