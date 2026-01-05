# Homebrew Distribution Guide

This guide explains how to make `ghl-cli` available via Homebrew.

---

## Option 1: Create Your Own Tap (Recommended)

A "tap" is a GitHub repository containing Homebrew formulas. This gives you full control over distribution.

### Step 1: Create a Tap Repository

1. Create a new GitHub repository called `homebrew-ghl-cli`
2. Initialize it with this structure:

```
homebrew-ghl-cli/
└── Formula/
    └── ghl-cli.rb
```

### Step 2: Create the Formula

Your formula file should look like this:

```ruby
# Formula/ghl-cli.rb
class GhlCli < Formula
  desc "GoHighLevel CLI - Manage your GHL account from the terminal"
  homepage "https://github.com/yourusername/ghl-cli"
  url "https://github.com/yourusername/ghl-cli/archive/refs/tags/v1.0.0.tar.gz"
  sha256 ""  # Will be filled in automatically
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
```

### Step 3: Generate SHA256

After creating a release on GitHub, run this to get the SHA256:

```bash
# Download the release tarball
curl -O https://github.com/yourusername/ghl-cli/archive/refs/tags/v1.0.0.tar.gz

# Generate SHA256
shasum -a 256 v1.0.0.tar.gz

# Output example:
# abc123def456...  v1.0.0.tar.gz
```

Update the formula with the SHA256 value.

### Step 4: Push to GitHub

```bash
cd homebrew-ghl-cli
git init
git add .
git commit -m "Add ghl-cli formula"
git branch -M main
git remote add origin https://github.com/yourusername/homebrew-ghl-cli.git
git push -u origin main
```

### Step 5: Users Install via Tap

```bash
brew tap yourusername/ghl-cli
brew install ghl-cli
```

---

## Option 2: Submit to Homebrew Core

For inclusion in the official Homebrew repository:

1. Fork https://github.com/Homebrew/homebrew-core
2. Create a new formula in `Formula/ghl-cli.rb`
3. Submit a Pull Request
4. Wait for review/approval

This is more rigorous but gives broader visibility.

---

## Automated Formula Updates

To automate SHA256 generation and formula updates, create this script:

```bash
#!/bin/bash
# update-formula.sh

VERSION=$1
REPO="yourusername/ghl-cli"

# Download tarball
URL="https://github.com/${REPO}/archive/refs/tags/v${VERSION}.tar.gz"
curl -O "$URL"

# Generate SHA256
SHA256=$(shasum -a 256 "v${VERSION}.tar.gz" | awk '{print $1}')

# Update formula
cat > Formula/ghl-cli.rb << EOF
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

echo "Formula updated for v${VERSION}"
echo "SHA256: ${SHA256}"
```

Usage: `./update-formula.sh 1.0.0`

---

## Quick Start Template

Use this to quickly set up your tap:

```bash
# Clone this template
git clone https://github.com/Homebrew/homebrew-bundle homebrew-ghl-cli
cd homebrew-ghl-cli

# Remove existing formulas
rm -rf Formula/*

# Add your formula
mkdir -p Formula
# Create Formula/ghl-cli.rb with content above

# Push to your GitHub
git remote set-url origin https://github.com/yourusername/homebrew-ghl-cli.git
git push -u origin main
```

---

## Publishing Checklist

- [ ] Create GitHub release with tarball
- [ ] Generate SHA256 hash
- [ ] Update formula with correct SHA256
- [ ] Test installation: `brew install ghl-cli`
- [ ] Test basic commands: `ghl --version`
- [ ] Document in README

---

## Testing Locally Before Publishing

```bash
# Tap your local repository
brew tap file://$(pwd)/homebrew-ghl-cli

# Install
brew install ghl-cli

# Test
ghl --version
```
