import React, { useMemo } from 'react';

import { QueryEditorProps } from '@grafana/data';
import { LegacyForms } from '@grafana/ui';

import { EditorGroup } from 'datasources/entity-ds/query/config/editor/common/EditorGroup';

import { createDefaultFilter, defaultEntityQuery } from './defaults';
import { ClauseConfig, EntityDataSourceOptions, EntityQuery, EntityType, OrderByConfig } from './types';

import { DataSource } from './DataSource';

import { ClausesEditor } from './query/config/editor/ClausesEditor';
import { EntityTypeEditor } from './query/config/editor/EntityTypeEditor';
import { LimitEditor } from './query/config/editor/LimitEditor';
import { OrderBysEditor } from './query/config/editor/OrderBysEditor';

const { Switch } = LegacyForms;

const featuredAttributesTooltip = 'Toggles whether featured attributes or all attributes are shown';

type Props = QueryEditorProps<DataSource, EntityQuery, EntityDataSourceOptions>;

export const QueryEditor: React.FC<Props> = ({ datasource, query, onChange, onRunQuery }) => {
  const {
    featuredAttributes = defaultEntityQuery.featuredAttributes,
    statement = defaultEntityQuery.statement,
  } = query;

  // console.log('query (raw config):', JSON.stringify(query, null, 2));

  const { entityType, filter = createDefaultFilter() } = statement;
  const { clauses, limit, orderBy } = filter;

  const entityService = useMemo(() => datasource.getEntityService(entityType), [datasource, entityType]);

  const handleEntityTypeChange = (entityType: EntityType) => {
    onChange({ ...query, statement: { ...defaultEntityQuery.statement, entityType } });
    onRunQuery();
  };

  const handleClausesChange = (clauses: ClauseConfig[]) => {
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

  const handleOrderBysChange = (orderBy: OrderByConfig[]) => {
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
        <ClausesEditor
          clauses={clauses}
          depth={0}
          entityService={entityService}
          featuredAttributes={featuredAttributes}
          onChange={handleClausesChange}
        />
        <OrderBysEditor
          entityService={entityService}
          featuredAttributes={featuredAttributes}
          orderBys={orderBy}
          onChange={handleOrderBysChange}
        />
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
