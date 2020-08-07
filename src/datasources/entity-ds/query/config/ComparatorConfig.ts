import { ComparatorConfig, ComparatorType } from 'datasources/entity-ds/types';

export const comparators: ComparatorType[] = ['EQ', 'NE', 'GE', 'LE', 'GT', 'LT'];

export const fallbackComparators: ComparatorType[] = ['EQ'];

export function isPopulated(comparator: ComparatorConfig): boolean {
  return comparator && comparators.includes(comparator.label);
}
