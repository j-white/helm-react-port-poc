import React, { PureComponent, useState } from 'react';
import { css, cx } from 'emotion';
import uniqueId from 'lodash/uniqueId';

import { PluginConfigPageProps } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Button } from '@grafana/ui';

import { CustomActionSettings } from './CustomActionsSettings';
import { OpenNMSPluginMeta } from '../types';

export interface CustomAction {
  id: string;
  label: string;
  url: string;
}

function updateSettings(pluginId: string, settings: Partial<OpenNMSPluginMeta>): Promise<any> {
  return getBackendSrv().post(`/api/plugins/${pluginId}/settings`, settings);
}

function reload() {
  window.location.href = window.location.href;
}

const withRightMargin = css`
  margin-right: 8px;
`;

const withProgressCursor = css`
  cursor: progress;
  &[disabled],
  &:disabled {
    cursor: progress;
  }
`;

interface Props extends PluginConfigPageProps<OpenNMSPluginMeta> {}

const ConfigTabContent: React.FC<Props> = (props: Props) => {
  const meta: OpenNMSPluginMeta = props.plugin.meta;

  const jsonData = meta.jsonData || {};

  const [loading, setLoading] = useState<boolean>(false);
  const [actions, setActions] = useState<CustomAction[]>(
    jsonData.actions
      ? jsonData.actions.map((action: { label: string; url: string }) => ({ ...action, id: uniqueId() }))
      : []
  );

  const update = async (settings: Partial<OpenNMSPluginMeta>) => {
    try {
      setLoading(true);
      await updateSettings(meta.id, settings);
      reload();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleActionsChange = (actions: CustomAction[]) => {
    setActions(actions);
  };

  const handleDisableClick = () => {
    update({
      enabled: false,
      pinned: false,
    });
  };

  const handleEnableClick = () => {
    update({
      enabled: true,
      pinned: true,
    });
  };

  const handleUpdateClick = () => {
    update({
      enabled: meta.enabled,
      pinned: meta.enabled,
      jsonData: {
        ...jsonData,
        actions: actions.map(({ id, ...remaining }) => ({ ...remaining })),
      },
    });
  };

  const buttonClassName = cx(withRightMargin, loading && withProgressCursor);

  return (
    <div>
      {meta.enabled && <CustomActionSettings actions={actions} onChange={handleActionsChange} />}
      <div className="gf-form">
        {!meta.enabled && (
          <Button variant="primary" className={buttonClassName} disabled={loading} onClick={handleEnableClick}>
            Enable
          </Button>
        )}
        {meta.enabled && (
          <Button variant="primary" className={buttonClassName} disabled={loading} onClick={handleUpdateClick}>
            Update
          </Button>
        )}
        {meta.enabled && (
          <Button variant="destructive" className={buttonClassName} disabled={loading} onClick={handleDisableClick}>
            Disable
          </Button>
        )}
      </div>
    </div>
  );
};

export class ConfigTab extends PureComponent<Props> {
  render() {
    return <ConfigTabContent {...this.props} />;
  }
}
