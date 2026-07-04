const fs = require("node:fs");
const path = require("node:path");

const postcss = require("postcss");
const tailwindcss = require("tailwindcss");

const rootDir = __dirname;
const globalSelectorPattern = /(^|})\s*(html|body|h1|h2|h3|a)\s*\{/;

async function compileFlowzeroTailwind() {
  const input = fs.readFileSync(
    path.join(rootDir, "src/style/tailwind.css"),
    "utf8"
  );
  const config = require(path.join(rootDir, "tailwind.config.js"));

  const result = await postcss([tailwindcss(config)]).process(input, {
    from: path.join(rootDir, "src/style/tailwind.css"),
  });

  return result.css;
}

describe("FlowZero Tailwind CSS isolation", () => {
  it("does not emit global base selectors into the shared shell document", async () => {
    const css = await compileFlowzeroTailwind();

    expect(css).not.toMatch(globalSelectorPattern);
    expect(css).not.toMatch(/(^|})\s*\.container\s*\{/);
    expect(css).not.toMatch(/(^|})\s*\.text-xl\s*\{/);
    expect(css).not.toMatch(/(^|})\s*\*,\s*::before,\s*::after\s*\{/);
    expect(css).not.toMatch(/(^|})\s*body\s+\*::/);
  });

  it("keeps FlowZero app CSS selectors scoped away from shell widgets", () => {
    const css = fs.readFileSync(path.join(rootDir, "src/style/app.css"), "utf8");

    expect(css).not.toMatch(/(^|})\s*\.tabmain\s*\{/);
    expect(css).not.toMatch(/(^|})\s*body\s+\*::/);
    expect(css).not.toMatch(globalSelectorPattern);
  });
});
