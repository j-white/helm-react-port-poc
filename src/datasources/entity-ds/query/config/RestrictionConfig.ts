import { RestrictionConfig } from 'datasources/entity-ds/types';

import { isPopulated as isPopulatedComparator } from './ComparatorConfig';

function isPopulatedAttribute(attribute: string): boolean {
  return Boolean(attribute && attribute.trim().length > 0);
}

function isPopulatedValue(value: any): boolean {
  return value !== undefined;
}

export function isPopulated(restriction: RestrictionConfig): boolean {
  return (
    isPopulatedAttribute(restriction.attribute) &&
    isPopulatedComparator(restriction.comparator) &&
    isPopulatedValue(restriction.value)
  );
}
