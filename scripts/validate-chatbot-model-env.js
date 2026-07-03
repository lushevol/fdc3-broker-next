#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const activeEnv = process.env.ACTIVE_ENV || process.argv[2] || 'dev';
const profilePath = path.resolve(process.cwd(), `.env.profile.${activeEnv}`);
const localProfilePath = path.resolve(process.cwd(), `.env.profile.${activeEnv}.local`);

function parseEnvProfile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, rawLine) => {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        return env;
      }

      const equalsAt = line.indexOf('=');
      if (equalsAt < 0) {
        return env;
      }

      const key = line.slice(0, equalsAt).trim();
      const value = line
        .slice(equalsAt + 1)
        .trim()
        .replace(/^['"]|['"]$/g, '');
      env[key] = value;
      return env;
    }, {});
}

const profileEnv = parseEnvProfile(profilePath);
const localProfileEnv = parseEnvProfile(localProfilePath);
const env = { ...profileEnv, ...localProfileEnv, ...process.env };

function isMissing(value) {
  return !value || value === 'your-api-key-here' || value === 'changeme';
}

const missing = [];
if (isMissing(env.CHATBOT_OPENAI_API_KEY)) {
  missing.push('CHATBOT_OPENAI_API_KEY');
}
if (isMissing(env.CHATBOT_OPENAI_BASE_URL)) {
  missing.push('CHATBOT_OPENAI_BASE_URL');
}
if (isMissing(env.CHATBOT_OPENAI_MODEL)) {
  missing.push('CHATBOT_OPENAI_MODEL');
}

if (missing.length > 0) {
  console.error(
    `Missing real chatbot model configuration for profile "${activeEnv}": ${missing.join(', ')}`,
  );
  console.error(
    'Set these variables in your shell or add them to the local profile before running npm run dev:flowzero-chatbot.',
  );
  console.error(
    'The launcher refuses to start without a real model so the chatbot cannot fall back to mock replies.',
  );
  process.exit(1);
}

console.log(
  `Using real chatbot model ${env.CHATBOT_OPENAI_MODEL} at ${env.CHATBOT_OPENAI_BASE_URL}`,
);
