import { BigInt, store } from '@graphprotocol/graph-ts'
import {
  Deployed as DeployedEvent,
  TemplateAdded as TemplateAddedEvent,
  TemplateDeleted as TemplateDeletedEvent,
} from "../generated/FactoryV1/FactoryV1"
import {
  Sale,
  Template,
} from "../generated/schema"
import { SaleTemplateV1 } from '../generated/templates'
import { fetchTokenName, fetchTokenSymbol, fetchTokenDecimals } from './utils/token'

export function handleDeployed(event: DeployedEvent): void {
  const sale = new Sale(event.params.deployedAddr.toHex())
  sale.templateName = event.params.templateName
  sale.owner = event.params.owner.toHex()
  sale.token = event.params.tokenAddr.toHex()
  sale.tokenSymbol = fetchTokenSymbol(event.params.tokenAddr)
  sale.tokenName = fetchTokenName(event.params.tokenAddr)
  sale.tokenDecimals = fetchTokenDecimals(event.params.tokenAddr)
  sale.startingAt = event.params.startingAt
  sale.closingAt = event.params.startingAt.plus(event.params.eventDuration)
  sale.distributeAmount = event.params.distributeAmount
  sale.minimalProvideAmount = event.params.minimalProvideAmount
  sale.totalProvided = BigInt.fromI32(0)
  sale.save()
  SaleTemplateV1.create(event.params.deployedAddr)
}

export function handleTemplateAdded(event: TemplateAddedEvent): void {
  const template = new Template(event.params.templateAddr.toHex())
  template.templateName = event.params.templateName
  template.addedAt = event.block.timestamp
  template.save()
}

export function handleTemplateDeleted(event: TemplateDeletedEvent): void {
  store.remove('Template', event.params.templateAddr.toHex())
}