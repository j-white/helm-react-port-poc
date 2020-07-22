import { OrderByConfig } from 'datasources/entity-ds/types';

import { isPopulated as isPopulatedOrder } from './OrderConfig';

function isPopulatedAttribute(attribute: string): boolean {
  return Boolean(attribute && attribute.trim().length > 0);
}

export function isPopulated(orderBy: OrderByConfig): boolean {
  return isPopulatedAttribute(orderBy.attribute) && isPopulatedOrder(orderBy.order);
}
