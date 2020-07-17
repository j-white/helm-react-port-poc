import React from 'react';

import { Select } from '@grafana/ui';

import { EntityQueryStatementComparator, EntityQueryStatementComparatorType } from '../../types';

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
  onChange: (value: EntityQueryStatementComparator) => void;
};

export const ComparatorEditor: React.FC<Props> = ({ comparator, onChange }) => {
  const handleComparatorChange = (comparatorType: EntityQueryStatementComparatorType) => {
    onChange({ label: comparatorType });
  };

  return (
    <Select
      options={comparatorOptions}
      value={comparator.label}
      width={8}
      onChange={v => v.value && handleComparatorChange(v.value)}
    />
  );
};
