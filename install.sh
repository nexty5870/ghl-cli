#!/bin/bash

set -e

echo "🚀 Installing GoHighLevel CLI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node -v) found"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. You have Node.js $NODE_VERSION"
    exit 1
fi

# Create temporary directory
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

echo "📥 Downloading ghl-cli..."

# Download from npm (or replace with actual release URL)
npm pack ghl-cli

# Extract
TAR_FILE=$(ls *.tgz)
tar -xzf "$TAR_FILE"
cd package

echo "📦 Installing globally..."
npm install -g .

# Cleanup
cd /
rm -rf "$TMP_DIR"

echo "✅ Installation complete!"
echo ""
echo "Run 'ghl setup' to configure your API credentials."
echo "Run 'ghl --help' to see all available commands."
