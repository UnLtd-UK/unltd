// @typescript-eslint/* refuses to load with typescript 7+, but this project
// intentionally runs typescript@7 for the app. Give those packages (and
// ts-api-utils) their own typescript@6 instead of the project's typescript@7.
// See https://github.com/typescript-eslint/typescript-eslint/issues/10940
const TS6 = "npm:typescript@^6";

function readPackage(pkg) {
  if (pkg.name?.startsWith("@typescript-eslint/") || pkg.name === "ts-api-utils") {
    if (pkg.peerDependencies?.typescript) {
      delete pkg.peerDependencies.typescript;
      if (pkg.peerDependenciesMeta) delete pkg.peerDependenciesMeta.typescript;
      pkg.dependencies = { ...pkg.dependencies, typescript: TS6 };
    }
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
