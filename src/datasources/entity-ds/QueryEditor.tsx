import React from 'react';

import { QueryEditorProps } from '@grafana/data';
import { LegacyForms } from '@grafana/ui';

import { EditorGroup } from 'common/components/EditorGroup';

import { createDefaultFilter, defaultEntityQuery } from './defaults';
import {
  EntityDataSourceOptions,
  EntityQuery,
  EntityQueryStatementClause,
  EntityQueryStatementOrderBy,
  EntityType,
} from './types';

import { DataSource } from './DataSource';

import { alarmAttributeOptions } from './mock/MockAttributeOptions';

import { ClausesEditor } from './query/editor/ClausesEditor';
import { EntityTypeEditor } from './query/editor/EntityTypeEditor';
import { LimitEditor } from './query/editor/LimitEditor';
import { OrderBysEditor } from './query/editor/OrderBysEditor';

const { Switch } = LegacyForms;

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

  const handleEntityTypeChange = (entityType: EntityType) => {
    onChange({ ...query, statement: { ...statement, entityType } });
    onRunQuery();
  };

  const handleClausesChange = (clauses: EntityQueryStatementClause[]) => {
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
    onRunQuery();
  };

  const handleOrderBysChange = (orderBy: EntityQueryStatementOrderBy[]) => {
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
    onRunQuery();
  };

  const handleLimitChange = (limit: number) => {
    onChange({ ...query, statement: { ...statement, filter: { ...filter, limit } } });
    onRunQuery();
  };

  const handleFeaturedAttributesChange = (featuredAttributes: boolean) => {
    onChange({ ...query, featuredAttributes });
    // onRunQuery();
  };

  return (
    <>
      <EditorGroup>
        <EntityTypeEditor entityType={entityType} onChange={handleEntityTypeChange} />
        <ClausesEditor attributeOptions={attributeOptions} clauses={clauses} depth={0} onChange={handleClausesChange} />
        <OrderBysEditor attributeOptions={attributeOptions} orderBys={orderBy} onChange={handleOrderBysChange} />
        <LimitEditor limit={limit} onChange={handleLimitChange} />
      </EditorGroup>
      <EditorGroup>
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
      </EditorGroup>
    </>
  );
};
