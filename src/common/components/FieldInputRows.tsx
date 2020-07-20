import React from 'react';
import { css, cx } from 'emotion';

const withBlock = css`
  display: block;
`;

const withFlex = css`
  flex: 1;
`;

const withChildBottomMargins = css`
  > *:not(:last-child) {
    margin-bottom: 4px;
  }
`;

type Props = {};

export const FieldInputRows: React.FC<Props> = ({ children }) => {
  return <div className={cx(withBlock, withFlex, withChildBottomMargins)}>{children}</div>;
};
