# Contract data replication server

Ethereum Replication Server
The Ethereum Replication Server is a robust service for replicating and synchronizing Ethereum blockchain data in real-time. It enables applications to process on-chain events, store relevant data, and ensure consistency even during downtime by handling live and unsynced events.

Features

- Live Event Handling: Continuously fetches events from an Ethereum node via WebSockets.
- Unsynced Event Synchronization: Replays missed events during downtime to maintain data consistency.
- Event Handlers: Dynamically maps contracts to custom handlers for processing specific event types.
- Queue-Based Architecture: Ensures event processing order using prioritized and concurrent queues.
- Scalability: Designed for modularity and extensibility to support multiple contracts and complex logic.

# Usage

It demands `../../shared/contracts.deploy-data.json` file to exist and contains contracts addresses and names. This file will appear after launching entire project via `docker-compose`. How exactly it's initialized you can find in `deploy dev` script in `blockchain` package,

Currently partially supports NFT and Marketplace contracts.

## To create migation

Currently is not set up
`npm run typeorm migration:create ./src/migrations/add-owner-to-token`

## TODO

1. Finishup with events handling
2. Move metadata replication to metadata update event
3. Add custom logger
4. Add tests
5. Support db migrations
6. Provide better gateway experience
