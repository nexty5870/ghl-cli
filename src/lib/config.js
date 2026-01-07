/**
 * Config management for GHL CLI
 */

import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const CONFIG_DIR = join(homedir(), ".config", "ghl");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function getConfigPath() {
  return CONFIG_FILE;
}

export function loadConfig() {
  try {
    if (existsSync(CONFIG_FILE)) {
      return JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
    }
  } catch (e) {}
  return {};
}

export function saveConfig(config) {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getToken() {
  if (process.env.GHL_TOKEN) return process.env.GHL_TOKEN;
  return loadConfig().token;
}

export function getLocationId() {
  if (process.env.GHL_LOCATION_ID) return process.env.GHL_LOCATION_ID;
  return loadConfig().locationId;
}

export function setCredentials(token, locationId) {
  const config = loadConfig();
  config.token = token;
  config.locationId = locationId;
  saveConfig(config);
}

export function clearCredentials() {
  saveConfig({});
}
