import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../generated/Factory/ERC20";
import { Token } from "../../generated/schema";

export function findOrCreateToken(addressString: string): Token {
  let token = Token.load(addressString);
  if(token == null) {
    token = new Token(addressString);
    if(addressString == "0x0000000000000000000000000000000000000000") {
      token.symbol = "ETH";
      token.name = "Ether";
      token.decimals = BigInt.fromI32(18);
    } else {
      token.symbol = fetchTokenSymbol(changetype<Address>(Address.fromHexString(addressString)));
      token.name = fetchTokenName(changetype<Address>(Address.fromHexString(addressString)));
      token.decimals = fetchTokenDecimals(changetype<Address>(Address.fromHexString(addressString)));
    }
    token.save();
  }
  return token;
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);

  let symbolValue = "???";
  let symbolResult = contract.try_symbol();
  if (!symbolResult.reverted) {
    symbolValue = symbolResult.value;
  }

  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);

  let nameValue = "Unknown";
  let nameResult = contract.try_name();
  if (!nameResult.reverted) {
    nameValue = nameResult.value;
  }

  return nameValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  let decimalValue = 0;
  let decimalResult = contract.try_decimals();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }

  return BigInt.fromI32(decimalValue);
}
