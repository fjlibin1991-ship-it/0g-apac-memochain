// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Collaboration
/// @notice Manages shared research context between researchers via Agent ID subspaces.
///         A researcher can grant another researcher read access to a subset of their knowledge graph.
contract Collaboration is Ownable {
    struct Share {
        address fromResearcher;
        address toResearcher;
        uint256 permissionLevel; // 1=read summaries only, 2=read+notes, 3=full context
        bool active;
        uint256 grantedAt;
    }

    uint256 private _shareIdCounter = 1;
    mapping(uint256 => Share) public shares;
    // from → to → shareId
    mapping(address => mapping(address => uint256)) public shareIndex;

    event ShareGranted(uint256 indexed shareId, address indexed from, address indexed to, uint256 level);
    event ShareRevoked(uint256 indexed shareId);

    constructor() Ownable(msg.sender) {}

    /// @notice Grant another researcher access to your research context
    function grantShare(address to, uint256 permissionLevel) external returns (uint256 shareId) {
        require(to != msg.sender, "Cannot share with self");
        require(permissionLevel >= 1 && permissionLevel <= 3, "Invalid permission level");

        // Revoke existing share if any
        uint256 existing = shareIndex[msg.sender][to];
        if (existing > 0) {
            shares[existing].active = false;
        }

        shareId = _shareIdCounter++;
        shares[shareId] = Share({
            fromResearcher: msg.sender,
            toResearcher: to,
            permissionLevel: permissionLevel,
            active: true,
            grantedAt: block.timestamp
        });
        shareIndex[msg.sender][to] = shareId;

        emit ShareGranted(shareId, msg.sender, to, permissionLevel);
        return shareId;
    }

    /// @notice Revoke a share
    function revokeShare(address targetResearcher) external {
        uint256 shareId = shareIndex[msg.sender][targetResearcher];
        require(shareId > 0, "No share exists");
        require(shares[shareId].active, "Already revoked");
        shares[shareId].active = false;
        emit ShareRevoked(shareId);
    }

    /// @notice Check if a share is active and get permission level
    function getPermission(address from, address to) external view returns (uint256 level) {
        uint256 shareId = shareIndex[from][to];
        if (shareId == 0 || !shares[shareId].active) return 0;
        return shares[shareId].permissionLevel;
    }
}
