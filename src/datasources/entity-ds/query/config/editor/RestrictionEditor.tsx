import React from 'react';

import { EntityAttributeOption, ComparatorConfig, RestrictionConfig } from 'datasources/entity-ds/types';

import { ComparatorEditor } from './ComparatorEditor';
import { RestrictionAttributeEditor } from './RestrictionAttributeEditor';
import { RestrictionValueEditor } from './RestrictionValueEditor';

type Props = {
  attributeOptions: EntityAttributeOption[];
  restriction: RestrictionConfig;
  onChange: (value: RestrictionConfig) => void;
};

export const RestrictionEditor: React.FC<Props> = ({ attributeOptions, restriction, onChange }) => {
  const { attribute, comparator, value } = restriction;

  const handleAttributeChange = (attribute: string) => {
    onChange({
      attribute,
      comparator: { label: 'EQ' },
      value: '',
    });
  };

  const handleComparatorChange = (comparator: ComparatorConfig) => {
    onChange({
      ...restriction,
      comparator,
    });
  };

  const handleValueChange = (value: string) => {
    onChange({
      ...restriction,
      value,
    });
  };

  return (
    <>
      <RestrictionAttributeEditor
        attribute={attribute}
        attributeOptions={attributeOptions}
        onChange={handleAttributeChange}
      />
      <ComparatorEditor comparator={comparator} disabled={!attribute} onChange={handleComparatorChange} />
      <RestrictionValueEditor value={value} disabled={!attribute} onChange={handleValueChange} />
    </>
  );
};
