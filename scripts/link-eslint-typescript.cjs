#!/usr/bin/env node
// @typescript-eslint/parser hard-refuses to load when the resolved `typescript`
// package is major version 7+ (this repo intentionally runs TS 7 for the app).
// We keep an isolated typescript@6.x copy (installed as the aliased
// `typescript-eslint-ts6` devDependency) and nest it directly inside
// @typescript-eslint/parser's own node_modules so Node resolves *that* copy
// for the parser's internal version gate, without touching the real TS 7
// install used everywhere else in the project.
// See https://github.com/typescript-eslint/typescript-eslint/issues/10940
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "node_modules", "typescript-eslint-ts6");
const targets = [
  // Covers every @typescript-eslint/* package (parser, typescript-estree,
  // project-service, types, etc.) since Node resolves `require("typescript")`
  // by walking up from each package to the nearest ancestor node_modules.
  path.join(root, "node_modules", "@typescript-eslint", "node_modules"),
  // ts-api-utils sits outside the @typescript-eslint/ scope, so it needs its own copy.
  path.join(root, "node_modules", "ts-api-utils", "node_modules"),
];

if (!fs.existsSync(source)) {
  console.error("typescript-eslint-ts6 is not installed; run `npm install` first.");
  process.exit(1);
}

for (const targetDir of targets) {
  const target = path.join(targetDir, "typescript");
  fs.mkdirSync(targetDir, { recursive: true });

  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }

  // A real copy (not a symlink) avoids Node's module loader getting confused by
  // two different real paths resolving to a package named "typescript".
  fs.cpSync(source, target, { recursive: true });
  console.log(`Copied ${path.relative(root, source)} -> ${path.relative(root, target)}`);
}
