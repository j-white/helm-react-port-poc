import React from 'react';

import { EntityService } from 'datasources/entity-ds/entity/service/EntityService';
import { ComparatorType, RestrictionConfig } from 'datasources/entity-ds/types';

import { RestrictionComparatorEditor } from './RestrictionComparatorEditor';
import { RestrictionAttributeEditor } from './RestrictionAttributeEditor';
import { RestrictionValueEditor } from './RestrictionValueEditor';

type Props = {
  entityService: EntityService;
  featuredAttributes: boolean;
  restriction: RestrictionConfig;
  onChange: (value: RestrictionConfig) => void;
};

export const RestrictionEditor: React.FC<Props> = ({ entityService, featuredAttributes, restriction, onChange }) => {
  const { attribute, comparator, value } = restriction;

  const handleAttributeChange = (attribute: string) => {
    onChange({
      attribute,
      comparator: { label: 'EQ' },
      value: '',
    });
  };

  const handleComparatorChange = (comparatorType: ComparatorType) => {
    onChange({
      ...restriction,
      comparator: { label: comparatorType },
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
        entityService={entityService}
        featuredAttributes={featuredAttributes}
        onChange={handleAttributeChange}
      />
      <RestrictionComparatorEditor
        key={`${attribute}-comparator`}
        attribute={attribute}
        comparatorType={comparator.label}
        disabled={!attribute}
        entityService={entityService}
        onChange={handleComparatorChange}
      />
      <RestrictionValueEditor
        key={`${attribute}-value`}
        attribute={attribute}
        disabled={!attribute}
        entityService={entityService}
        value={value}
        onChange={handleValueChange}
      />
    </>
  );
};
