import React from 'react';
import { css } from 'emotion';

const withRow = css`
  display: flex;
  align-items: flex-start
  align-content: flex-start;
  flex-wrap: wrap;
`;

const withSizeToFit = css`
  flex: 1;
`;

type Props = {
  label?: React.ReactNode;
  actions?: React.ReactNode;
};

export const EditorRow: React.FC<Props> = ({ actions, children, label }) => {
  return (
    <div className={withRow}>
      {label && <div>{label}</div>}
      <div className={withSizeToFit}>{children}</div>
      {actions && <div>{actions}</div>}
    </div>
  );
};
