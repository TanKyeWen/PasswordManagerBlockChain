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
    
    // Get all audit entries for a user
    function getUserAuditEntries(string memory _userID) public view returns (AuditEntry[] memory) {
        string[] memory userLogIDs = userAuditEntries[_userID];
        AuditEntry[] memory entries = new AuditEntry[](userLogIDs.length);
        
        for (uint256 i = 0; i < userLogIDs.length; i++) {
            entries[i] = auditEntries[userLogIDs[i]];
        }
        
        return entries;
    }
}