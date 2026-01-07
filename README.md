# GHL CLI 🚀

Command-line interface for [GoHighLevel](https://gohighlevel.com) CRM via MCP.

Manage contacts, conversations, calendar, opportunities, and payments from your terminal.

## Installation

```bash
npm install -g ghl-cli
```

## Setup

```bash
ghl auth
```

You'll need:
1. **Private Integration Token (PIT)** - from Settings > Private Integrations in GHL
2. **Location ID** - your sub-account ID

## Usage

### Contacts

```bash
ghl contacts list              # List contacts
ghl contacts get <id>          # Get contact details
ghl contacts create --name "John Doe" --email john@example.com
ghl contacts tag <id> lead hot # Add tags
ghl contacts tasks <id>        # Get tasks for contact
```

### Conversations

```bash
ghl conv search                # Search conversations
ghl conv messages <id>         # Get messages
ghl conv send <id> "Hello!"    # Send SMS
ghl conv send <id> "Hello!" --type Email
```

### Calendar

```bash
ghl cal events                 # List calendar events
ghl cal notes <appointmentId>  # Get appointment notes
```

### Opportunities

```bash
ghl opp pipelines              # List pipelines
ghl opp search                 # Search opportunities
ghl opp get <id>               # Get opportunity details
ghl opp update <id> --status won --value 5000
```

### Payments

```bash
ghl pay transactions           # List transactions
ghl pay order <id>             # Get order details
```

### Location

```bash
ghl loc info                   # Get location details
ghl loc fields                 # List custom fields
```

## Environment Variables

Instead of `ghl auth`, you can set:
```bash
export GHL_TOKEN="pit-xxxxx"
export GHL_LOCATION_ID="xxxxx"
```

## License

MIT © [Quentin Daems](https://shvz.fr)

## Credits

Built with [LoopShip](https://github.com/nexty5870/loopship) 🚀
Uses [GoHighLevel MCP](https://marketplace.gohighlevel.com/docs/other/mcp/)
