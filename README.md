# NFT Open Marketplace

A simple, open-source platform for buying and selling NFTs, designed for ease of use and rapid deployment.

## Getting Started: Local dev

### Prerequisites

1. Docker
2. Docker Compose

### Installation

0. Clone the repository:
1. copy .env.example to .env and fill it up
2. docker-compose build
3. docker-compose up -d
4. open http://localhost:3000

### Redeploy contracts locally

Deployed contracts data is saved in shared/contracts.deploy-data.json.
If you want to redeploy everything - delete this file. Don't forget to clean up replication db. Also If you want to restart node container - delete shared/\* folder.

## Contact

For questions or feedback, please open an issue on the GitHub repository.

## 📋 Features Checklist

- ✅ **Mint NFTs**: Create unique NFTs with metadata.
- ✅ **List NFTs**: List NFTs for sale and allow users to purchase them.
- ❌ **Purchase NFTs**: Enable users to buy listed NFTs.
- ❌ **Burn NFTs**: Remove invalid or unwanted NFTs from the blockchain.
- ❌ **View My NFTs**: Allow users to view their owned NFTs.
- ❌ **Search NFTs**: Enable searching across all listed NFTs on the platform.
