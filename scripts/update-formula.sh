#!/bin/bash

# Script to update the Homebrew formula for a new release
# Usage: ./scripts/update-formula.sh <version> <github-username>

set -e

VERSION=${1:-"1.0.0"}
GITHUB_USER=${2:-"yourusername"}
REPO="${GITHUB_USER}/ghl-cli"
FORMULA_DIR="homebrew/Formula"
FORMULA_FILE="${FORMULA_DIR}/ghl-cli.rb"

echo "🔄 Updating Homebrew formula for v${VERSION}"

# Create Formula directory if it doesn't exist
mkdir -p "$FORMULA_DIR"

# Download tarball to get SHA256
URL="https://github.com/${REPO}/archive/refs/tags/v${VERSION}.tar.gz"
echo "📥 Downloading from ${URL}..."

TMP_DIR=$(mktemp -d)
curl -sL "${URL}" -o "${TMP_DIR}/v${VERSION}.tar.gz"

# Generate SHA256
SHA256=$(shasum -a 256 "${TMP_DIR}/v${VERSION}.tar.gz" | awk '{print $1}')
echo "🔐 SHA256: ${SHA256}"

# Cleanup
rm -rf "${TMP_DIR}"

# Create the formula
cat > "$FORMULA_FILE" << EOF
# Homebrew formula for ghl-cli
class GhlCli < Formula
  desc "GoHighLevel CLI - Manage your GHL account from the terminal"
  homepage "https://github.com/${REPO}"
  url "${URL}"
  sha256 "${SHA256}"
  license "ISC"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec.glob("bin/*")
  end

  test do
    system bin/"ghl", "--version"
  end
end
EOF

echo "✅ Formula updated: ${FORMULA_FILE}"
echo ""
echo "Next steps:"
echo "1. Create a GitHub release for v${VERSION}"
echo "2. Commit the formula: git add ${FORMULA_FILE} && git commit -m 'Update formula to v${VERSION}'"
echo "3. Push to your homebrew tap repository"
echo ""
echo "Users can then install with:"
echo "  brew tap ${GITHUB_USER}/ghl-cli"
echo "  brew install ghl-cli"
