import { Received as ReceivedEvent } from "../generated/SaleTemplateV1/SaleTemplateV1";
import { Sale } from "../generated/schema";

export function handleReceived(event: ReceivedEvent): void {
  let sale = Sale.load(event.address.toHexString());
  if (sale === null) return;
  sale.totalRaised = sale.totalRaised.plus(event.params.amount);
  sale.save();
}
