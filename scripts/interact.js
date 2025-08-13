const hre = require("hardhat");

async function main() {
  // Connect to the deployed contract
  // Replace this address with your deployed contract address
  const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
  
  const AuditTrail = await hre.ethers.getContractFactory("AuditTrail");
  const auditTrail = AuditTrail.attach(CONTRACT_ADDRESS);
  
  const [deployer, user1] = await hre.ethers.getSigners();
  
  console.log("🔗 Interacting with AuditTrail contract...");
  console.log("Contract address:", CONTRACT_ADDRESS);
  console.log("Current user:", deployer.address);
  
  try {
    // Example 1: Add a login audit entry
    console.log("\n📝 Adding login audit entry...");
    const loginData = "User authenticated via OAuth";
    const loginHash = await auditTrail.createDataHash(loginData);
    const tx1 = await auditTrail.addAuditEntry("LOGIN", "user456", loginData, loginHash);
    await tx1.wait();
    console.log("✅ Login audit entry added");
    
    // Example 2: Add a file access audit entry
    console.log("\n📝 Adding file access audit entry...");
    const accessData = "Accessed confidential document: contract.pdf";
    const accessHash = await auditTrail.createDataHash(accessData);
    const tx2 = await auditTrail.addAuditEntry("FILE_ACCESS", "contract.pdf", accessData, accessHash);
    await tx2.wait();
    console.log("✅ File access audit entry added");
    
    // Example 3: Add a data modification audit entry
    console.log("\n📝 Adding data modification audit entry...");
    const modifyData = "Updated user profile: email changed";
    const modifyHash = await auditTrail.createDataHash(modifyData);
    const tx3 = await auditTrail.addAuditEntry("UPDATE", "profile_user456", modifyData, modifyHash);
    await tx3.wait();
    console.log("✅ Data modification audit entry added");
    
    // Query total entries
    console.log("\n📊 Querying audit trail...");
    const totalEntries = await auditTrail.getTotalAuditEntries();
    console.log(`Total audit entries: ${totalEntries}`);
    
    // Get all entries for this user
    const userEntries = await auditTrail.getUserAuditIds(deployer.address);
    console.log(`Entries by current user: ${userEntries.length}`);
    
    // Display last 3 entries
    console.log("\n📋 Last 3 audit entries:");
    for (let i = Math.max(1, Number(totalEntries) - 2); i <= totalEntries; i++) {
      const entry = await auditTrail.getAuditEntry(i);
      console.log(`\n--- Entry ${i} ---`);
      console.log(`User: ${entry.user}`);
      console.log(`Action: ${entry.action}`);
      console.log(`Resource: ${entry.resourceId}`);
      console.log(`Details: ${entry.details}`);
      console.log(`Time: ${new Date(Number(entry.timestamp) * 1000).toISOString()}`);
      
      // Verify data integrity
      const isValid = await auditTrail.verifyDataIntegrity(i, entry.dataHash);
      console.log(`Data integrity: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
    // Example of querying by resource
    console.log("\n🔍 Querying entries for 'user456'...");
    const resourceEntries = await auditTrail.getResourceAuditIds("user456");
    console.log(`Found ${resourceEntries.length} entries for resource 'user456'`);
    
    console.log("\n🎉 Interaction complete!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Helper function to format the interaction script with actual contract address
async function getContractAddress() {
  console.log("ℹ️  To use this script:");
  console.log("1. Deploy the contract first: npm run deploy");
  console.log("2. Copy the contract address from the deploy output");
  console.log("3. Replace 'YOUR_CONTRACT_ADDRESS_HERE' in scripts/interact.js");
  console.log("4. Run: npx hardhat run scripts/interact.js --network localhost");
}

if (process.argv.includes("--help")) {
  getContractAddress();
} else {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}