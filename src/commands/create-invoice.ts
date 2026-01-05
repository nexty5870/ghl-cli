import chalk from 'chalk';
import readline from 'readline';
import { GHLAPI } from '../lib/ghl-api.js';

export async function createInvoiceCommand(
  contactId?: string,
  title?: string,
  amount?: string,
  dueDate?: string
): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => {
      rl.question(prompt, (answer) => resolve(answer.trim()));
    });

  console.log(chalk.cyan.bold('\n📄 Create Invoice\n'));

  const contact = contactId || await question(chalk.white('Contact ID: '));
  if (!contact) {
    console.log(chalk.red('\n❌ Contact ID is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const invoiceTitle = title || await question(chalk.white('Invoice Title: '));
  if (!invoiceTitle) {
    console.log(chalk.red('\n❌ Invoice title is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const invoiceAmount = amount || await question(chalk.white('Amount: '));
  if (!invoiceAmount) {
    console.log(chalk.red('\n❌ Amount is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const invoiceDueDate = dueDate || await question(chalk.white('Due Date (YYYY-MM-DD, optional): '));

  rl.close();

  const data: Record<string, unknown> = {
    contactId: contact,
    title: invoiceTitle,
    amount: parseFloat(invoiceAmount)
  };

  if (invoiceDueDate) data.dueDate = invoiceDueDate;

  try {
    const api = new GHLAPI();
    const result = await api.createInvoice(data);

    console.log(chalk.green.bold('\n✅ Invoice created successfully!\n'));
    console.log(chalk.gray('Invoice ID:'), chalk.cyan(result.invoice?.id || 'N/A'));
    console.log(chalk.gray('Title:'), chalk.white(invoiceTitle));
    console.log(chalk.gray('Amount:'), chalk.white(`$${invoiceAmount}`));
    if (invoiceDueDate) console.log(chalk.gray('Due Date:'), chalk.white(invoiceDueDate));
    console.log();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error creating invoice: ${message}\n`));
    process.exit(1);
  }
}
