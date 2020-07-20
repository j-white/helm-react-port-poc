import React from 'react';
import { css, cx } from 'emotion';

import { Icon, InlineFormLabel, Select } from '@grafana/ui';

import { EntityQueryStatementOrder, EntityQueryStatementOrderType } from '../../types';

interface OrderOptions {
  label: string;
  value: EntityQueryStatementOrderType;
}

const orderOptions: OrderOptions[] = [
  {
    label: 'ASC',
    value: 'ASC',
  },
  {
    label: 'DESC',
    value: 'DESC',
  },
];

const withBorder = css`
  border-style: solid;
  border-width: 2px;
`;

type Props = {
  order: EntityQueryStatementOrder;
  onChange: (value: EntityQueryStatementOrder) => void;
};

export const OrderByOrderEditor: React.FC<Props> = ({ order, onChange }) => {
  const handleOrderChange = (orderType: EntityQueryStatementOrderType) => {
    onChange({ label: orderType });
  };

  return (
    <Select
      options={orderOptions}
      value={order.label}
      // @ts-ignore
      width="auto"
      onChange={v => v.value && handleOrderChange(v.value)}
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
