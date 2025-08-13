const hre = require("hardhat");

async function main() {
  console.log("Deploying AuditTrail contract...");
  
  // Deploy the contract
  const AuditTrail = await hre.ethers.getContractFactory("AuditTrail");
  const auditTrail = await AuditTrail.deploy();
  
  await auditTrail.waitForDeployment();
  
  const contractAddress = await auditTrail.getAddress();
  console.log("AuditTrail deployed to:", contractAddress);
  
  // Test the contract with some sample data
  console.log("\nTesting contract with sample audit entries...");
  
  const [deployer] = await hre.ethers.getSigners();
  
  // Get current timestamp
  const currentTimestamp = Math.floor(Date.now() / 1000).toString();
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Add some test audit entries
  await auditTrail.addAuditEntry(
    "log_001",
    "user_123",
    "cred_456",
    "LOGIN",
    currentDate,
    "192.168.1.100",
    currentTimestamp
  );
  
  await auditTrail.addAuditEntry(
    "log_002", 
    "user_123",
    "",
    "FILE_ACCESS",
    currentDate,
    "192.168.1.100",
    (parseInt(currentTimestamp) + 300).toString()
  );
  
  await auditTrail.addAuditEntry(
    "log_003",
    "user_456",
    "cred_789",
    "LOGIN",
    currentDate,
    "192.168.1.200",
    (parseInt(currentTimestamp) + 600).toString()
  );
  
  console.log("Added 3 test audit entries");
  
  // Query the data
  const totalEntries = await auditTrail.getTotalAuditEntries();
  console.log(`Total audit entries: ${totalEntries}`);
  
  // Get first entry
  const firstEntry = await auditTrail.getAuditEntry("log_001");
  console.log("\nFirst audit entry:");
  console.log(`- LogID: ${firstEntry.logID}`);
  console.log(`- UserID: ${firstEntry.userID}`);
  console.log(`- CredID: ${firstEntry.credID}`);
  console.log(`- ActivityName: ${firstEntry.activityName}`);
  console.log(`- Date: ${firstEntry.date}`);
  console.log(`- IP: ${firstEntry.ip}`);
  console.log(`- Timestamp: ${firstEntry.timestamp}`);
  
  // Get user audit entries
  console.log("\nUser audit entries for user_123:");
  const userEntries = await auditTrail.getUserAuditEntries("user_123");
  console.log(`Found ${userEntries.length} entries for user_123`);
  
  for (let i = 0; i < userEntries.length; i++) {
    const entry = userEntries[i];
    console.log(`  Entry ${i + 1}: ${entry.activityName} at ${entry.timestamp}`);
  }
  
  console.log("\n✅ Contract deployed and tested successfully!");
  console.log(`\nContract Address: ${contractAddress}`);
  console.log("Network: Hardhat Local Network");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });