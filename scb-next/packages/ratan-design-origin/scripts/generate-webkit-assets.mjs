import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import postcss from "postcss";
import ts from "typescript";
import { appendScopedTokenRules } from "./token-css.mjs";

const canonical = fileURLToPath(
  new URL("../../../../sc-dev-web/sc-dev-web/dist/", import.meta.url)
);
const destination = fileURLToPath(new URL("../assets/", import.meta.url));
const sources = [
  "ScStyleguide.css",
  "ScGDSStyleGuide.css",
  "ScLightMode.css",
  "ScDarkMode.css",
];
const output = postcss.root();
// ScStyleguide's unmodified root uses var(--sc-font-size, 1rem).
output.append(
  postcss
    .rule({ selector: ".ratan-design-root[data-generation=\"webkit\"]" })
    .append(postcss.decl({ prop: "--sc-font-size", value: "1rem" }))
);
// ScDarkMode omits the light mode's exported data-grid focus shadow.
output.append(
  postcss
    .rule({
      selector:
        ".ratan-design-root[data-generation=\"webkit\"][data-mode=\"dark\"]",
    })
    .append(
      postcss.decl({
        prop: "--sc-data-grid-cell-focus-shadow-color",
        value: "var(--sc-color-blue-250-dark)",
      }),
      postcss.decl({
        prop: "--sc-data-grid-cell-focus-shadow",
        value:
          "0px 0px 0px 2px var(--sc-data-grid-cell-focus-shadow-color)",
      })
    )
);
const hashes = {};
const fontFiles = new Set();

for (const name of sources) {
  const content = await readFile(join(canonical, "styles", name), "utf8");
  hashes[name] = createHash("sha256").update(content).digest("hex");
  const source = postcss.parse(content);
  appendScopedTokenRules(source, output, name);
  source.walkAtRules("font-face", (rule) => {
    const src = rule.nodes.find(
      (node) =>
        node.type === "decl" &&
        node.prop === "src" &&
        node.value.includes(".woff2")
    );
    const font = src?.value.match(/([A-Za-z0-9-]+\.woff2)/)?.[1];
    if (!font) throw new Error(`Missing portable WOFF2 font in ${name}`);
    fontFiles.add(font);
    const face = rule.clone();
    face.nodes = face.nodes.filter(
      (node) => node.type !== "decl" || node.prop !== "src"
    );
    face.append(
      postcss.decl({
        prop: "src",
        value: `url("./fonts/${font}") format("woff2")`,
      })
    );
    output.append(face);
  });
}

for (const [name, generation, mode] of [
  ["color", "webkit", ""],
  ["color.light", "webkit", "light"],
  ["color.dark", "webkit", "dark"],
  ["color.legacy", "legacy", ""],
  ["color.light.legacy", "legacy", "light"],
  ["color.dark.legacy", "legacy", "dark"],
]) {
  const content = await readFile(
    new URL(`../src/tokens/${name}.ts`, import.meta.url),
    "utf8"
  );
  const source = ts.createSourceFile(
    `${name}.ts`,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  const exported = source.statements.find(ts.isExportAssignment);
  if (!exported || !ts.isNoSubstitutionTemplateLiteral(exported.expression))
    throw new Error(`Expected a static token template in ${name}`);
  const declarations = postcss.parse(`:root { ${exported.expression.text} }`)
    .first.nodes;
  const selector = `.ratan-design-root[data-generation="${generation}"]${mode ? `[data-mode="${mode}"]` : ""}`;
  output.append(postcss.rule({ selector }).append(declarations));
}

await mkdir(join(destination, "fonts"), { recursive: true });
for (const font of fontFiles)
  await copyFile(
    join(canonical, "assets/fonts", font),
    join(destination, "fonts", font)
  );
const stylesheet = output
  .toString()
  .split("\n")
  .map((line) => line.trimEnd())
  .join("\n");
await writeFile(
  join(destination, "styles.css"),
  `/* Generated from SC WebKit 2.0.5; see webkit-sources.json. */\n${stylesheet}\n`
);
await writeFile(
  join(destination, "webkit-sources.json"),
  `${JSON.stringify({ version: "2.0.5", sha256: hashes, fonts: [...fontFiles].sort() }, null, 2)}\n`
);
console.log(`Generated scoped tokens and ${fontFiles.size} portable fonts.`);
