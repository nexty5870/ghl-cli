import chalk from 'chalk';
import readline from 'readline';
import { GHLAPI } from '../lib/ghl-api.js';

export async function sendEmailCommand(
  to?: string,
  subject?: string,
  body?: string
): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => {
      rl.question(prompt, (answer) => resolve(answer.trim()));
    });

  console.log(chalk.cyan.bold('\n📧 Send Email to Contact\n'));

  const email = to || await question(chalk.white('Recipient Email: '));
  if (!email) {
    console.log(chalk.red('\n❌ Recipient email is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const emailSubject = subject || await question(chalk.white('Subject: '));
  if (!emailSubject) {
    console.log(chalk.red('\n❌ Subject is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const emailBody = body || await question(chalk.white('Body (use \\n for new lines): '));
  if (!emailBody) {
    console.log(chalk.red('\n❌ Email body is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  rl.close();

  try {
    const api = new GHLAPI();
    await api.sendEmail(email, emailSubject, emailBody);

    console.log(chalk.green.bold('\n✅ Email sent successfully!\n'));
    console.log(chalk.gray('To:'), chalk.white(email));
    console.log(chalk.gray('Subject:'), chalk.white(emailSubject));
    console.log();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error sending email: ${message}\n`));
    process.exit(1);
  }
}
