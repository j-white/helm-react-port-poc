import React from 'react';
import { css } from 'emotion';
import uniqueId from 'lodash/uniqueId';

import { Button, Icon, LegacyForms, Tooltip } from '@grafana/ui';

const { FormField } = LegacyForms;

export interface CustomAction {
  id: string;
  label: string;
  url: string;
}

const withRightMargin = css`
  margin-right: 8px;
`;

const withRowLayout = css`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  > * {
    margin-left: 4px;
    margin-bottom: 0;
    height: 100%;
    &:first-child,
    &:last-child {
      margin-left: 0;
    }
  }
`;

interface CustomActionRowProps {
  action: CustomAction;
  onChange: (proposed: CustomAction) => void;
  onRemove: (id: string) => void;
}

const CustomActionRow: React.FC<CustomActionRowProps> = ({ action, onChange, onRemove }) => {
  return (
    <>
      <div className={withRowLayout}>
        <FormField
          label="Label"
          labelWidth={5}
          inputWidth={12}
          value={action.label}
          onChange={e => onChange({ ...action, label: (e.target as HTMLInputElement).value })}
        />
        <FormField
          label="URL"
          labelWidth={5}
          inputWidth={12}
          placeholder="https://"
          value={action.url}
          onChange={e => onChange({ ...action, label: (e.target as HTMLInputElement).value })}
        />
        <Button variant="secondary" size="xs" onClick={() => onRemove(action.id)}>
          <Icon name="trash-alt" />
        </Button>
      </div>
    </>
  );
};

interface Props {
  actions: CustomAction[];
  onChange: (actions: CustomAction[]) => void;
}

export const CustomActionSettings: React.FC<Props> = ({ actions, onChange }) => {
  const handleAdd = () => {
    onChange([...actions, { id: uniqueId(), label: '', url: '' }]);
  };

  const handleChange = (proposed: CustomAction) => {
    onChange(actions.map(action => (action.id === proposed.id ? proposed : action)));
  };

  const handleRemove = (id: string) => {
    onChange(actions.filter(action => action.id !== id));
  };

  return (
    <div className="gf-form-group">
      <div className="gf-form">
        <h6>
          <span className={withRightMargin}>Custom Actions</span>
          <Tooltip content="These links will appear in the context menu when you right-click on an alarm.">
            <Icon name="info-circle" />
          </Tooltip>
        </h6>
      </div>
      {actions.map(action => (
        <CustomActionRow key={action.id} action={action} onChange={handleChange} onRemove={handleRemove} />
      ))}
      <div className="gf-form">
        <Button variant="secondary" icon="plus" onClick={handleAdd}>
          Add action
        </Button>
      </div>
    </div>
  );
};
