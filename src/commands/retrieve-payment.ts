import chalk from 'chalk';
import { GHLAPI } from '../lib/ghl-api.js';

export async function retrievePaymentCommand(paymentId: string): Promise<void> {
  if (!paymentId) {
    console.log(chalk.red('\n❌ Payment ID is required.\n'));
    console.log(chalk.gray('Usage: ghl payment:get <payment-id>\n'));
    process.exit(1);
    return;
  }

  try {
    const api = new GHLAPI();
    const payment = await api.getPayment(paymentId);

    console.log(chalk.green.bold('\n✅ Payment Retrieved!\n'));
    console.log(chalk.gray('Payment ID:'), chalk.cyan(payment.id || 'N/A'));
    console.log(chalk.gray('Amount:'), chalk.white(`${payment.currency || 'USD'} ${payment.amount || '0'}`));
    console.log(chalk.gray('Status:'), chalk.white(payment.status || 'N/A'));
    if (payment.transactionId) console.log(chalk.gray('Transaction ID:'), chalk.white(payment.transactionId));
    if (payment.paymentMethod) console.log(chalk.gray('Payment Method:'), chalk.white(payment.paymentMethod));
    if (payment.createdAt) console.log(chalk.gray('Created At:'), chalk.white(payment.createdAt));
    console.log();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error retrieving payment: ${message}\n`));
    process.exit(1);
  }
}

export async function listPaymentsCommand(query?: string): Promise<void> {
  try {
    const api = new GHLAPI();
    const queryParams: Record<string, string> = {};

    if (query) {
      queryParams.query = query;
    }

    const result = await api.listPayments(queryParams);

    console.log(chalk.green.bold('\n✅ Payments Retrieved!\n'));

    if (result.payments && result.payments.length > 0) {
      console.log(chalk.gray(`Found ${result.payments.length} payment(s):\n`));

      result.payments.forEach((payment: Record<string, unknown>, index: number) => {
        console.log(chalk.cyan(`${index + 1}. ${payment.id}`));
        console.log(chalk.gray('   Amount:'), chalk.white(`${payment.currency || 'USD'} ${payment.amount || '0'}`));
        console.log(chalk.gray('   Status:'), chalk.white(String(payment.status || 'N/A')));
        if (payment.transactionId) console.log(chalk.gray('   Transaction ID:'), chalk.white(String(payment.transactionId)));
        console.log();
      });
    } else {
      console.log(chalk.gray('No payments found.\n'));
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error listing payments: ${message}\n`));
    process.exit(1);
  }
}
