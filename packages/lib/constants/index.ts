export const CHAIN_NAMES: { [key: string]: "mainnet" | "sepolia" | "goerli" } =
  {
    "1": "mainnet",
    "5": "goerli",
    "11155111": "sepolia",
  };

export const CHAIN_IDS = {
  mainnet: 1,
  goerli: 5,
  sepolia: 11155111,
};

export const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price";

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ETHER_DECIMALS_FOR_VIEW = 2;

export const SALE_TEMPLATE_V1_NAME =
  "0x53616c6554656d706c6174655631000000000000000000000000000000000000";

export const LOCK_DURATION: { [key: string]: number } = {
  // SaleTemplateV1 -> 3 day
  [SALE_TEMPLATE_V1_NAME]: 86400 * 3,
};

export const FEE_RATE_PER_MIL: { [key: string]: number } = {
  // SaleTemplateV1
  [SALE_TEMPLATE_V1_NAME]: 1,
};

export const URL_REGEX = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);

export const SAMPLE_DISCLAIMERS = `By participating in this token sale event, you acknowledge and agree to the following terms:

1. The use of this protocol is subject to jurisdictional requirements, and you understand and accept that engaging with this protocol may have legal implications based on your local laws and regulations. You are solely responsible for complying with applicable laws and regulations.
2. This protocol is provided on an ""as-is"" basis, without any warranties or guarantees of any kind, whether expressed or implied. It is your responsibility to assess the risks involved and make an informed decision about participating in this token sale event.
3. This protocol is not intended to comply with specific laws and regulations of any jurisdiction. It is your responsibility to understand and comply with the relevant laws and regulations applicable to you.
4. The operation of this protocol is standardized for all users, and no special privileges or advantages are provided to any individual or entity. The protocol operates based on its predetermined rules in codes.
5. In the event of any bugs, defects, or malfunctions in the protocol, no party, including the protocol developers, organizers, or any associated individuals or entities, shall be held liable for any losses, damages, or issues arising from such incidents. You understand that the protocol is a complex system, and there is inherent risk in using it.`;
