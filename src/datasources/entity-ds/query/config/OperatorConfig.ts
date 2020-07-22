import { OperatorConfig, OperatorType } from 'datasources/entity-ds/types';

export interface OperatorOption {
  label: string;
  value: OperatorType;
}

export const operatorOptions: OperatorOption[] = [
  {
    label: 'AND',
    value: 'AND',
  },
  {
    label: 'OR',
    value: 'OR',
  }
];

const operators: OperatorType[] = operatorOptions.map(option => option.value);

export function isPopulated(operator: OperatorConfig): boolean {
  return operator && operators.includes(operator.label);
}
