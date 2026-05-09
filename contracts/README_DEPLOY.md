# Foundry Deployment Guide - MemoChain

## Overview

This folder contains the Foundry toolkit configuration for deploying MemoChain smart contracts.

## Contracts

| Contract | Description |
|----------|-------------|
| `ResearcherNFT.sol` | ERC721 token representing researcher identity (Agent ID) |
| `Collaboration.sol` | Manages shared research context between researchers |

## Project Structure

```
contracts/
├── src/
│   ├── ResearcherNFT.sol
│   └── Collaboration.sol
├── script/
│   └── Deploy.s.sol          # Deployment script
├── lib/                       # Dependencies (OpenZeppelin)
├── test/                      # Test files
├── foundry.toml              # Foundry configuration
├── .env.example              # Environment variables template
└── README_DEPLOY.md          # This file
```

## Setup

1. Install Foundry (if not already installed):
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. Install dependencies:
   ```bash
   cd contracts
   git clone https://github.com/OpenZeppelin/openzeppelin-contracts lib/openzeppelin-contracts
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env and add your PRIVATE_KEY
   ```

## Deployment

### Local (Anvil)
```bash
forge script script/Deploy.s.sol --fork-url http://localhost:8545
```

### Sepolia Testnet
```bash
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
```

### Mainnet
```bash
forge script script/Deploy.s.sol --rpc-url $MAINNET_RPC_URL --broadcast
```

## Constructor Arguments

Both contracts use `Ownable` with `msg.sender` as the initial owner - no constructor arguments required.

- `ResearcherNFT`: `constructor() ERC721("MemoChainResearcher", "MCR") Ownable(msg.sender)`
- `Collaboration`: `constructor() Ownable(msg.sender)`

## Verification

After deployment, the script will output:
- Deployer address
- `ResearcherNFT` contract address
- `Collaboration` contract address