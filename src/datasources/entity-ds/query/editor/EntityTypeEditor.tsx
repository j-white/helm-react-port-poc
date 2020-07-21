import React from 'react';

import { InlineFormLabel, Select } from '@grafana/ui';

import { EditorHBox } from 'common/components/EditorHBox';
import { EditorRow } from 'common/components/EditorRow';

import { EntityType } from 'datasources/entity-ds/types';

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

type Props = {
  entityType: EntityType;
  onChange: (entityType: EntityType) => void;
};

export const EntityTypeEditor: React.FC<Props> = ({ entityType, onChange }) => {
  return (
    <EditorRow
      label={
        <InlineFormLabel className="query-keyword" width={8}>
          SELECT
        </InlineFormLabel>
      }
    >
      <EditorHBox>
        <Select
          options={entityTypeOptions}
          value={entityType}
          width={12}
          onChange={v => v.value && onChange(v.value)}
        />
      </EditorHBox>
    </EditorRow>
  );
};
