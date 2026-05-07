// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ResearcherNFT
/// @notice Represents a researcher's identity as an ERC721 token (Agent ID).
///         Stores: expertise profile, reading history, research interests, reputation.
contract ResearcherNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _researcherIdCounter;

    struct ResearcherProfile {
        string name;
        string[] researchInterests;  // e.g. ["LLM", "reinforcement learning", "CV"]
        uint256 papersRead;
        uint256 sessionsCompleted;
        uint256 reputation;         // aggregate from citations + helpful answers
        string metadataURI;         // IPFS: full profile, avatar, bio
        uint256 registeredAt;
    }

    mapping(uint256 => ResearcherProfile) public profiles;
    mapping(address => uint256) public addressToResearcherId;

    event ResearcherRegistered(uint256 indexed id, address indexed owner, string name);
    event ProfileUpdated(uint256 indexed id);
    event ReputationIncreased(uint256 indexed id, uint256 delta);

    constructor() ERC721("MemoChainResearcher", "MCR") Ownable(msg.sender) {}

    /// @notice Register as a researcher and mint Agent ID NFT
    function registerResearcher(
        string calldata name,
        string[] calldata researchInterests,
        string calldata metadataURI
    ) external returns (uint256 researcherId) {
        require(bytes(name).length > 0, "Name required");
        require(bytes(metadataURI).length > 0, "Metadata URI required");

        researcherId = _researcherIdCounter++;
        _safeMint(msg.sender, researcherId);
        _setTokenURI(researcherId, metadataURI);

        profiles[researcherId] = ResearcherProfile({
            name: name,
            researchInterests: researchInterests,
            papersRead: 0,
            sessionsCompleted: 0,
            reputation: 0,
            metadataURI: metadataURI,
            registeredAt: block.timestamp
        });

        addressToResearcherId[msg.sender] = researcherId;
        emit ResearcherRegistered(researcherId, msg.sender, name);
        return researcherId;
    }

    /// @notice Update research interests
    function updateResearchInterests(uint256 researcherId, string[] calldata newInterests) external {
        require(ownerOf(researcherId) == msg.sender, "Not authorized");
        profiles[researcherId].researchInterests = newInterests;
        emit ProfileUpdated(researcherId);
    }

    /// @notice Increment paper read count (called by paper upload system)
    function incrementPapersRead(uint256 researcherId) external onlyOwner {
        require(_exists(researcherId), "Not found");
        profiles[researcherId].papersRead++;
    }

    /// @notice Increment session count
    function incrementSessions(uint256 researcherId) external onlyOwner {
        require(_exists(researcherId), "Not found");
        profiles[researcherId].sessionsCompleted++;
    }

    /// @notice Increase reputation (called by citation/answer quality system)
    function increaseReputation(uint256 researcherId, uint256 delta) external onlyOwner {
        require(_exists(researcherId), "Not found");
        profiles[researcherId].reputation += delta;
        emit ReputationIncreased(researcherId, delta);
    }

    /// @notice Get researcher ID for a wallet address
    function getResearcherId(address owner) external view returns (uint256) {
        return addressToResearcherId[owner];
    }

    /// @notice Get full profile
    function getProfile(uint256 researcherId) external view returns (ResearcherProfile memory) {
        require(_exists(researcherId), "Not found");
        return profiles[researcherId];
    }

    // ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
