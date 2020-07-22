import React from 'react';
import { css, cx } from 'emotion';

import { Icon, InlineFormLabel, Select } from '@grafana/ui';

import { OperatorConfig, OperatorType } from 'datasources/entity-ds/types';

import { operatorOptions } from '../OperatorConfig';

const withBorder = css`
  border-style: solid;
  border-width: 2px;
`;

type Props = {
  operator: OperatorConfig;
  onChange: (value: OperatorConfig) => void;
};

export const OperatorEditor: React.FC<Props> = ({ operator, onChange }) => {
  const handleOperatorChange = (operatorType: OperatorType) => {
    onChange({ label: operatorType });
  };

  return (
    <Select
      options={operatorOptions}
      value={operator.label}
      // @ts-ignore
      width="auto"
      onChange={v => v.value && handleOperatorChange(v.value)}
      renderControl={React.forwardRef(({ isOpen, value, ...otherProps }, ref) => {
        return (
          <div {...otherProps} ref={ref}>
            <InlineFormLabel className={cx('query-keyword', isOpen && withBorder)} width={8}>
              {value?.label}
              <Icon name={isOpen ? 'angle-up' : 'angle-down'} size="sm" style={{ marginLeft: '10px' }} />
            </InlineFormLabel>
          </div>
        );
      })}
    />
  );
};
