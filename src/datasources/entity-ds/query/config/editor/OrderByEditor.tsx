import React from 'react';

import { EntityService } from 'datasources/entity-ds/entity/service/EntityService';
import { OrderConfig, OrderByConfig } from 'datasources/entity-ds/types';

import { OrderByAttributeEditor } from './OrderByAttributeEditor';
import { OrderEditor } from './OrderEditor';

type Props = {
  entityService: EntityService;
  featuredAttributes: boolean;
  orderBy: OrderByConfig;
  onChange: (value: OrderByConfig) => void;
};

export const OrderByEditor: React.FC<Props> = ({ entityService, featuredAttributes, orderBy, onChange }) => {
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
        entityService={entityService}
        featuredAttributes={featuredAttributes}
        onChange={handleAttributeChange}
      />
      <OrderEditor order={order} onChange={handleOrderChange} />
    </>
  );
};
