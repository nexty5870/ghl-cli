import Conf from 'conf';
import type { GHLConfig } from '../types/index.js';

const config = new Conf<GHLSnapshot>({
  projectName: 'ghl-cli',
  projectVersion: '1.0.0',
  schema: {
    apiKey: {
      type: 'string',
      default: ''
    },
    locationId: {
      type: 'string',
      default: ''
    }
  }
});

export interface GHLSnapshot {
  apiKey: string;
  locationId: string;
}

export function getConfig(): GHLConfig {
  const apiKey = config.get('apiKey');
  const locationId = config.get('locationId');

  if (!apiKey || !locationId) {
    throw new Error(
      'GHL CLI not configured. Please run `ghl setup` first.'
    );
  }

  return { apiKey, locationId };
}

export function setConfig(apiKey: string, locationId: string): void {
  config.set('apiKey', apiKey);
  config.set('locationId', locationId);
}

export function clearConfig(): void {
  config.clear();
}

export function isConfigured(): boolean {
  return !!(config.get('apiKey') && config.get('locationId'));
}

export { config };
