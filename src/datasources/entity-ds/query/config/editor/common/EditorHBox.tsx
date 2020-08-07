import React from 'react';
import { css, cx } from 'emotion';

const withFlexLayout = css`
  display: flex;
  flex-direction: row;
`;

const withChildMargins = css`
  > * {
    margin: 0 4px 4px 0;
  }
`;

type Props = {};

export const EditorHBox: React.FC<Props> = ({ children }) => {
  return <div className={cx(withFlexLayout, withChildMargins)}>{children}</div>;
};
