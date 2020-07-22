import React from 'react';

import { Input } from '@grafana/ui';

type Props = {
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export const RestrictionValueEditor: React.FC<Props> = ({ disabled, value, onChange }) => {
  const handleValueChange = (value: string) => {
    onChange(value);
  };

  return (
    <Input
      disabled={disabled}
      value={value}
      // @ts-ignore
      width="auto"
      onChange={e => handleValueChange(e.currentTarget.value)}
    />
  );
};
