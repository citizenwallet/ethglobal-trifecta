import { CommunityConfig } from "@citizenwallet/sdk/dist/src/config";
import OpenAI from "openai";
import {
  DoTask,
  ExampleAddressTask,
  ExampleBalanceTask,
  ExampleDoTask,
  ExampleErrorTask,
  ExampleMissingInformationTask,
  ExampleShareAddressTask,
  GenericTaskArgs,
} from "../commands/do/tasks";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const constructSystemPrompt = (
  possibleTasks: DoTask[],
  possibleCommunities: CommunityConfig[]
) => {
  let prompt = `You are a discord bot that parses the user's message into a task. The task is a string that describes the task to be performed.`;

  if (possibleTasks.length > 0) {
    const possibleTasksString = possibleTasks
      .map(
        (task) =>
          `\nif it is a ${
            task.name
          } task, determine this by the following purpose: ${
            task.purpose
          }. This is the JSON output we want for this task: ${JSON.stringify(
            task.args
          )}`
      )
      .join("\n");

    prompt += `\n\nThe output should be JSON parseable following one of the following formats: ${possibleTasksString}`;
  }

  if (possibleCommunities.length > 0) {
    const possibleCommunitiesString = possibleCommunities
      .map(
        (community) =>
          `${community.community.alias} (community name: ${community.community.name}, token symbol: ${community.primaryToken.symbol}, token name: ${community.primaryToken.name}, token decimals: ${community.primaryToken.decimals})`
      )
      .join("\n");

    prompt += `\n\nIn order to pick an alias, here is some context. Only pick an alias from the following list: ${possibleCommunitiesString}`;
  }

  prompt += `\n\n A discord mention can look like this: <@1234567890> or <@!1234567890>. Do not remove the <@ or <@!>`;

  prompt += `\n\n If the user's message is not clear or you cannot determine the task, return an error task with the following format: ${JSON.stringify(
    ExampleErrorTask.args
  )}`;

  prompt += `\n\n If the user's message is missing information in order to complete one of the tasks, return a missing information task with the following format and tell them what is missing: ${JSON.stringify(
    ExampleMissingInformationTask.args
  )}`;

  return prompt;
};

export const parseDoTask = async (
  task: string,
  communities: CommunityConfig[]
): Promise<GenericTaskArgs> => {
  console.log("task", task);
  console.log(
    constructSystemPrompt(
      [
        ExampleDoTask,
        ExampleAddressTask,
        ExampleBalanceTask,
        ExampleShareAddressTask,
      ],
      communities
    )
  );
  const response = await client.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: constructSystemPrompt(
          [
            ExampleDoTask,
            ExampleAddressTask,
            ExampleBalanceTask,
            ExampleShareAddressTask,
          ],
          communities
        ),
      },
      { role: "user", content: task },
    ],
  });

  if (!response.choices[0].message.content) {
    throw new Error("Failed to get idea evaluation");
  }

  const content = JSON.parse(response.choices[0].message.content);

  if (Array.isArray(content)) {
    throw new Error("Invalid response format");
  }

  return content;
};
