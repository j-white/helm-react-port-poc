import { OrderConfig, OrderType } from 'datasources/entity-ds/types';

export interface OrderOptions {
  label: string;
  value: OrderType;
}

export const orderOptions: OrderOptions[] = [
  {
    label: 'ASC',
    value: 'ASC',
  },
  {
    label: 'DESC',
    value: 'DESC',
  },
];

const orders = orderOptions.map(order => order.label);

export function isPopulated(order: OrderConfig): boolean {
  return order && orders.includes(order.label);
}
