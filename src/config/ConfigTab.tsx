import React, { PureComponent, useState } from 'react';
import { css, cx } from 'emotion';

import { PluginConfigPageProps } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Button } from '@grafana/ui';

import { defaultOpenNMSAppConfig } from 'defaults';

import { OpenNMSCustomAction, OpenNMSPluginMeta } from 'types';

import { CustomActionSettings } from './CustomActionsSettings';

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

const ConfigTabContent: React.FC<Props> = ({ plugin }) => {
  const meta = plugin.meta;

  const jsonData = meta.jsonData || defaultOpenNMSAppConfig;

  const [loading, setLoading] = useState<boolean>(false);
  const [actions, setActions] = useState<OpenNMSCustomAction[]>(jsonData.actions);

  const update = async (settings: Partial<OpenNMSPluginMeta>) => {
    try {
      setLoading(true);
      await updateSettings(meta.id, settings);
      reload();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleActionsChange = (actions: OpenNMSCustomAction[]) => {
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
        actions,
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
