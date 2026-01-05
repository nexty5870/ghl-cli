# Installation Guide - GoHighLevel CLI

This guide provides detailed installation instructions for the GoHighLevel CLI on different platforms.

## Table of Contents

- [Requirements](#requirements)
- [macOS Installation](#macos-installation)
- [Linux Installation](#linux-installation)
- [Windows Installation](#windows-installation)
- [Verify Installation](#verify-installation)
- [Uninstallation](#uninstallation)
- [Troubleshooting](#troubleshooting)

---

## Requirements

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Internet connection**: For downloading packages

### Check your versions

```bash
node --version
npm --version
```

---

## macOS Installation

### Method 1: Homebrew (Recommended)

Homebrew is the easiest way to install and manage the CLI on macOS.

1. **Install Homebrew** (if not already installed):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Tap the GHL CLI repository**:

```bash
brew tap yourusername/ghl-cli
```

3. **Install the CLI**:

```bash
brew install ghl-cli
```

4. **Verify installation**:

```bash
ghl --version
```

**Updating via Homebrew**:

```bash
brew upgrade ghl-cli
```

**Uninstalling via Homebrew**:

```bash
brew uninstall ghl-cli
brew untap yourusername/ghl-cli
```

### Method 2: npm Global Install

1. **Open Terminal** and run:

```bash
npm install -g ghl-cli
```

2. **Verify installation**:

```bash
ghl --version
```

**Uninstalling**:

```bash
npm uninstall -g ghl-cli
```

### Method 3: Build from Source

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/ghl-cli.git
cd ghl-cli
```

2. **Install dependencies**:

```bash
npm install
```

3. **Build the project**:

```bash
npm run build
```

4. **Link globally**:

```bash
npm link
```

5. **Verify installation**:

```bash
ghl --version
```

---

## Linux Installation

### Method 1: Installation Script (Recommended)

Our installation script handles everything automatically:

```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/ghl-cli/main/install.sh | sudo bash
```

Or download and run manually:

```bash
curl -O https://raw.githubusercontent.com/yourusername/ghl-cli/main/install.sh
chmod +x install.sh
sudo ./install.sh
```

### Method 2: npm Global Install

1. **Open Terminal** and run:

```bash
npm install -g ghl-cli
```

2. **Verify installation**:

```bash
ghl --version
```

### Method 3: Build from Source

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/ghl-cli.git
cd ghl-cli
```

2. **Install dependencies**:

```bash
npm install
```

3. **Build the project**:

```bash
npm run build
```

4. **Link globally**:

```bash
sudo npm link
```

5. **Verify installation**:

```bash
ghl --version
```

---

## Windows Installation

### Using npm

1. **Open PowerShell** or **Command Prompt**

2. **Install globally**:

```powershell
npm install -g ghl-cli
```

3. **Verify installation**:

```powershell
ghl --version
```

### Using Chocolatey (Coming Soon)

We're working on a Chocolatey package for Windows. Stay tuned!

---

## Verify Installation

After installation, verify the CLI is working:

```bash
# Check version
ghl --version

# View help
ghl --help

# Test setup (you'll need API credentials)
ghl setup
```

Expected output for `ghl --version`:
```
1.0.0
```

---

## Initial Setup

After installation, configure your GHL credentials:

```bash
ghl setup
```

You will need:
1. **API Key** - From Settings > Private Integrations in GHL
2. **Location ID** - From Settings > Business Profile in GHL

See [README.md](README.md#getting-your-api-credentials) for detailed instructions.

---

## Uninstallation

### macOS (Homebrew)

```bash
brew uninstall ghl-cli
brew untap yourusername/ghl-cli
```

### macOS/Linux (npm)

```bash
npm uninstall -g ghl-cli
```

### Manual cleanup

To remove configuration files:

```bash
# macOS/Linux
rm ~/.config/ghl-cli/config.json

# Windows
rm %APPDATA%\ghl-cli\config.json
```

---

## Troubleshooting

### Command not found

If you get `ghl: command not found`:

**Check npm global prefix**:
```bash
npm config get prefix
```

**Add npm bin directory to PATH**:

**macOS/Linux** (add to `~/.bashrc` or `~/.zshrc`):
```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

**Windows**:
1. Open Environment Variables
2. Edit PATH
3. Add: `%APPDATA%\npm`

### Permission errors

**Linux/macOS**: Use `sudo` for global installations:
```bash
sudo npm install -g ghl-cli
```

Or fix npm permissions:
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Node.js version too old

Install Node.js 18+:

**macOS (Homebrew)**:
```bash
brew install node
```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows**: Download from https://nodejs.org/

### Network issues

If npm fails to download:

```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install -g ghl-cli
```

---

## Next Steps

After installation:

1. Run `ghl setup` to configure your API credentials
2. Read the [README.md](README.md) for usage examples
3. Check the [API Documentation](https://marketplace.gohighlevel.com/docs)

---

## Getting Help

If you encounter issues not covered here:

- Check existing issues on GitHub
- Open a new issue with details about your OS, Node.js version, and the error
- Visit the GHL API documentation

---

## License

ISC
