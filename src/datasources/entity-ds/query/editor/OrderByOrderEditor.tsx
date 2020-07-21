import React from 'react';

import { Select } from '@grafana/ui';

import { EntityQueryStatementOrder, EntityQueryStatementOrderType } from 'datasources/entity-ds/types';

interface OrderOptions {
  label: string;
  value: EntityQueryStatementOrderType;
}

const orderOptions: OrderOptions[] = [
  {
    label: 'ASC',
    value: 'ASC',
  },
  {
    label: 'DESC',
    value: 'DESC',
  },
];

type Props = {
  order: EntityQueryStatementOrder;
  onChange: (value: EntityQueryStatementOrder) => void;
};

export const OrderByOrderEditor: React.FC<Props> = ({ order, onChange }) => {
  const handleOrderChange = (orderType: EntityQueryStatementOrderType) => {
    onChange({ label: orderType });
  };

  return (
    <Select
      options={orderOptions}
      value={order.label}
      // @ts-ignore
      width="auto"
      onChange={v => v.value && handleOrderChange(v.value)}
    />
  );
};
