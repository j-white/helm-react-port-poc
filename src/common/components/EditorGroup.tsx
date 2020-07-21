import React from 'react';
import { css } from 'emotion';

const withBottomMargin = css`
  margin-bottom: 40px;
`;

type Props = {};

export const EditorGroup: React.FC<Props> = ({ children }) => {
  return <div className={withBottomMargin}>{children}</div>;
};
