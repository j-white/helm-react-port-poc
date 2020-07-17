import React from 'react';

import { Input } from '@grafana/ui';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const RestrictionValueEditor: React.FC<Props> = ({ value, onChange }) => {
  const handleValueChange = (value: string) => {
    onChange(value);
  };

  return (
    <Input
      value={value}
      // @ts-ignore
      width="auto"
      onChange={e => handleValueChange(e.currentTarget.value)}
    />
  );
};
