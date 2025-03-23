import { getCardAddress } from "@citizenwallet/sdk";
import { ChatInputCommandInteraction } from "discord.js";
import { keccak256, toUtf8Bytes } from "ethers";
import { getCommunity } from "../cw";
import { generateSafeAccountUrl } from "../utils/safe";

export const handleTransactionsCommand = async (
  interaction: ChatInputCommandInteraction
) => {
  await interaction.reply({ content: "⚙️ Fetching...", ephemeral: true });

  const alias = interaction.options.getString("token");
  if (!alias) {
    await interaction.editReply("You need to specify a token!");
    return;
  }

  const community = getCommunity(alias);

  const hashedUserId = keccak256(toUtf8Bytes(interaction.user.id));

  const address = await getCardAddress(community, hashedUserId);

  if (!address) {
    await interaction.editReply("You don't have an account yet!");
    return;
  }

  await interaction.editReply({
    content: `✅ [View your transactions](${generateSafeAccountUrl(
      community,
      address,
      "/transactions"
    )})`,
  });
};
