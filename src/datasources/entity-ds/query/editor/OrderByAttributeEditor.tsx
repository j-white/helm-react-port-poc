import React from 'react';
import { css } from 'emotion';

import { Select } from '@grafana/ui';

import { EntityAttributeOption } from '../../types';

const withMinWidth = css`
  min-width: 144px;
`;

type Props = {
  attribute: string;
  attributeOptions: EntityAttributeOption[];
  onChange: (value: string) => void;
};

export const OrderByAttributeEditor: React.FC<Props> = ({ attribute, attributeOptions, onChange }) => {
  const handleAttributeChange = (attribute: string) => {
    onChange(attribute);
  };

  return (
    <Select
      className={withMinWidth}
      menuPosition="fixed"
      options={attributeOptions}
      placeholder="Select attribute..."
      value={attribute}
      // @ts-ignore
      width="auto"
      onChange={v => v.value && handleAttributeChange(v.value)}
    />
  );
};
