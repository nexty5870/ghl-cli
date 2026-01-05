# Homebrew formula for ghl-cli
class GhlCli < Formula
  desc "GoHighLevel CLI - Manage your GHL account from the terminal"
  homepage "https://github.com/nexty5870/ghl-cli"
  url "https://github.com/nexty5870/ghl-cli/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "0019dfc4b32d63c1392aa264aed2253c1e0c2fb09216f8e2cc269bbfb8bb49b5"
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
