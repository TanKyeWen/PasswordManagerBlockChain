// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AuditTrail is Ownable {
    
    struct AuditEntry {
        string logID;
        string userID;
        string credID;
        string activityName;
        string date;
        string ip;
        string timestamp;
    }
    
    mapping(string => AuditEntry) public auditEntries;
    mapping(string => string[]) public userAuditEntries;
    
    string[] public allLogIDs;
    
    event AuditEntryCreated(
        string indexed logID,
        string indexed userID,
        string indexed activityName,
        string date,
        string timestamp
    );
    
    constructor() Ownable(msg.sender) {}
    
    // Add a new audit entry
    function addAuditEntry(
        string memory _logID,
        string memory _userID,
        string memory _credID,
        string memory _activityName,
        string memory _date,
        string memory _ip,
        string memory _timestamp
    ) public returns (bool) {
        require(bytes(_logID).length > 0, "LogID cannot be empty");
        require(bytes(_userID).length > 0, "UserID cannot be empty");
        require(bytes(_activityName).length > 0, "ActivityName cannot be empty");
        require(bytes(auditEntries[_logID].logID).length == 0, "LogID already exists");
        
        auditEntries[_logID] = AuditEntry({
            logID: _logID,
            userID: _userID,
            credID: _credID,
            activityName: _activityName,
            date: _date,
            ip: _ip,
            timestamp: _timestamp
        });
        
        userAuditEntries[_userID].push(_logID);
        allLogIDs.push(_logID);
        
        emit AuditEntryCreated(_logID, _userID, _activityName, _date, _timestamp);
        
        return true;
    }
    
    // Get audit entry by LogID
    function getAuditEntry(string memory _logID) public view returns (AuditEntry memory) {
        require(bytes(auditEntries[_logID].logID).length > 0, "Audit entry does not exist");
        return auditEntries[_logID];
    }
    
    // Get all audit entries for a user
    function getUserAuditEntries(string calldata _userID)
        external
        view
        returns (AuditEntry[] memory)
    {
        // storage reference to avoid illegal storage->memory assignment
        string[] storage ids = userAuditEntries[_userID];
        uint256 n = ids.length;

        AuditEntry[] memory entries = new AuditEntry[](n);
        for (uint256 i = 0; i < n; i++) {
            entries[i] = auditEntries[ids[i]];
        }
        return entries;
    }
    
    // Get all LogIDs for a user
    function getUserLogIDs(string memory _userID) public view returns (string[] memory) {
        return userAuditEntries[_userID];
    }
    
    // Get total number of audit entries
    function getTotalAuditEntries() public view returns (uint256) {
        return allLogIDs.length;
    }
    
    // Get all LogIDs
    function getAllLogIDs() public view returns (string[] memory) {
        return allLogIDs;
    }
    
    // Check if audit entry exists
    function auditEntryExists(string memory _logID) public view returns (bool) {
        return bytes(auditEntries[_logID].logID).length > 0;
    }
    
    // Get audit entries by activity name
    function getAuditEntriesByActivity(string memory _activityName) public view returns (AuditEntry[] memory) {
        uint256 count = 0;
        
        // First pass: count matching entries
        for (uint256 i = 0; i < allLogIDs.length; i++) {
            if (keccak256(abi.encodePacked(auditEntries[allLogIDs[i]].activityName)) == keccak256(abi.encodePacked(_activityName))) {
                count++;
            }
        }
        
        // Second pass: populate array
        AuditEntry[] memory matchingEntries = new AuditEntry[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allLogIDs.length; i++) {
            if (keccak256(abi.encodePacked(auditEntries[allLogIDs[i]].activityName)) == keccak256(abi.encodePacked(_activityName))) {
                matchingEntries[index] = auditEntries[allLogIDs[i]];
                index++;
            }
        }
        
        return matchingEntries;
    }
}