import React from 'react';
import { css } from 'emotion';

import { Button, Icon, IconName } from '@grafana/ui';

type Props = {
  name: IconName;
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const withTighterPadding = css`
  padding: 8px;
`;

export const EditorRowActionButton: React.FC<Props> = ({ name, title, onClick }) => {
  return (
    <Button className={withTighterPadding} size="xs" title={title} variant="secondary" onClick={onClick}>
      <Icon name={name} />
    </Button>
  );
};
