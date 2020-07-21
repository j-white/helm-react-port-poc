import React from 'react';
import { css } from 'emotion';

import { Icon, InlineFormLabel, Input, Tooltip } from '@grafana/ui';

import { EditorHBox } from 'common/components/EditorHBox';
import { EditorRow } from 'common/components/EditorRow';

const withWarningColor = css`
  color: rgb(229, 189, 28);
`;

const limitTooltip = 'Limit the number of items returned (0=unlimited)';

const limitWarningTooltip = (
  <>
    <b>Note:</b> When using limits, column sorting only applies to the returned results.
  </>
);

type Props = {
  limit: number;
  onChange: (limit: number) => void;
};

export const LimitEditor: React.FC<Props> = ({ limit, onChange }) => {
  return (
    <EditorRow
      label={
        <InlineFormLabel className="query-keyword" tooltip={limitTooltip} width={8}>
          LIMIT
        </InlineFormLabel>
      }
    >
      <EditorHBox>
        <Input
          min={0}
          step={1}
          type="number"
          value={limit + ''} // https://github.com/facebook/react/issues/9402
          width={8}
          onChange={e => onChange(Number(e.currentTarget.value))}
        />
        {limit > 0 && (
          <InlineFormLabel width="auto">
            <Tooltip content={limitWarningTooltip}>
              <Icon className={withWarningColor} name="exclamation-triangle" size="lg" />
            </Tooltip>
          </InlineFormLabel>
        )}
      </EditorHBox>
    </EditorRow>
  );
};
