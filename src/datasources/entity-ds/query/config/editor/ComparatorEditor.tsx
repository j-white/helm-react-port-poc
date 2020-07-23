import React from 'react';

import { Select } from '@grafana/ui';

import { ComparatorConfig, ComparatorType } from 'datasources/entity-ds/types';

import { ComparatorOption } from '../ComparatorConfig';

type Props = {
  comparator: ComparatorConfig;
  comparatorOptions: ComparatorOption[];
  disabled?: boolean;
  onChange: (value: ComparatorConfig) => void;
};

export const ComparatorEditor: React.FC<Props> = ({ comparator, comparatorOptions, disabled, onChange }) => {
  const handleComparatorChange = (comparatorType: ComparatorType) => {
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
