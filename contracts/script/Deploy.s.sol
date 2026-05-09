// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ResearcherNFT.sol";
import "../src/Collaboration.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying MemoChain contracts...");
        console.log("Deployer address:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        ResearcherNFT researcherNFT = new ResearcherNFT();
        console.log("ResearcherNFT deployed at:", address(researcherNFT));

        Collaboration collaboration = new Collaboration();
        console.log("Collaboration deployed at:", address(collaboration));

        vm.stopBroadcast();

        console.log("");
        console.log("=== Deployment Summary ===");
        console.log("ResearcherNFT:", address(researcherNFT));
        console.log("Collaboration:", address(collaboration));
    }
}
