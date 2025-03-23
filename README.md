# Discord AI Wallet

This project combines the discord user interface that people are already familiar with, with an in-chat ai wallet that you can interact with using natural language. 

Every discord user id is converted into a counter-factual Safe (multi-sig) which each discord user in your server can operate via commands. 

Just type "/do" and then describe what you would like to do and the ai wallet will attempt to do it.

Operations that require confirmation will display a summary of the action that will be taken and buttons to confirm the action.

An LLM parses what you describe and attempts to match it against a set of possible tasks it is able to do. 

If you are unsure of what you can do, ask for help from the bot and it will list what it is capable of.

The ai wallet can be installed on any discord server and configured for any ERC20 token that the server would like to make available to their users.

The idea is to make it easy for anyone interact with the server tokens but also to bring the interaction where the conversation is. You can have a discussion within your server about a task and its completion and, upon completion, send the other person some tokens without ever leaving discord. 

This also works in the discord mobile app.

The user's Safe is operated via the ai wallet's server through a module. If the user would like to take control of their account, they can always use the "/add-owner" command to specify the 0x address of an EOA to be added as a signer to their Safe. From here, they can always disable the module and completely take over the Safe if they want.

## Submission

Try Discord AI Wallet on [our server](https://discord.citizenwallet.xyz).

View demo transaction [here](https://celoscan.io/tx/0x2aef2ff484696bf23d5499805e2f04336aab112fac85f1a5f9d0709bdaf80a0a).

View demo Safe assets [here](https://app.safe.global/balances?safe=celo:0x1C0032270925D0f858A231b240F294950cB2e14C).

View demo Safe transaction history [here](https://app.safe.global/transactions/history?safe=celo:0x1C0032270925D0f858A231b240F294950cB2e14C).

## Setup

1. Clone this repository
2. Install dependencies:   ```bash
   npm install   ```
3. Create a `.env` file in the root directory with your bot token and client ID:   ```
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here   ```
4. Build the TypeScript code:   ```bash
   npm run build   ```
5. Register the slash commands:   ```bash
   npm run register   ```
6. Start the bot:   ```bash
   npm start   ```

For development with auto-restart: