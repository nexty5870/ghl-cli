import chalk from 'chalk';
import readline from 'readline';
import { GHLAPI } from '../lib/ghl-api.js';

interface ContactData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  tags?: string[];
  [key: string]: unknown;
}

export async function createClientCommand(
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string
): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => {
      rl.question(prompt, (answer) => resolve(answer.trim()));
    });

  console.log(chalk.cyan.bold('\n👤 Create New Contact\n'));

  const data: ContactData = {
    firstName: firstName || await question(chalk.white('First Name: ')),
    lastName: lastName || await question(chalk.white('Last Name: ')),
    email: email || await question(chalk.white('Email (optional): ')),
    phone: phone || await question(chalk.white('Phone (optional): ')),
  };

  const company = await question(chalk.white('Company (optional): '));
  if (company) data.company = company;

  const tagsInput = await question(chalk.white('Tags (comma-separated, optional): '));
  if (tagsInput) {
    data.tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
  }

  rl.close();

  try {
    const api = new GHLAPI();
    const result = await api.createContact(data);

    console.log(chalk.green.bold('\n✅ Contact created successfully!\n'));
    console.log(chalk.gray('Contact ID:'), chalk.cyan(result.contact?.id || 'N/A'));
    console.log(chalk.gray('Name:'), chalk.white(`${data.firstName} ${data.lastName}`));
    if (data.email) console.log(chalk.gray('Email:'), chalk.white(data.email));
    if (data.phone) console.log(chalk.gray('Phone:'), chalk.white(data.phone));
    if (data.company) console.log(chalk.gray('Company:'), chalk.white(data.company));
    console.log();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error creating contact: ${message}\n`));
    process.exit(1);
  }
}
