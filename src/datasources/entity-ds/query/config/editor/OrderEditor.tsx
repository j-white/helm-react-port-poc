import React from 'react';

import { Select } from '@grafana/ui';

import { OrderConfig, OrderType } from 'datasources/entity-ds/types';

import { orderOptions } from '../OrderConfig';

type Props = {
  order: OrderConfig;
  onChange: (value: OrderConfig) => void;
};

export const OrderEditor: React.FC<Props> = ({ order, onChange }) => {
  const handleOrderChange = (orderType: OrderType) => {
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
