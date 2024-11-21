# nft-open-marketplace

Simple marketplace for buying and selling nfts.

## Local dev

1. copy .env.example to .env and fill it up
2. docker-compose build
3. docker-compose up -d

### Redeploy contracts locally

Deployed contracts data is saved in shared/contracts.deploy-data.json.
If you want to redeploy everything - delete this file. Don't forget to clean up replication db. Also If you want to restart node container - delete shared/\* folder.
