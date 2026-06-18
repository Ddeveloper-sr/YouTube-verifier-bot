const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

const STORED_DEFAULTS = {
  VERIFY_CHANNEL_ID: '',
  VERIFIED_ROLE_ID: '',
  YOUTUBE_CHANNEL: '',
};

const STORED_KEYS = Object.keys(STORED_DEFAULTS);

function ensureConfigFile() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(STORED_DEFAULTS, null, 2) + '\n');
  }
}

function readStoredConfig() {
  ensureConfigFile();
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    return { ...STORED_DEFAULTS, ...JSON.parse(raw || '{}') };
  } catch (error) {
    throw new Error(`Could not read config.json: ${error.message}`);
  }
}

function loadConfig() {
  const stored = readStoredConfig();
  return {
    ...stored,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || stored.DISCORD_TOKEN || '',
    GUILD_ID: process.env.GUILD_ID || stored.GUILD_ID || '',
    OCR_LANG: process.env.OCR_LANG || stored.OCR_LANG || 'eng',
    OCR_DEBUG: /^(1|true|yes)$/i.test(process.env.OCR_DEBUG || stored.OCR_DEBUG || ''),
  };
}

function saveConfig(updates) {
  const current = readStoredConfig();
  const next = { ...STORED_DEFAULTS };
  for (const key of STORED_KEYS) {
    next[key] = updates[key] !== undefined ? String(updates[key] || '') : String(current[key] || '');
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2) + '\n');
  return loadConfig();
}

function assertRuntimeConfig() {
  const config = loadConfig();
  const missing = [];
  if (!config.DISCORD_TOKEN) missing.push('DISCORD_TOKEN');
  if (!config.GUILD_ID) missing.push('GUILD_ID');
  if (missing.length) {
    throw new Error(`Missing required environment value(s): ${missing.join(', ')}`);
  }
}

function isBotConfigured(config = loadConfig()) {
  return Boolean(
    config.VERIFY_CHANNEL_ID &&
    config.VERIFIED_ROLE_ID &&
    config.YOUTUBE_CHANNEL
  );
}

function normalizeYoutubeChannel(input) {
  let raw = String(input || '').trim();
  raw = raw.replace(/^https?:\/\/(www\.)?youtube\.com\//i, '');
  raw = raw.replace(/^@/, '');
  raw = raw.split(/[/?#]/)[0].trim();
  return raw;
}

function isValidYoutubeChannel(channel) {
  // Basic validation for channel handle or name
  return channel.length > 1 && channel.length < 100;
}

module.exports = {
  CONFIG_PATH,
  assertRuntimeConfig,
  isBotConfigured,
  isValidYoutubeChannel,
  loadConfig,
  normalizeYoutubeChannel,
  saveConfig,
};