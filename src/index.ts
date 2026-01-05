#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { setupCommand } from './commands/setup.js';
import { createClientCommand } from './commands/create-client.js';
import { sendEmailCommand } from './commands/send-email.js';
import { createOpportunityCommand } from './commands/create-opportunity.js';
import { createInvoiceCommand } from './commands/create-invoice.js';
import { checkCalendarCommand } from './commands/check-calendar.js';
import { retrieveContactCommand, listContactsCommand } from './commands/retrieve-contact.js';
import { retrievePaymentCommand, listPaymentsCommand } from './commands/retrieve-payment.js';

const program = new Command();

program
  .name('ghl')
  .description('GoHighLevel CLI - Manage your GHL account from the terminal')
  .version('1.0.0');

// Setup command
program
  .command('setup')
  .description('Configure GHL API credentials (Location ID and API Key)')
  .action(setupCommand);

// Contact commands
const contactCmd = program.command('contact');

contactCmd
  .command('create')
  .description('Create a new contact')
  .option('-f, --first-name <firstName>', 'First name')
  .option('-l, --last-name <lastName>', 'Last name')
  .option('-e, --email <email>', 'Email address')
  .option('-p, --phone <phone>', 'Phone number')
  .action((options) => createClientCommand(options.firstName, options.lastName, options.email, options.phone));

contactCmd
  .command('get <contactId>')
  .description('Retrieve a contact by ID')
  .action(retrieveContactCommand);

contactCmd
  .command('list')
  .description('List all contacts')
  .option('-q, --query <query>', 'Search query')
  .action((options) => listContactsCommand(options.query));

// Email command
program
  .command('email')
  .description('Send an email to a contact')
  .option('-t, --to <email>', 'Recipient email')
  .option('-s, --subject <subject>', 'Email subject')
  .option('-b, --body <body>', 'Email body')
  .action((options) => sendEmailCommand(options.to, options.subject, options.body));

// Opportunity command
program
  .command('opportunity')
  .description('Create a new opportunity')
  .option('-c, --contact-id <contactId>', 'Contact ID')
  .option('-p, --pipeline-id <pipelineId>', 'Pipeline ID')
  .option('-s, --stage-id <stageId>', 'Stage ID')
  .option('-t, --title <title>', 'Opportunity title')
  .option('-v, --value <value>', 'Opportunity value')
  .option('--status <status>', 'Status (open/won/lost)')
  .action((options) =>
    createOpportunityCommand(
      options.contactId,
      options.pipelineId,
      options.stageId,
      options.title,
      options.value,
      options.status
    )
  );

// Invoice command
program
  .command('invoice')
  .description('Create a new invoice')
  .option('-c, --contact-id <contactId>', 'Contact ID')
  .option('-t, --title <title>', 'Invoice title')
  .option('-a, --amount <amount>', 'Invoice amount')
  .option('-d, --due-date <dueDate>', 'Due date (YYYY-MM-DD)')
  .action((options) =>
    createInvoiceCommand(options.contactId, options.title, options.amount, options.dueDate)
  );

// Calendar command
program
  .command('calendar')
  .description('Check calendar availability')
  .option('-c, --calendar-id <calendarId>', 'Calendar ID')
  .option('-s, --start-date <startDate>', 'Start date (YYYY-MM-DD)')
  .option('-e, --end-date <endDate>', 'End date (YYYY-MM-DD)')
  .action((options) =>
    checkCalendarCommand(options.calendarId, options.startDate, options.endDate)
  );

// Payment commands
const paymentCmd = program.command('payment');

paymentCmd
  .command('get <paymentId>')
  .description('Retrieve a payment by ID')
  .action(retrievePaymentCommand);

paymentCmd
  .command('list')
  .description('List all payments')
  .option('-q, --query <query>', 'Search query')
  .action((options) => listPaymentsCommand(options.query));

// Parse arguments
program.parseAsync(process.argv).catch((error) => {
  console.error(chalk.red.bold(`\n❌ Error: ${error.message}\n`));
  process.exit(1);
});
