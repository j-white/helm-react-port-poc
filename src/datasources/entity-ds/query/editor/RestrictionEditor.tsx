import React from 'react';

import {
  EntityAttributeOption,
  EntityQueryStatementComparator,
  EntityQueryStatementRestriction,
} from 'datasources/entity-ds/types';

import { RestrictionAttributeEditor } from './RestrictionAttributeEditor';
import { ComparatorEditor } from './ComparatorEditor';
import { RestrictionValueEditor } from './RestrictionValueEditor';

type Props = {
  attributeOptions: EntityAttributeOption[];
  restriction: EntityQueryStatementRestriction;
  onChange: (value: EntityQueryStatementRestriction) => void;
};

export const RestrictionEditor: React.FC<Props> = ({ attributeOptions, restriction, onChange }) => {
  const { attribute, comparator, value } = restriction;

  const handleAttributeChange = (attribute: string) => {
    onChange({
      ...restriction,
      attribute,
    });
  };

  const handleComparatorChange = (comparator: EntityQueryStatementComparator) => {
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
      <ComparatorEditor comparator={comparator} onChange={handleComparatorChange} />
      <RestrictionValueEditor value={value} onChange={handleValueChange} />
    </>
  );
};
