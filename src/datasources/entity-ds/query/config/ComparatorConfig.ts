import { ComparatorConfig, ComparatorType } from 'datasources/entity-ds/types';

export interface ComparatorOption {
  label: string;
  value: ComparatorType;
}

export const comparatorOptions: ComparatorOption[] = [
  {
    label: '=',
    value: 'EQ',
  },
  {
    label: '!=',
    value: 'NE',
  },
  {
    label: '>=',
    value: 'GE',
  },
  {
    label: '<=',
    value: 'LE',
  },
  {
    label: '>',
    value: 'GT',
  },
  {
    label: '<',
    value: 'LT',
  },
];

const fallbackComparators = ['EQ'];

export const fallbackComparatorOptions = comparatorOptions.filter(option => fallbackComparators.includes(option.value));

const comparators: ComparatorType[] = comparatorOptions.map(option => option.value);

export function isPopulated(comparator: ComparatorConfig): boolean {
  return comparator && comparators.includes(comparator.label);
}
