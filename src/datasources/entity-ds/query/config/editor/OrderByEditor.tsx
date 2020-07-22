import React from 'react';

import { EntityAttributeOption, OrderConfig, OrderByConfig } from 'datasources/entity-ds/types';

import { OrderEditor } from './OrderEditor';
import { OrderByAttributeEditor } from './OrderByAttributeEditor';

type Props = {
  attributeOptions: EntityAttributeOption[];
  orderBy: OrderByConfig;
  onChange: (value: OrderByConfig) => void;
};

export const OrderByEditor: React.FC<Props> = ({ attributeOptions, orderBy, onChange }) => {
  const { attribute, order } = orderBy;

  const handleAttributeChange = (attribute: string) => {
    onChange({
      ...orderBy,
      attribute,
    });
  };

  const handleOrderChange = (order: OrderConfig) => {
    onChange({
      ...orderBy,
      order,
    });
  };

  return (
    <>
      <OrderByAttributeEditor
        attribute={attribute}
        attributeOptions={attributeOptions}
        onChange={handleAttributeChange}
      />
      <OrderEditor order={order} onChange={handleOrderChange} />
    </>
  );
};
