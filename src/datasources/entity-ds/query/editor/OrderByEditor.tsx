import React from 'react';

import {
  EntityAttributeOption,
  EntityQueryStatementOrder,
  EntityQueryStatementOrderBy,
} from 'datasources/entity-ds/types';

import { OrderByOrderEditor } from './OrderByOrderEditor';
import { OrderByAttributeEditor } from './OrderByAttributeEditor';

type Props = {
  attributeOptions: EntityAttributeOption[];
  orderBy: EntityQueryStatementOrderBy;
  onChange: (value: EntityQueryStatementOrderBy) => void;
};

export const OrderByEditor: React.FC<Props> = ({ attributeOptions, orderBy, onChange }) => {
  const { attribute, order } = orderBy;

  const handleAttributeChange = (attribute: string) => {
    onChange({
      ...orderBy,
      attribute,
    });
  };

  const handleOrderChange = (order: EntityQueryStatementOrder) => {
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
      <OrderByOrderEditor order={order} onChange={handleOrderChange} />
    </>
  );
};
