import chalk from 'chalk';
import { GHLAPI } from '../lib/ghl-api.js';

export async function retrieveContactCommand(contactId: string): Promise<void> {
  if (!contactId) {
    console.log(chalk.red('\n❌ Contact ID is required.\n'));
    console.log(chalk.gray('Usage: ghl contact:get <contact-id>\n'));
    process.exit(1);
    return;
  }

  try {
    const api = new GHLAPI();
    const contact = await api.getContact(contactId);

    console.log(chalk.green.bold('\n✅ Contact Retrieved!\n'));
    console.log(chalk.gray('Contact ID:'), chalk.cyan(contact.id || 'N/A'));
    console.log(chalk.gray('Name:'), chalk.white(`${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'N/A'));
    if (contact.email) console.log(chalk.gray('Email:'), chalk.white(contact.email));
    if (contact.phone) console.log(chalk.gray('Phone:'), chalk.white(contact.phone));
    if (contact.company) console.log(chalk.gray('Company:'), chalk.white(contact.company));
    if (contact.city || contact.state) {
      console.log(chalk.gray('Location:'), chalk.white(`${contact.city || ''}${contact.city && contact.state ? ', ' : ''}${contact.state || ''}`));
    }
    if (contact.tags && contact.tags.length > 0) {
      console.log(chalk.gray('Tags:'), chalk.white(contact.tags.join(', ')));
    }
    console.log();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error retrieving contact: ${message}\n`));
    process.exit(1);
  }
}

export async function listContactsCommand(query?: string): Promise<void> {
  try {
    const api = new GHLAPI();
    const queryParams: Record<string, string> = {};

    if (query) {
      queryParams.query = query;
    }

    const result = await api.listContacts(queryParams);

    console.log(chalk.green.bold('\n✅ Contacts Retrieved!\n'));

    if (result.contacts && result.contacts.length > 0) {
      console.log(chalk.gray(`Found ${result.contacts.length} contact(s):\n`));

      result.contacts.forEach((contact: Record<string, unknown>, index: number) => {
        console.log(chalk.cyan(`${index + 1}. ${contact.id}`));
        console.log(chalk.gray('   Name:'), chalk.white(`${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'N/A'));
        if (contact.email) console.log(chalk.gray('   Email:'), chalk.white(String(contact.email)));
        if (contact.phone) console.log(chalk.gray('   Phone:'), chalk.white(String(contact.phone)));
        console.log();
      });
    } else {
      console.log(chalk.gray('No contacts found.\n'));
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error listing contacts: ${message}\n`));
    process.exit(1);
  }
}
