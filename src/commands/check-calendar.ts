import chalk from 'chalk';
import readline from 'readline';
import { GHLAPI } from '../lib/ghl-api.js';

export async function checkCalendarCommand(
  calendarId?: string,
  startDate?: string,
  endDate?: string
): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => {
      rl.question(prompt, (answer) => resolve(answer.trim()));
    });

  console.log(chalk.cyan.bold('\n📅 Check Calendar Availability\n'));

  const calendar = calendarId || await question(chalk.white('Calendar ID: '));
  if (!calendar) {
    console.log(chalk.red('\n❌ Calendar ID is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const defaultStart = startDate || today;
  const defaultEnd = endDate || today;

  const start = await question(chalk.white(`Start Date (YYYY-MM-DD, default: ${defaultStart}): `));
  const end = await question(chalk.white(`End Date (YYYY-MM-DD, default: ${defaultEnd}): `));

  rl.close();

  const finalStart = start || defaultStart;
  const finalEnd = end || defaultEnd;

  try {
    const api = new GHLAPI();
    const availability = await api.getCalendarAvailability(calendar, finalStart || '', finalEnd || '');

    console.log(chalk.green.bold('\n✅ Calendar Availability Retrieved!\n'));
    console.log(chalk.gray('Calendar ID:'), chalk.cyan(calendar));
    console.log(chalk.gray('Date Range:'), chalk.white(`${finalStart} to ${finalEnd}`));
    console.log(chalk.gray('\nAvailability:'));
    console.log(JSON.stringify(availability, null, 2));
    console.log();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error checking calendar: ${message}\n`));
    process.exit(1);
  }
}
