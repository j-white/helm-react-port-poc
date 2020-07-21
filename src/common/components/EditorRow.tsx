import React from 'react';
import { css } from 'emotion';

const withRow = css`
  align-content: flex-start;
  align-items: flex-start;
  display: flex;
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
