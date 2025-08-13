const path = require("path");
const { upsertEnv } = require("./_env_writer");
const hre = require("hardhat");

const CONTRACT_NAME = "AuditTrail";
const BACKEND_DIR =
  process.env.BACKEND_DIR ||
  path.join(__dirname, "..", "..", "PasswordManagerBackEnd", "flask-app");
const BACKEND_ENV = path.join(BACKEND_DIR, ".env");

async function main() {
  const F = await hre.ethers.getContractFactory(CONTRACT_NAME);
  const c = await F.deploy();
  await c.waitForDeployment();
  const address = c.getAddress ? await c.getAddress() : c.target;

  upsertEnv(BACKEND_ENV, {
    CONTRACT_ADDRESS: address,
    HARDHAT_URL: "http://127.0.0.1:8545",
    CHAIN_ID: String(hre.network.config.chainId ?? 31337),
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
