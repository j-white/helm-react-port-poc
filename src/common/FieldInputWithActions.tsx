import React from 'react';
import { css, cx } from 'emotion';

const withChildRightMargins = css`
  > *:not(:last-child) {
    margin-right: 4px;
  }
`;

const withFlex = css`
  flex: 1;
`;

type Props = {
  actions: React.ReactNode;
};

export const FieldInputWithActions: React.FC<Props> = ({ children, actions }) => {
  return (
    <div className={cx('gf-form-inline', withChildRightMargins, withFlex)}>
      <div className={cx('gf-form-inline', withChildRightMargins, withFlex)}>{children}</div>
      <div className="gf-form-inline">{actions}</div>
    </div>
  );
};
