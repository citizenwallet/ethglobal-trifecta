export interface GenericTaskArgs {
  name: string;
}

export interface SendTaskArgs {
  name: string;
  alias: string;
  users: string[];
  amount: number;
  message: string;
}

export interface AddressTaskArgs {
  name: string;
  alias: string[];
}

export interface MissingInformationTaskArgs {
  name: string;
  missingInformation: string;
}

export interface ErrorTaskArgs {
  name: string;
  error: string;
}

export interface DoTask {
  name: "send" | "address" | "error" | "missingInformation";
  purpose: string;
  args:
    | SendTaskArgs
    | AddressTaskArgs
    | ErrorTaskArgs
    | MissingInformationTaskArgs;
}

export const ExampleDoTask: DoTask = {
  name: "send",
  purpose: "Send a token to another user, the token is resolved via the alias",
  args: {
    name: "send",
    alias: "gratitude",
    users: ["@JohnDoe"],
    amount: 100,
    message: "Thank you for your support!",
  },
};

export const ExampleAddressTask: DoTask = {
  name: "address",
  purpose:
    "Reveal the user's address for the communities they specify (these will go in the alias field). If they are not specific about which community, put all the community aliases in the alias field.",
  args: {
    name: "address",
    alias: ["alias1", "alias2"],
  },
};

export const ExampleMissingInformationTask: DoTask = {
  name: "missingInformation",
  purpose: "Handle a missing information",
  args: {
    name: "missingInformation",
    missingInformation: "{tell the user what information is missing}",
  },
};

export const ExampleErrorTask: DoTask = {
  name: "error",
  purpose: "Handle an error",
  args: {
    name: "error",
    error: "I am only able to perform the following: send, reveal address",
  },
};
