import React, { useMemo } from 'react';

import { SearchPropertyType } from 'opennms-js-ts';

import { ComparatorConfig, EntityAttributeOption, RestrictionConfig } from 'datasources/entity-ds/types';

import { ComparatorEditor } from './ComparatorEditor';
import { RestrictionAttributeEditor } from './RestrictionAttributeEditor';
import { RestrictionValueEditor } from './RestrictionValueEditor';

import { comparatorOptions, fallbackComparatorOptions } from '../ComparatorConfig';

type Props = {
  attributeOptions: EntityAttributeOption[];
  restriction: RestrictionConfig;
  onChange: (value: RestrictionConfig) => void;
};

export const RestrictionEditor: React.FC<Props> = ({ attributeOptions, restriction, onChange }) => {
  const { attribute, comparator, value } = restriction;

  const attributeOption = useMemo(() => {
    return attributeOptions.find(attributeOption => attributeOption.value === attribute);
  }, [attribute]);

  const attributeValueOptions = useMemo(() => {
    if (attributeOption && attributeOption.values) {
      const namesById = attributeOption.values;
      return Object.keys(namesById).map(id => {
        const name = namesById[id];
        return {
          label: name,
          value: name,
        };
      });
    } else {
      return [];
    }
  }, [attributeOption]);

  const attributeComparatorOptions = useMemo(() => {
    if (attributeOption && attributeOption.type) {
      const propertyType = SearchPropertyType.forId(attributeOption.type) as SearchPropertyType | undefined;
      if (propertyType) {
        // NOTE: Comparator::label corresponds to ComparatorOption::value
        const comparatorValues = propertyType.getComparators().map(comparator => comparator.label);
        return comparatorOptions.filter(comparatorOption => comparatorValues.includes(comparatorOption.value));
      }
    }
    return fallbackComparatorOptions;
  }, [attributeOption]);

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
      <ComparatorEditor
        comparator={comparator}
        comparatorOptions={attributeComparatorOptions}
        disabled={!attribute}
        onChange={handleComparatorChange}
      />
      <RestrictionValueEditor
        // NOTE: Grafana's select renders a stale label when options change and value is reset to "".
        // Workaround: use "key" to force this component to be recreated when "attribute" changes.
        key={attribute}
        disabled={!attribute}
        value={value}
        valueOptions={attributeValueOptions}
        onChange={handleValueChange}
      />
    </>
  );
};
