import { ChatInputCommandInteraction, Client } from "discord.js";
import { getCommunities } from "../../cw";
import { createProgressSteps } from "../../utils/progress";
import { parseDoTask } from "../../openai";
import {
  ErrorTaskArgs,
  MissingInformationTaskArgs,
  SendTaskArgs,
  AddressTaskArgs,
  BalanceTaskArgs,
} from "./tasks";
import { sendCommand } from "../send";
import { addressCommand } from "../address";
import { balanceCommand } from "../balance";

export const handleDoCommand = async (
  client: Client,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.reply({
    content: createProgressSteps(0),
    ephemeral: true,
  });

  const task = interaction.options.getString("task");
  if (!task) {
    await interaction.editReply("You need to specify a task!");
    return;
  }

  const serverId = interaction.guildId;
  if (!serverId) {
    await interaction.editReply({
      content: "This command can only be used in a server.",
    });
    return;
  }

  const communities = getCommunities(serverId);

  const response = await parseDoTask(task, communities);

  console.log(response);

  switch (response.name) {
    case "send":
      await sendCommand(client, interaction, response as SendTaskArgs);
      break;
    case "address":
      await addressCommand(interaction, response as AddressTaskArgs);
      break;
    case "balance":
      await balanceCommand(interaction, response as BalanceTaskArgs);
      break;
    case "missingInformation":
      const missingInformationResponse = response as MissingInformationTaskArgs;
      await interaction.editReply({
        content: missingInformationResponse.missingInformation,
      });
      break;
    case "error":
      const errorResponse = response as ErrorTaskArgs;
      await interaction.editReply({
        content: errorResponse.error,
      });
      break;
    default:
      await interaction.editReply({
        content: "Unable to determine which task to perform.",
      });
      return;
  }
};
