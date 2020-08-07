import React, { useMemo } from 'react';
import { css } from 'emotion';

import { EntityService } from 'datasources/entity-ds/entity/service/EntityService';
import { ComparatorType } from 'datasources/entity-ds/types';

import { Autocomplete } from './common/Autocomplete';
import { invert } from 'common/Dictionary';

const withMinWidth = css`
  min-width: 56px;
`;

type Props = {
  attribute: string;
  comparatorType: ComparatorType;
  entityService: EntityService;
  disabled?: boolean;
  onChange: (value: ComparatorType) => void;
};

const labelsByComparatorType: Record<ComparatorType, string> = {
  EQ: '=',
  NE: '!=',
  GE: '>=',
  LE: '<=',
  GT: '>',
  LT: '<',
};

const comparatorTypeByLabel = invert(labelsByComparatorType);

function toLabel(comparatorType: ComparatorType): string {
  return labelsByComparatorType[comparatorType] || comparatorType;
}

function fromLabel(value: string): ComparatorType {
  return comparatorTypeByLabel[value] || 'EQ';
}

export const RestrictionComparatorEditor: React.FC<Props> = ({
  attribute,
  comparatorType,
  disabled,
  entityService,
  onChange,
}) => {
  const loadValues = useMemo(() => {
    return async () => {
      const comparatorTypes = await entityService.autocompleteAttributeComparator(attribute);
      return comparatorTypes.map(comparatorType => toLabel(comparatorType));
    };
  }, [attribute]);

  const handleChange = (value: string) => {
    onChange(fromLabel(value));
  };

  return (
    <Autocomplete
      className={withMinWidth}
      disabled={disabled}
      value={toLabel(comparatorType)}
      loadValues={loadValues}
      onChange={handleChange}
    />
  );
};
