import chalk from 'chalk';
import readline from 'readline';
import { setConfig, isConfigured, clearConfig } from '../lib/config.js';

export async function setupCommand(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => {
      rl.question(prompt, (answer) => resolve(answer.trim()));
    });

  console.log(chalk.cyan.bold('\n🚀 GoHighLevel CLI Setup\n'));

  if (isConfigured()) {
    const reset = await question(
      chalk.yellow('Configuration already exists. Do you want to reset it? (y/N): ')
    );
    if (reset.toLowerCase() !== 'y') {
      console.log(chalk.green('Setup cancelled. Keeping existing configuration.\n'));
      rl.close();
      return;
    }
    clearConfig();
  }

  console.log(chalk.gray('\nTo get your API credentials:'));
  console.log(chalk.gray('1. Go to Settings > Private Integrations in your GHL account'));
  console.log(chalk.gray('2. Create a new integration with required scopes'));
  console.log(chalk.gray('3. Copy the API token'));
  console.log(chalk.gray('4. Get your Location ID from Settings > Business Profile\n'));

  const apiKey = await question(chalk.white('Enter your GHL API Key: '));
  if (!apiKey) {
    console.log(chalk.red('\n❌ API Key is required. Setup cancelled.\n'));
    rl.close();
    return;
  }

  const locationId = await question(chalk.white('Enter your Location ID: '));
  if (!locationId) {
    console.log(chalk.red('\n❌ Location ID is required. Setup cancelled.\n'));
    rl.close();
    return;
  }

  setConfig(apiKey, locationId);

  console.log(chalk.green.bold('\n✅ Configuration saved successfully!\n'));
  console.log(chalk.gray(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`));
  console.log(chalk.gray(`Location ID: ${locationId}\n`));

  rl.close();
}
