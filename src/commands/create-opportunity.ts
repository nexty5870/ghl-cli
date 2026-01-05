import chalk from 'chalk';
import readline from 'readline';
import { GHLAPI } from '../lib/ghl-api.js';

export async function createOpportunityCommand(
  contactId?: string,
  pipelineId?: string,
  stageId?: string,
  title?: string,
  value?: string,
  status?: string
): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => {
      rl.question(prompt, (answer) => resolve(answer.trim()));
    });

  console.log(chalk.cyan.bold('\n💼 Create Opportunity\n'));

  const contact = contactId || await question(chalk.white('Contact ID: '));
  if (!contact) {
    console.log(chalk.red('\n❌ Contact ID is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const pipeline = pipelineId || await question(chalk.white('Pipeline ID: '));
  if (!pipeline) {
    console.log(chalk.red('\n❌ Pipeline ID is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const stage = stageId || await question(chalk.white('Stage ID: '));
  if (!stage) {
    console.log(chalk.red('\n❌ Stage ID is required.\n'));
    rl.close();
    process.exit(1);
    return;
  }

  const oppTitle = title || await question(chalk.white('Title (optional): '));
  const oppValue = value || await question(chalk.white('Value (optional): '));
  const oppStatus = status || await question(chalk.white('Status (open/won/lost, default: open): '));

  rl.close();

  const data: Record<string, unknown> = {
    contactId: contact,
    pipelineId: pipeline,
    stageId: stage,
    status: (oppStatus || 'open') === 'open' ? 'open' : (oppStatus === 'won' ? 'won' : 'lost')
  };

  if (oppTitle) data.title = oppTitle;
  if (oppValue) data.value = parseFloat(oppValue);

  try {
    const api = new GHLAPI();
    const result = await api.createOpportunity(data);

    console.log(chalk.green.bold('\n✅ Opportunity created successfully!\n'));
    console.log(chalk.gray('Opportunity ID:'), chalk.cyan(result.opportunity?.id || 'N/A'));
    console.log(chalk.gray('Contact ID:'), chalk.white(contact));
    console.log(chalk.gray('Title:'), chalk.white(oppTitle || 'N/A'));
    console.log(chalk.gray('Status:'), chalk.white(data.status as string));
    if (oppValue) console.log(chalk.gray('Value:'), chalk.white(oppValue));
    console.log();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(chalk.red.bold(`\n❌ Error creating opportunity: ${message}\n`));
    process.exit(1);
  }
}
