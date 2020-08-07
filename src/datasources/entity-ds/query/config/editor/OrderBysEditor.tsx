import React from 'react';

import { InlineFormLabel } from '@grafana/ui';

import { excludeById, matchById } from 'common/Identifiable';

import { createEmptyOrderBy } from 'datasources/entity-ds/defaults';
import { EntityService } from 'datasources/entity-ds/entity/service/EntityService';
import { OrderByConfig } from 'datasources/entity-ds/types';

import { EditorHBox } from './common/EditorHBox';
import { EditorRow } from './common/EditorRow';
import { EditorRowActionButton } from './common/EditorRowActionButton';

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
  entityService: EntityService;
  featuredAttributes: boolean;
  orderBys: OrderByConfig[];
  onChange: (orderBys: OrderByConfig[]) => void;
};

export const OrderBysEditor: React.FC<Props> = ({ entityService, featuredAttributes, orderBys, onChange }) => {
  const handleOrderByChange = (proposedOrderBy: OrderByConfig) => {
    const index = orderBys.findIndex(matchById(proposedOrderBy));
    if (index < 0) {
      throw new Error('Order by not found.');
    }
    const updatedOrderBy = Object.assign([...orderBys], {
      [index]: proposedOrderBy,
    });

    onChange(updatedOrderBy);
  };

  const handleOrderByAdd = (afterOrderBy: OrderByConfig) => {
    const index = orderBys.findIndex(matchById(afterOrderBy)) + 1;
    const updatedOrderBy = [...orderBys.slice(0, index), createEmptyOrderBy(), ...orderBys.slice(index)];

    onChange(updatedOrderBy);
  };

  const handleOrderByRemove = (orderByToRemove: OrderByConfig) => {
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
              <EditorRowActionButton
                name="plus"
                title="Add attribute"
                onClick={e => {
                  e.currentTarget.blur();
                  handleOrderByAdd(orderBy);
                }}
              />
              <EditorRowActionButton
                name={orderBys.length > 1 ? 'trash-alt' : 'times'}
                title={orderBys.length > 1 ? 'Remove attribute' : 'Clear attribute'}
                onClick={e => {
                  e.currentTarget.blur();
                  handleOrderByRemove(orderBy);
                }}
              />
            </EditorHBox>
          }
        >
          <EditorHBox>
            <OrderByEditor
              key={orderBy.id}
              entityService={entityService}
              featuredAttributes={featuredAttributes}
              orderBy={orderBy}
              onChange={handleOrderByChange}
            />
          </EditorHBox>
        </EditorRow>
      ))}
    </EditorRow>
  );
};
