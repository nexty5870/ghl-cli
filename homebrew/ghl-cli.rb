# Homebrew formula for ghl-cli
class GhlCli < Formula
  desc "GoHighLevel CLI - Manage your GHL account from the terminal"
  homepage "https://github.com/yourusername/ghl-cli"
  url "https://github.com/yourusername/ghl-cli/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "PLACEHOLDER_SHA256"
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
