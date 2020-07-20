import React from 'react';
import { css } from 'emotion';

import { Button, Icon, InlineFormLabel, Input, LegacyForms, Select, Tooltip } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';

import { createEmptyOrderBy, createDefaultFilter, defaultEntityQuery } from './defaults';

import {
  EntityDataSourceOptions,
  EntityQuery,
  EntityQueryStatementClause,
  EntityType,
  EntityQueryStatementOrderBy,
} from './types';

import { DataSource } from './DataSource';
import { matchById, excludeById } from '../../common/Identifiable';

import { ClausesEditor } from './query/editor/ClausesEditor';
import { FieldInputRows } from '../../common/components/FieldInputRows';
import { FieldInputWithActions } from '../../common/components/FieldInputWithActions';
import { OrderByEditor } from './query/editor/OrderByEditor';

const { Switch } = LegacyForms;

import { alarmAttributeOptions } from './mock/MockAttributeOptions';

interface EntityTypeOption {
  label: string;
  value: EntityType;
}

const entityTypeOptions: EntityTypeOption[] = [
  {
    label: 'Alarms',
    value: 'alarm',
  },
  {
    label: 'Nodes',
    value: 'node',
  },
];

const withWarningColor = css`
  color: rgb(229, 189, 28);
`;

const orderByTooltop = (
  <>
    <p>Note: "ORDER BY" only affects the data as queried from OpenNMS.</p>
    <p>
      Sorting in the table will override this order, but it can be useful to sort at query-time for queries with a
      'Limit' set.
    </p>
  </>
);

const limitTooltip = 'Limit the number of items returned (0=unlimited)';

const limitWarningTooltip = (
  <>
    <b>Note:</b> When using limits, column sorting only applies to the returned results.
  </>
);

const featuredAttributesTooltip = 'Toggles whether featured attributes or all attributes are shown';

type Props = QueryEditorProps<DataSource, EntityQuery, EntityDataSourceOptions>;

const attributeOptions = alarmAttributeOptions;

export const QueryEditor: React.FC<Props> = ({ query, onChange, onRunQuery }) => {
  const {
    featuredAttributes = defaultEntityQuery.featuredAttributes,
    statement = defaultEntityQuery.statement,
  } = query;

  console.log('query:', JSON.stringify(query, null, 2));

  const { entityType, filter = createDefaultFilter() } = statement;
  const { clauses, limit, orderBy } = filter;

  // notifiers

  const notifyEntityTypeChange = (entityType: EntityType) => {
    onChange({ ...query, statement: { ...statement, entityType } });
  };

  const notifyOrderByChange = (orderBy: EntityQueryStatementOrderBy[]) => {
    onChange({
      ...query,
      statement: {
        ...statement,
        filter: {
          ...filter,
          orderBy,
        },
      },
    });
  };

  const notifyFilterClausesChange = (clauses: EntityQueryStatementClause[]) => {
    onChange({
      ...query,
      statement: {
        ...statement,
        filter: {
          ...filter,
          clauses,
        },
      },
    });
  };

  const notifyLimitChange = (limit: number) => {
    onChange({ ...query, statement: { ...statement, filter: { ...filter, limit } } });
  };

  // user gesture handlers

  const handleEntityTypeChange = (entityType: EntityType) => {
    notifyEntityTypeChange(entityType);
    onRunQuery();
  };

  const handleFilterClausesChange = (clauses: EntityQueryStatementClause[]) => {
    notifyFilterClausesChange(clauses);
    onRunQuery();
  };

  const handleLimitChange = (limit: number) => {
    notifyLimitChange(limit);
    onRunQuery();
  };

  const handleOrderByChange = (proposedOrderBy: EntityQueryStatementOrderBy) => {
    const index = orderBy.findIndex(matchById(proposedOrderBy));
    if (index < 0) {
      throw new Error('Clause not found.');
    }
    const updatedOrderBy = Object.assign([...orderBy], {
      [index]: proposedOrderBy,
    });

    notifyOrderByChange(updatedOrderBy);
    onRunQuery();
  };

  const handleOrderByAdd = (afterOrderBy: EntityQueryStatementOrderBy) => {
    const index = orderBy.findIndex(matchById(afterOrderBy)) + 1;
    const updatedOrderBy = [...orderBy.slice(0, index), createEmptyOrderBy(), ...orderBy.slice(index)];

    notifyOrderByChange(updatedOrderBy);
    //onRunQuery();
  };

  const handleOrderByRemove = (orderByToRemove: EntityQueryStatementOrderBy) => {
    const filteredOrderBy = orderBy.filter(excludeById(orderByToRemove));
    const updatedOrderBy = filteredOrderBy.length > 0 ? filteredOrderBy : [createEmptyOrderBy()];

    notifyOrderByChange(updatedOrderBy);
    onRunQuery();
  };

  const handleFeaturedAttributesChange = (featuredAttributes: boolean) => {
    onChange({ ...query, featuredAttributes });
    onRunQuery();
  };

  return (
    <>
      <div className="gf-form-group">
        <div className="gf-form">
          <div className="gf-form-inline">
            <InlineFormLabel className="query-keyword" width={8}>
              SELECT
            </InlineFormLabel>
            <Select
              options={entityTypeOptions}
              value={entityType}
              width={12}
              onChange={v => v.value && handleEntityTypeChange(v.value)}
            />
          </div>
        </div>
        <ClausesEditor clauses={clauses} attributeOptions={attributeOptions} onChange={handleFilterClausesChange} />
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" tooltip={orderByTooltop} width={8}>
            ORDER BY
          </InlineFormLabel>
          <FieldInputRows>
            {orderBy.map(orderBy => (
              <FieldInputWithActions
                actions={
                  <>
                    <Button
                      variant="secondary"
                      size="xs"
                      title="Add attribute"
                      onClick={() => handleOrderByAdd(orderBy)}
                    >
                      <Icon name="plus" />
                    </Button>
                    <Button variant="secondary" size="xs" onClick={() => handleOrderByRemove(orderBy)}>
                      <Icon name="trash-alt" title="Remove attribute" />
                    </Button>
                  </>
                }
              >
                <OrderByEditor
                  key={orderBy.id}
                  attributeOptions={attributeOptions}
                  orderBy={orderBy}
                  onChange={handleOrderByChange}
                />
              </FieldInputWithActions>
            ))}
          </FieldInputRows>
        </div>
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" tooltip={limitTooltip} width={8}>
            LIMIT
          </InlineFormLabel>
          <Input
            min={0}
            step={1}
            type="number"
            value={limit + ''} // https://github.com/facebook/react/issues/9402
            width={8}
            onChange={e => handleLimitChange(Number(e.currentTarget.value))}
          />
          {limit > 0 && (
            <InlineFormLabel width="auto">
              <Tooltip content={limitWarningTooltip}>
                <Icon className={withWarningColor} name="exclamation-triangle" size="lg" />
              </Tooltip>
            </InlineFormLabel>
          )}
        </div>
      </div>
      <div className="gf-form-group">
        <div className="gf-form">
          <Switch
            checked={featuredAttributes}
            label="Featured attributes"
            labelClass="width-11"
            switchClass="max-width-6"
            tooltip={featuredAttributesTooltip}
            onChange={e => handleFeaturedAttributesChange(Boolean(e.currentTarget.checked))}
          />
        </div>
      </div>
    </>
  );
};
