import { REST, Routes } from "discord.js";
import "dotenv/config";

const getCommands = () =>
  [
    {
      name: "do",
      description: "Ask me to do something! 🤖",
      options: [
        {
          name: "task",
          description: "The task to do",
          type: 3, // STRING type
          required: true,
        },
      ],
    },
    {
      name: "signup",
      description: "Request access for your server.",
      default_member_permissions: "32",
    },
    {
      name: "balance",
      description: "Reveals your balances privately! 🥷",
    },
    {
      name: "share-balance",
      description: "Shares your balance of a token to others 📣",
      options: [
        {
          name: "token",
          description: "The token to check",
          type: 3, // STRING type
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      name: "transactions",
      description: "Reveals a link to your transactions privately! 🥷",
      options: [
        {
          name: "token",
          description: "The token to check",
          type: 3, // STRING type
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      name: "add-owner",
      description: "Add an owner to your Safe! 🔑",
      options: [
        {
          name: "owner",
          description:
            "The owner's 0x address (needs to be a valid ethereum address)",
          type: 3, // STRING type
          required: true,
        },
      ],
    },
  ] as const;

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token) throw new Error("DISCORD_TOKEN is not defined in .env file");
if (!clientId) throw new Error("CLIENT_ID is not defined in .env file");

export const registerCommands = async () => {
  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log("Started refreshing application (/) commands.");

    const commands = getCommands();

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

registerCommands();
