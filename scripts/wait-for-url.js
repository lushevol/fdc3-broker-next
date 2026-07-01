#!/usr/bin/env node

const url = process.argv[2];
const timeoutMs = Number(process.argv[3] ?? 30000);
const intervalMs = Number(process.argv[4] ?? 500);

if (!url) {
  console.error('Usage: node scripts/wait-for-url.js <url> [timeoutMs] [intervalMs]');
  process.exit(2);
}

const startedAt = Date.now();

async function waitForUrl() {
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`Ready: ${url}`);
        return;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  console.error(`Timed out waiting for ${url}`);
  process.exit(1);
}

waitForUrl();
