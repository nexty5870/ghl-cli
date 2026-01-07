#!/usr/bin/env node
/**
 * GHL CLI - Command-line interface for GoHighLevel CRM
 */

import { Command } from "commander";
import chalk from "chalk";
import { createInterface } from "readline";
import { createClient, GHLClient } from "./lib/mcp.js";
import { getToken, getLocationId, setCredentials, clearCredentials, getConfigPath } from "./lib/config.js";

const program = new Command();

program
  .name("ghl")
  .description("CLI for GoHighLevel CRM via MCP")
  .version("0.1.0");

// ============ AUTH ============
program
  .command("auth")
  .description("Set up your GHL credentials")
  .option("--clear", "Remove saved credentials")
  .option("--show", "Show current auth status")
  .action(async (options) => {
    if (options.clear) {
      clearCredentials();
      console.log(chalk.green("✅ Credentials removed."));
      return;
    }

    if (options.show) {
      const token = getToken();
      const locationId = getLocationId();
      if (token && locationId) {
        console.log(chalk.green(`✅ Configured`));
        console.log(chalk.gray(`   Token: ${token.slice(0, 10)}...`));
        console.log(chalk.gray(`   Location: ${locationId}`));
        console.log(chalk.gray(`   Config: ${getConfigPath()}`));
      } else {
        console.log(chalk.yellow("⚠️  Not configured. Run 'ghl auth' to set up."));
      }
      return;
    }

    console.log(chalk.cyan("\n🔐 GoHighLevel Setup\n"));
    console.log(chalk.white("To get your Private Integration Token (PIT):"));
    console.log(chalk.gray("  1. Go to Settings > Private Integrations in GHL"));
    console.log(chalk.gray("  2. Create New Integration with required scopes"));
    console.log(chalk.gray("  3. Copy the generated token\n"));

    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

    try {
      const token = await question(chalk.yellow("Paste your PIT token: "));
      const locationId = await question(chalk.yellow("Paste your Location ID: "));
      rl.close();

      if (!token || !locationId) {
        console.log(chalk.red("\n❌ Both token and location ID are required."));
        process.exit(1);
      }

      console.log(chalk.gray("\nVerifying credentials..."));
      const client = new GHLClient(token.trim(), locationId.trim());
      
      try {
        await client.getLocation();
        setCredentials(token.trim(), locationId.trim());
        console.log(chalk.green("\n✅ Credentials verified and saved!"));
        console.log(chalk.cyan("\nTry 'ghl contacts list' to see your contacts."));
      } catch (e) {
        console.log(chalk.red(`\n❌ Verification failed: ${e.message}`));
        process.exit(1);
      }
    } catch (e) {
      rl.close();
      console.log(chalk.red(`\nError: ${e.message}`));
      process.exit(1);
    }
  });

// ============ CONTACTS ============
const contacts = program.command("contacts").description("Manage contacts");

contacts
  .command("list")
  .description("List contacts")
  .option("-l, --limit <n>", "Number of contacts", "20")
  .option("-q, --query <text>", "Search query")
  .action(async (options) => {
    try {
      const client = createClient();
      const data = await client.getContacts({ 
        limit: parseInt(options.limit),
        query: options.query 
      });
      
      console.log(chalk.cyan("\n👥 Contacts:\n"));
      const contacts = data.contacts || data || [];
      
      if (!contacts.length) {
        console.log(chalk.yellow("No contacts found."));
        return;
      }

      for (const c of contacts) {
        console.log(chalk.white(`  ${chalk.bold(c.id?.slice(0, 8) || "?")}  ${c.firstName || ""} ${c.lastName || ""}`));
        console.log(chalk.gray(`           ${c.email || ""} • ${c.phone || ""}\n`));
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

contacts
  .command("get <id>")
  .description("Get contact details")
  .action(async (id) => {
    try {
      const client = createClient();
      const contact = await client.getContact(id);
      
      console.log(chalk.cyan(`\n👤 Contact: ${contact.firstName || ""} ${contact.lastName || ""}\n`));
      console.log(chalk.white(`  ID:       ${contact.id}`));
      console.log(chalk.white(`  Email:    ${contact.email || "-"}`));
      console.log(chalk.white(`  Phone:    ${contact.phone || "-"}`));
      console.log(chalk.white(`  Tags:     ${contact.tags?.join(", ") || "-"}`));
      console.log(chalk.white(`  Created:  ${contact.dateAdded || "-"}`));
      console.log();
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

contacts
  .command("create")
  .description("Create a new contact")
  .requiredOption("--name <name>", "Full name")
  .option("--email <email>", "Email address")
  .option("--phone <phone>", "Phone number")
  .action(async (options) => {
    try {
      const client = createClient();
      const [firstName, ...rest] = options.name.split(" ");
      const lastName = rest.join(" ");
      
      const contact = await client.createContact({
        firstName,
        lastName,
        email: options.email,
        phone: options.phone
      });
      
      console.log(chalk.green(`\n✅ Contact created: ${contact.id}`));
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

contacts
  .command("tag <id> <tags...>")
  .description("Add tags to a contact")
  .action(async (id, tags) => {
    try {
      const client = createClient();
      await client.addTags(id, tags);
      console.log(chalk.green(`\n✅ Added tags: ${tags.join(", ")}`));
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

contacts
  .command("tasks <id>")
  .description("Get tasks for a contact")
  .action(async (id) => {
    try {
      const client = createClient();
      const data = await client.getTasks(id);
      
      console.log(chalk.cyan("\n📋 Tasks:\n"));
      const tasks = data.tasks || data || [];
      
      for (const t of tasks) {
        const status = t.completed ? "✅" : "⏳";
        console.log(chalk.white(`  ${status} ${t.title || t.body}`));
        if (t.dueDate) console.log(chalk.gray(`     Due: ${t.dueDate}`));
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// ============ CONVERSATIONS ============
const conversations = program.command("conversations").alias("conv").description("Manage conversations");

conversations
  .command("search [query]")
  .description("Search conversations")
  .option("-l, --limit <n>", "Number of results", "20")
  .action(async (query, options) => {
    try {
      const client = createClient();
      const data = await client.searchConversations({ 
        query,
        limit: parseInt(options.limit)
      });
      
      console.log(chalk.cyan("\n💬 Conversations:\n"));
      const convs = data.conversations || data || [];
      
      for (const c of convs) {
        console.log(chalk.white(`  ${chalk.bold(c.id?.slice(0, 8) || "?")}  ${c.contactName || c.fullName || "Unknown"}`));
        console.log(chalk.gray(`           ${c.lastMessageType || ""} • ${c.lastMessageDate || ""}\n`));
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

conversations
  .command("messages <id>")
  .description("Get messages in a conversation")
  .action(async (id) => {
    try {
      const client = createClient();
      const data = await client.getMessages(id);
      
      console.log(chalk.cyan("\n📨 Messages:\n"));
      const messages = data.messages || data || [];
      
      for (const m of messages) {
        const dir = m.direction === "inbound" ? "←" : "→";
        const color = m.direction === "inbound" ? chalk.blue : chalk.green;
        console.log(color(`  ${dir} [${m.dateAdded || ""}] ${m.body || m.message || ""}`));
      }
      console.log();
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

conversations
  .command("send <id> <message...>")
  .description("Send a message")
  .option("-t, --type <type>", "Message type (SMS, Email)", "SMS")
  .action(async (id, messageParts, options) => {
    try {
      const client = createClient();
      const message = messageParts.join(" ");
      await client.sendMessage(id, message, options.type);
      console.log(chalk.green(`\n✅ Message sent!`));
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// ============ CALENDAR ============
const calendar = program.command("calendar").alias("cal").description("Calendar and appointments");

calendar
  .command("events")
  .description("List calendar events")
  .option("--user <userId>", "Filter by user ID")
  .option("--calendar <calendarId>", "Filter by calendar ID")
  .action(async (options) => {
    try {
      const client = createClient();
      const data = await client.getCalendarEvents({
        userId: options.user,
        calendarId: options.calendar
      });
      
      console.log(chalk.cyan("\n📅 Events:\n"));
      const events = data.events || data || [];
      
      for (const e of events) {
        console.log(chalk.white(`  ${chalk.bold(e.id?.slice(0, 8) || "?")}  ${e.title || e.name || "Untitled"}`));
        console.log(chalk.gray(`           ${e.startTime || ""} - ${e.endTime || ""}\n`));
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

calendar
  .command("notes <appointmentId>")
  .description("Get appointment notes")
  .action(async (appointmentId) => {
    try {
      const client = createClient();
      const data = await client.getAppointmentNotes(appointmentId);
      
      console.log(chalk.cyan("\n📝 Notes:\n"));
      const notes = data.notes || data || [];
      
      for (const n of notes) {
        console.log(chalk.white(`  ${n.body || n.content || n}`));
        console.log();
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// ============ OPPORTUNITIES ============
const opportunities = program.command("opportunities").alias("opp").description("Manage opportunities");

opportunities
  .command("pipelines")
  .description("List pipelines")
  .action(async () => {
    try {
      const client = createClient();
      const data = await client.getPipelines();
      
      console.log(chalk.cyan("\n🔄 Pipelines:\n"));
      const pipelines = data.pipelines || data || [];
      
      for (const p of pipelines) {
        console.log(chalk.white(`  ${chalk.bold(p.id?.slice(0, 8) || "?")}  ${p.name}`));
        if (p.stages?.length) {
          for (const s of p.stages) {
            console.log(chalk.gray(`           └─ ${s.name}`));
          }
        }
        console.log();
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

opportunities
  .command("search [query]")
  .description("Search opportunities")
  .action(async (query) => {
    try {
      const client = createClient();
      const data = await client.searchOpportunities({ query });
      
      console.log(chalk.cyan("\n💰 Opportunities:\n"));
      const opps = data.opportunities || data || [];
      
      for (const o of opps) {
        const value = o.monetaryValue ? `$${o.monetaryValue}` : "";
        console.log(chalk.white(`  ${chalk.bold(o.id?.slice(0, 8) || "?")}  ${o.name || o.title || "Untitled"} ${chalk.green(value)}`));
        console.log(chalk.gray(`           ${o.pipelineStageId || o.status || ""}\n`));
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

opportunities
  .command("get <id>")
  .description("Get opportunity details")
  .action(async (id) => {
    try {
      const client = createClient();
      const opp = await client.getOpportunity(id);
      
      console.log(chalk.cyan(`\n💰 Opportunity: ${opp.name || opp.title || "Untitled"}\n`));
      console.log(chalk.white(`  ID:       ${opp.id}`));
      console.log(chalk.white(`  Value:    $${opp.monetaryValue || 0}`));
      console.log(chalk.white(`  Status:   ${opp.status || "-"}`));
      console.log(chalk.white(`  Contact:  ${opp.contactId || "-"}`));
      console.log();
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

opportunities
  .command("update <id>")
  .description("Update opportunity")
  .option("--stage <stageId>", "Move to stage")
  .option("--value <amount>", "Set monetary value")
  .option("--status <status>", "Set status (open, won, lost)")
  .action(async (id, options) => {
    try {
      const client = createClient();
      const updates = {};
      if (options.stage) updates.pipelineStageId = options.stage;
      if (options.value) updates.monetaryValue = parseFloat(options.value);
      if (options.status) updates.status = options.status;
      
      await client.updateOpportunity(id, updates);
      console.log(chalk.green(`\n✅ Opportunity updated!`));
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// ============ PAYMENTS ============
const payments = program.command("payments").alias("pay").description("Payments and transactions");

payments
  .command("transactions")
  .description("List transactions")
  .option("-l, --limit <n>", "Number of transactions", "20")
  .action(async (options) => {
    try {
      const client = createClient();
      const data = await client.listTransactions({ limit: parseInt(options.limit) });
      
      console.log(chalk.cyan("\n💳 Transactions:\n"));
      const txns = data.transactions || data || [];
      
      for (const t of txns) {
        const amount = t.amount ? `$${t.amount}` : "";
        const status = t.status === "succeeded" ? chalk.green("✓") : chalk.yellow(t.status || "");
        console.log(chalk.white(`  ${status} ${chalk.bold(t.id?.slice(0, 8) || "?")}  ${amount}`));
        console.log(chalk.gray(`           ${t.createdAt || ""}\n`));
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

payments
  .command("order <id>")
  .description("Get order details")
  .action(async (id) => {
    try {
      const client = createClient();
      const order = await client.getOrder(id);
      
      console.log(chalk.cyan(`\n🧾 Order: ${order.id}\n`));
      console.log(chalk.white(`  Amount:   $${order.amount || 0}`));
      console.log(chalk.white(`  Status:   ${order.status || "-"}`));
      console.log(chalk.white(`  Contact:  ${order.contactId || "-"}`));
      console.log(chalk.white(`  Created:  ${order.createdAt || "-"}`));
      console.log();
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// ============ LOCATION ============
const location = program.command("location").alias("loc").description("Location/sub-account info");

location
  .command("info")
  .description("Get location details")
  .action(async () => {
    try {
      const client = createClient();
      const loc = await client.getLocation();
      
      console.log(chalk.cyan(`\n🏢 Location: ${loc.name || loc.business?.name || "Unnamed"}\n`));
      console.log(chalk.white(`  ID:       ${loc.id}`));
      console.log(chalk.white(`  Email:    ${loc.email || "-"}`));
      console.log(chalk.white(`  Phone:    ${loc.phone || "-"}`));
      console.log(chalk.white(`  Address:  ${loc.address || "-"}`));
      console.log(chalk.white(`  Timezone: ${loc.timezone || "-"}`));
      console.log();
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

location
  .command("fields")
  .description("List custom fields")
  .action(async () => {
    try {
      const client = createClient();
      const data = await client.getCustomFields();
      
      console.log(chalk.cyan("\n📋 Custom Fields:\n"));
      const fields = data.customFields || data || [];
      
      for (const f of fields) {
        console.log(chalk.white(`  ${chalk.bold(f.id?.slice(0, 8) || "?")}  ${f.name}`));
        console.log(chalk.gray(`           Type: ${f.dataType || f.type || "-"}\n`));
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// Default to help if no command
program.parse();
