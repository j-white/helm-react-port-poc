import React from 'react';
import { css, cx } from 'emotion';

import { Button, ButtonProps, Icon, IconName } from '@grafana/ui';

const withHoverColor = css`
  &:hover {
    color: rgb(51, 162, 229);
  }
`;

const withTighterPadding = css`
  padding: 8px;
`;

type EditorRowActionButtonProps = {
  name: IconName;
  title: string;
};

type Props = EditorRowActionButtonProps & ButtonProps;

export const EditorRowActionButton: React.FC<Props> = ({ name, title, ...rest }) => {
  return (
    <Button className={cx(withHoverColor, withTighterPadding)} size="xs" title={title} variant="secondary" {...rest}>
      <Icon name={name} />
    </Button>
  );
};
