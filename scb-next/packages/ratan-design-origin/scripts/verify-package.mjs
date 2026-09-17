import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import postcss from "postcss";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const consumer = await mkdtemp(join(tmpdir(), "ratan-design-origin-consumer-"));
const npm = (args, cwd = consumer) =>
  execFileSync("npm", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
await cp(join(root, "fixtures/consumer"), consumer, { recursive: true });
const [packed] = JSON.parse(
  npm(["pack", "--json", "--pack-destination", consumer], root)
);
assert(packed.files.some(({ path }) => path === "dist/styles.css"));
assert.equal(
  packed.files.filter(({ path }) => path.endsWith(".woff2")).length,
  13
);
npm([
  "install",
  "--ignore-scripts",
  "--no-audit",
  "--no-fund",
  "--registry=https://registry.npmjs.org",
  "--cache=/tmp/npm-cache",
  join(consumer, packed.filename),
]);
console.log(npm(["run", "typecheck"]));
console.log(npm(["run", "typecheck", "--", "--moduleResolution", "node"]));
console.log(npm(["run", "build"]));

const installed = join(consumer, "node_modules/ratan-design-origin");
const css = postcss.parse(
  await readFile(join(installed, "dist/styles.css"), "utf8")
);
css.walkRules((rule) => {
  if (rule.parent.type === "atrule" && rule.parent.name === "font-face") return;
  assert(
    /^\.ratan-design-root\[data-generation="(legacy|webkit)"\]/.test(
      rule.selector
    ),
    `Unscoped selector: ${rule.selector}`
  );
});
css.walkAtRules("import", () =>
  assert.fail("CSS cannot import sibling stylesheets")
);
const manifest = JSON.parse(
  await readFile(join(installed, "package.json"), "utf8")
);
assert(!manifest.dependencies, "Core must only have external peers");

const { build } = await import(
  pathToFileURL(join(consumer, "node_modules/vite/dist/node/index.js"))
);
const modules = [];
const peers =
  /^(react|react-dom|@mui\/material|@mui\/icons-material|@emotion\/react|@emotion\/styled)(\/|$)/;
const result = await build({
  root: consumer,
  configFile: false,
  logLevel: "warn",
  plugins: [
    {
      name: "capture-package-modules",
      generateBundle() {
        modules.push(...this.getModuleIds());
      },
    },
  ],
  build: {
    write: false,
    lib: { entry: join(consumer, "src/button.ts"), formats: ["es"] },
    rolldownOptions: { external: peers },
  },
});
const code = (Array.isArray(result) ? result : [result])
  .flatMap((bundle) => bundle.output)
  .filter((item) => item.type === "chunk")
  .map((item) => item.code)
  .join("\n");
assert(
  !/(x-data-grid|x-date-pickers|AdminRecord|customElements|createRatanTheme|legacyColor|react\.production)/.test(
    code
  )
);
assert(
  !code.includes("var(--sc-") && !code.includes("ratan-design-root"),
  "Button-only import retained provider/token CSS"
);
assert(
  !modules.some((id) => /node_modules\/(react|react-dom)\//.test(id)),
  "React was bundled"
);
console.log(
  `Button-only external-peer bundle: ${Buffer.byteLength(code)} bytes`
);
await build({
  root: consumer,
  configFile: false,
  logLevel: "warn",
  ssr: { noExternal: true },
  build: { ssr: "src/server.tsx", outDir: "dist-server" },
});
execFileSync(process.execPath, [join(consumer, "dist-server/server.js")], {
  cwd: consumer,
  stdio: "inherit",
});
assert((await readdir(join(installed, "dist/fonts"))).length === 13);
console.log(`Independent tarball consumer verified: ${consumer}`);
