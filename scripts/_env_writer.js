// scripts/_env_writer.js
const fs = require("fs");
const path = require("path");

function upsertEnv(filePath, kv) {
  let src = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const ensureNL = (s) => (s.length && !s.endsWith("\n") ? s + "\n" : s);

  for (const [key, value] of Object.entries(kv)) {
    const re = new RegExp(`^${key}=.*$`, "m");
    if (re.test(src)) {
      src = src.replace(re, `${key}=${value}`);
    } else {
      src = ensureNL(src) + `${key}=${value}\n`;
    }
  }
  fs.writeFileSync(filePath, src);
  console.log(`✔ Updated ${path.basename(filePath)} with ${Object.keys(kv).join(", ")}`);
}

module.exports = { upsertEnv };
