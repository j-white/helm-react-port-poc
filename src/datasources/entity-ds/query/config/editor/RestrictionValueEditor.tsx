import React from 'react';
import { css } from 'emotion';

import { Input, Select } from '@grafana/ui';

import { EntityAttributeValueOption } from 'datasources/entity-ds/types';

const withMinWidth = css`
  min-width: 144px;
`;

type Props = {
  disabled?: boolean;
  value: string;
  valueOptions: EntityAttributeValueOption[];
  onChange: (value: string) => void;
};

export const RestrictionValueEditor: React.FC<Props> = ({ disabled, value, valueOptions, onChange }) => {
  const handleValueChange = (value: string) => {
    onChange(value);
  };

  if (valueOptions.length > 0) {
    return (
      <Select
        className={withMinWidth}
        disabled={disabled}
        options={valueOptions}
        value={value}
        // @ts-ignore
        width="auto"
        onChange={v => v.value && handleValueChange(v.value)}
      />
    );
  } else {
    return (
      <Input
        disabled={disabled}
        value={value}
        // @ts-ignore
        width="auto"
        onChange={e => handleValueChange(e.currentTarget.value)}
      />
    );
  }
};
