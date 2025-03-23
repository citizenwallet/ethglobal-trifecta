import express from "express";
import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { registerCommands } from "./register-commands";
import { handleTransactionsCommand } from "./commands/transactions";
import { handleAddOwnerCommand } from "./commands/addOwner";
import { handleTokenAutocomplete } from "./autocomplete/token";
import { handleSignupCommand } from "./commands/signup";
import { handleSignupModal } from "./modals/signup";
import { handleDoCommand } from "./commands/do";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
  ],
});

// Add error handling and reconnection logic
client.on("error", (error) => {
  console.error("Discord client error:", error);
  // Attempt to reconnect after a delay
  setTimeout(() => {
    console.log("Attempting to reconnect...");
    client.login(token);
  }, 5000); // Wait 5 seconds before reconnecting
});

client.on("disconnect", () => {
  console.log("Discord client disconnected");
  // Attempt to reconnect after a delay
  setTimeout(() => {
    console.log("Attempting to reconnect...");
    client.login(token);
  }, 5000);
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  registerCommands();
});

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isModalSubmit()) {
    await handleSignupModal(client, interaction);
    return;
  }

  if (interaction.isAutocomplete()) {
    switch (interaction.options.getFocused(true).name) {
      case "token":
        await handleTokenAutocomplete(interaction);
        break;
      default:
        await interaction.respond([]);
        break;
    }
  }

  if (!interaction.isChatInputCommand()) return;

  if (interaction.replied) return;

  switch (interaction.commandName) {
    case "do":
      await handleDoCommand(client, interaction);
      break;
    case "transactions":
      await handleTransactionsCommand(interaction);
      break;
    case "add-owner":
      await handleAddOwnerCommand(client, interaction);
      break;
    case "signup":
      await handleSignupCommand(interaction);
      break;
    default:
      await interaction.reply("Command not found");
      break;
  }
});

// Log in to Discord with your client's token
const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("DISCORD_TOKEN is not defined in .env file");

client.login(token);

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log("Citizen Wallet Discord Bot");
  res.send("Citizen Wallet Discord Bot");
});

app.get("/health", (req, res) => {
  if (client.isReady()) {
    res.status(200).json({ status: "healthy", connected: true });
  } else {
    res.status(503).json({ status: "unhealthy", connected: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
