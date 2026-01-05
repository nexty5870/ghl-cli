# GoHighLevel CLI

A command-line interface for managing GoHighLevel (GHL) operations from your terminal.

## Features

- **Create contacts** - Add new contacts to your GHL account
- **Send emails** - Send emails to contacts
- **Create opportunities** - Manage sales opportunities
- **Create invoices** - Generate invoices for contacts
- **Check calendar availability** - View calendar availability
- **Retrieve contacts** - Get contact details and lists
- **Retrieve payments** - Get payment details and history

## Requirements

- Node.js 18+ or higher
- npm or yarn package manager

## Installation

### macOS (via Homebrew)

The easiest way to install on macOS is using Homebrew:

```bash
# Tap the repository
brew tap yourusername/ghl-cli

# Install the CLI
brew install ghl-cli
```

To upgrade:

```bash
brew upgrade ghl-cli
```

### Linux / macOS (via npm)

You can install directly using npm:

```bash
npm install -g ghl-cli
```

Or install from the source:

```bash
git clone https://github.com/yourusername/ghl-cli.git
cd ghl-cli
npm install
npm run build
npm link
```

### Linux (via installation script)

For Linux users, we provide an installation script:

```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/ghl-cli/main/install.sh | sudo bash
```

### Verify Installation

After installation, verify it works:

```bash
ghl --version
```

You should see: `1.0.0`

## Setup

Before using the CLI, you need to configure your GHL API credentials:

```bash
ghl setup
```

### Getting Your API Credentials

1. **API Key (Private Integration Token)**:
   - Go to **Settings > Private Integrations** in your GHL account
   - Click "Create new Integration"
   - Give it a name (e.g., "CLI Tool")
   - Select required scopes/permissions
   - Copy the generated token

2. **Location ID**:
   - Go to **Settings > Business Profile** in your GHL account
   - Copy your Location ID from the profile section

## Usage

### Contact Commands

#### Create a new contact
```bash
# Interactive mode
ghl contact create

# With command-line options
ghl contact create --first-name "John" --last-name "Doe" --email "john@example.com" --phone "+1234567890"
```

#### Get a contact by ID
```bash
ghl contact get <contact-id>
```

#### List all contacts
```bash
ghl contact list

# With search query
ghl contact list --query "john"
```

### Email Commands

#### Send an email
```bash
# Interactive mode
ghl email

# With command-line options
ghl email --to "john@example.com" --subject "Hello" --body "Email body"
```

### Opportunity Commands

#### Create an opportunity
```bash
# Interactive mode
ghl opportunity

# With command-line options
ghl opportunity \
  --contact-id <contact-id> \
  --pipeline-id <pipeline-id> \
  --stage-id <stage-id> \
  --title "New Deal" \
  --value 1000 \
  --status open
```

### Invoice Commands

#### Create an invoice
```bash
# Interactive mode
ghl invoice

# With command-line options
ghl invoice \
  --contact-id <contact-id> \
  --title "Invoice #1" \
  --amount 500 \
  --due-date 2026-01-31
```

### Calendar Commands

#### Check calendar availability
```bash
# Interactive mode
ghl calendar

# With command-line options
ghl calendar \
  --calendar-id <calendar-id> \
  --start-date 2026-01-01 \
  --end-date 2026-01-31
```

### Payment Commands

#### Get a payment by ID
```bash
ghl payment get <payment-id>
```

#### List all payments
```bash
ghl payment list

# With search query
ghl payment list --query "invoice"
```

## Getting Help

```bash
# General help
ghl --help

# Command-specific help
ghl contact --help
ghl email --help
```

## Troubleshooting

### "GHL CLI not configured" error

Run `ghl setup` to configure your API credentials.

### "Unauthorized" errors

- Verify your API key is correct in `ghl setup`
- Check that your Private Integration has the required scopes
- Ensure your Location ID is valid

### Installation issues

**macOS/Homebrew**:
```bash
brew update
brew doctor
```

**npm**:
```bash
npm cache clean --force
npm install -g ghl-cli
```

## API Reference

This CLI uses the GoHighLevel API v2.0. For more information, visit:
https://marketplace.gohighlevel.com/docs

## License

ISC
