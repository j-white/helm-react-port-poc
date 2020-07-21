import React from 'react';

import { InlineFormLabel } from '@grafana/ui';


import { excludeById, matchById } from 'common/Identifiable';
import { EditorHBox } from 'common/components/EditorHBox';
import { EditorRow } from 'common/components/EditorRow';
import { EditorRowActionButton } from 'common/components/EditorRowActionButton';

import { createEmptyOrderBy } from 'datasources/entity-ds/defaults';

import { EntityAttributeOption, EntityQueryStatementOrderBy } from 'datasources/entity-ds/types';

import { OrderByEditor } from './OrderByEditor';

const orderByTooltop = (
  <>
    <p>Note: "ORDER BY" only affects the data as queried from OpenNMS.</p>
    <p>
      Sorting in the table will override this order, but it can be useful to sort at query-time for queries with a
      'Limit' set.
    </p>
  </>
);

type Props = {
  attributeOptions: EntityAttributeOption[];
  orderBys: EntityQueryStatementOrderBy[];
  onChange: (orderBys: EntityQueryStatementOrderBy[]) => void;
};

export const OrderBysEditor: React.FC<Props> = ({ attributeOptions, orderBys, onChange }) => {
  const handleOrderByChange = (proposedOrderBy: EntityQueryStatementOrderBy) => {
    const index = orderBys.findIndex(matchById(proposedOrderBy));
    if (index < 0) {
      throw new Error('Order by not found.');
    }
    const updatedOrderBy = Object.assign([...orderBys], {
      [index]: proposedOrderBy,
    });

    onChange(updatedOrderBy);
  };

  const handleOrderByAdd = (afterOrderBy: EntityQueryStatementOrderBy) => {
    const index = orderBys.findIndex(matchById(afterOrderBy)) + 1;
    const updatedOrderBy = [...orderBys.slice(0, index), createEmptyOrderBy(), ...orderBys.slice(index)];

    onChange(updatedOrderBy);
  };

  const handleOrderByRemove = (orderByToRemove: EntityQueryStatementOrderBy) => {
    const filteredOrderBy = orderBys.filter(excludeById(orderByToRemove));
    const updatedOrderBy = filteredOrderBy.length > 0 ? filteredOrderBy : [createEmptyOrderBy()];

    onChange(updatedOrderBy);
  };

  return (
    <EditorRow
      label={
        <InlineFormLabel className="query-keyword" tooltip={orderByTooltop} width={8}>
          ORDER BY
        </InlineFormLabel>
      }
    >
      {orderBys.map(orderBy => (
        <EditorRow
          actions={
            <EditorHBox>
              <EditorRowActionButton name="plus" title="Add attribute" onClick={() => handleOrderByAdd(orderBy)} />
              <EditorRowActionButton
                name="trash-alt"
                title="Remove attribute"
                onClick={() => handleOrderByRemove(orderBy)}
              />
            </EditorHBox>
          }
        >
          <EditorHBox>
            <OrderByEditor
              key={orderBy.id}
              attributeOptions={attributeOptions}
              orderBy={orderBy}
              onChange={handleOrderByChange}
            />
          </EditorHBox>
        </EditorRow>
      ))}
    </EditorRow>
  );
};
