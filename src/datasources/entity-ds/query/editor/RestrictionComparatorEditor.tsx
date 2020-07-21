import React from 'react';

import { Select } from '@grafana/ui';

import { EntityQueryStatementComparator, EntityQueryStatementComparatorType } from 'datasources/entity-ds/types';

interface ComparatorOption {
  label: string;
  value: EntityQueryStatementComparatorType;
}

const comparatorOptions: ComparatorOption[] = [
  {
    label: '=',
    value: 'EQ',
  },
  {
    label: '!=',
    value: 'NE',
  },
  {
    label: '>=',
    value: 'GE',
  },
  {
    label: '<=',
    value: 'LE',
  },
  {
    label: '>',
    value: 'GT',
  },
  {
    label: '<',
    value: 'LT',
  },
];

type Props = {
  comparator: EntityQueryStatementComparator;
  disabled?: boolean;
  onChange: (value: EntityQueryStatementComparator) => void;
};

export const RestrictionComparatorEditor: React.FC<Props> = ({ comparator, disabled, onChange }) => {
  const handleComparatorChange = (comparatorType: EntityQueryStatementComparatorType) => {
    onChange({ label: comparatorType });
  };

  return (
    <Select
      disabled={disabled}
      options={comparatorOptions}
      value={comparator.label}
      width={8}
      onChange={v => v.value && handleComparatorChange(v.value)}
    />
  );
};
