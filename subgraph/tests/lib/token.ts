import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { createMockedFunction } from "matchstick-as";

export function createTokenMockFuntions(address: Address, name: string, symbol: string, decimals: BigInt): void {
    createMockedFunction(address, "name", "name():(string)")
    .withArgs([])
    .returns([ethereum.Value.fromString(name)]);

    createMockedFunction(address, "symbol", "symbol():(string)")
        .withArgs([])
        .returns([ethereum.Value.fromString(symbol)]);

    createMockedFunction(address, "decimals", "decimals():(uint8)")
        .withArgs([])
        .returns([ethereum.Value.fromUnsignedBigInt(decimals)]);    
}