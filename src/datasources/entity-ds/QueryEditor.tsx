import React from 'react';
import { css } from 'emotion';

import { Icon, InlineFormLabel, LegacyForms, Select, Tooltip } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';

import { DataSource, entityTypes } from './DataSource';
import { defaultEntityQuery, EntityDataSourceOptions, EntityQuery } from './types';

const { FormField, Switch } = LegacyForms;

type Props = QueryEditorProps<DataSource, EntityQuery, EntityDataSourceOptions>;

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

const limitTooltip = (
  <>
    <b>Note:</b> When using limits, column sorting only applies to the returned results.
  </>
);

const featuredAttributesTooltip = 'Toggles whether featured attributes or all attributes are shown';

export const QueryEditor: React.FC<Props> = ({ query, onChange, onRunQuery }) => {
  // TOOD: refactor to use Query and reference its entityType and limit
  const {
    entityType = defaultEntityQuery.entityType,
    featuredAttributes = defaultEntityQuery.featuredAttributes,
    limit = defaultEntityQuery.limit,
  } = query;

  const handleEntityTypeChange = (entityType: string) => {
    onChange({ ...query, entityType });
    onRunQuery();
  };

  // TODO: debounce 250ms? (or is this handled in the DataSourceAPI?)
  const handleLimitChange = (limit: number) => {
    onChange({ ...query, limit });
    onRunQuery();
  };

  const handleFeaturedAttributesChange = (featuredAttributes: boolean) => {
    onChange({ ...query, featuredAttributes });
    onRunQuery();
  };

  return (
    <>
      <div className="gf-form-group">
        <div className="gf-form-inline">
          <InlineFormLabel className="query-keyword" width={8}>
            SELECT
          </InlineFormLabel>
          <Select
            options={entityTypes}
            value={entityType}
            width={12}
            onChange={v => v.value && handleEntityTypeChange(v.value)}
          />
        </div>
        <div className="gf-form-inline">
          <InlineFormLabel className="query-keyword" tooltip={orderByTooltop} width={8}>
            ORDER BY
          </InlineFormLabel>
        </div>
      </div>
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Limit"
            labelWidth={8}
            placeholder="Query Limit"
            tooltip="Limit the number of items returned (0=unlimited)"
            type="number"
            value={limit}
            width={4}
            onChange={e => handleLimitChange(Number(e.currentTarget.value))}
          />
          {limit > 0 && (
            <InlineFormLabel width="auto">
              <Tooltip content={limitTooltip}>
                <Icon className={withWarningColor} name="exclamation-triangle" size="lg" />
              </Tooltip>
            </InlineFormLabel>
          )}
        </div>
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
