import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packageRoot = join(root, "packages/ratan-design-origin");
const stateDirectory = await mkdtemp(join(tmpdir(), "ratan-design-browser-"));
const consumerPathFile = join(stateDirectory, "consumer-path.txt");
const children = new Set();

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: process.env,
      stdio: "inherit",
      ...options,
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code ?? signal}`));
    });
  });

const start = (command, args, options = {}) => {
  const child = spawn(command, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
    ...options,
  });
  children.add(child);
  child.once("exit", () => children.delete(child));
  return child;
};

async function waitForUrl(url, child) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`${url} server exited with ${child.exitCode}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The development server has not bound its socket yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function stopChildren() {
  await Promise.all(
    [...children].map(
      (child) =>
        new Promise((resolve) => {
          if (child.exitCode !== null) return resolve();
          child.once("exit", resolve);
          child.kill("SIGTERM");
          setTimeout(() => {
            if (child.exitCode === null) child.kill("SIGKILL");
          }, 2_000).unref();
        }),
    ),
  );
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await stopChildren();
    process.exit(128 + (signal === "SIGINT" ? 2 : 15));
  });
}

try {
  await run("npm", ["run", "build", "--workspace", "ratan-design-origin"]);
  await run("npm", ["run", "build:storybook", "--workspace", "ratan-design-origin"]);
  await run("npm", ["run", "verify:package", "--workspace", "ratan-design-origin"], {
    env: {
      ...process.env,
      RATAN_DESIGN_CONSUMER_PATH_FILE: consumerPathFile,
    },
  });

  const consumer = (await readFile(consumerPathFile, "utf8")).trim();
  const vite = join(consumer, "node_modules/vite/bin/vite.js");
  const consumerServer = start(process.execPath, [
    vite,
    "--host",
    "127.0.0.1",
    "--port",
    "8019",
    "--strictPort",
  ], { cwd: consumer });
  const storybookServer = start(process.execPath, [
    join(root, "node_modules/vite/bin/vite.js"),
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "8020",
    "--strictPort",
    "--outDir",
    join(packageRoot, "storybook-static"),
  ]);

  await Promise.all([
    waitForUrl("http://127.0.0.1:8019", consumerServer),
    waitForUrl("http://127.0.0.1:8020/index.json", storybookServer),
  ]);

  const playwrightArgs = [
    join(root, "node_modules/@playwright/test/cli.js"),
    "test",
    "tests/e2e/browser-issues.spec.ts",
    "tests/e2e/design-origin.spec.ts",
    "tests/e2e/design-origin-storybook.spec.ts",
    "tests/e2e/design-origin-storybook-interactions.spec.ts",
    "tests/e2e/design-origin-storybook-play.spec.ts",
    "--workers=1",
  ];
  if (process.argv.includes("--update-snapshots")) {
    playwrightArgs.push("--update-snapshots");
  }
  await run(process.execPath, playwrightArgs, {
    env: {
      ...process.env,
      RATAN_DESIGN_CONSUMER_URL: "http://127.0.0.1:8019",
      RATAN_DESIGN_STORYBOOK_URL: "http://127.0.0.1:8020",
    },
  });
} finally {
  await stopChildren();
  await rm(stateDirectory, { recursive: true, force: true });
}
