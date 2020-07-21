import React from 'react';

import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DataSourceHttpSettings, InlineFormLabel, LegacyForms, Select } from '@grafana/ui';

import { MiscHttpSettings } from 'common/components/MiscHttpSettings';

import { defaultEntityDataSourceOptions } from './defaults';
import { EntityDataSourceOptions } from './types';

const { Switch } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<EntityDataSourceOptions> {}

const useGrafanaUserTooltip = (
  <>
    <p>
      Used to control whether operations on alarms are performed by the data source user, or the user that is currently
      logged in to Grafana.
    </p>
    <p>
      Supported operations are escalating, clearing, un-/acknowledging alarms as well as creating/updating a
      journal/memo.
    </p>
    <p>
      NOTE: The data source must be configured using an user with the 'admin' role in order to perform actions as other
      users.
    </p>
  </>
);

const useGrafanaUserFieldTooltip = (
  <>
    <p>
      Defines which field of the Grafana User should be used. This allows for fine grained control over the value
      displayed as the "Action-Performing User" in OpenNMS.
    </p>
    <p>
      Examples:
      <ul>
        <li>- login: ulf</li>
        <li>- name: Ulf Blaskowitz</li>
        <li>- email: ulf@opennms.org</li>
      </ul>
    </p>
    <p>Default: login</p>
  </>
);

const useGrafanaUserFieldOptions = [
  { label: 'login', value: 'login' },
  { label: 'name', value: 'name' },
  { label: 'email', value: 'email' },
];

export const ConfigEditor: React.FC<Props> = ({ options, onOptionsChange }) => {
  const {
    timeout,
    grafanaUserField = defaultEntityDataSourceOptions.grafanaUserField,
    useGrafanaUser = defaultEntityDataSourceOptions.useGrafanaUser,
  } = options.jsonData;

  const handleTimeoutChange = (timeout?: number) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        timeout,
      },
    });
  };

  const handleUseGrafanaUserChange = (useGrafanaUser: boolean) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        useGrafanaUser,
      },
    });
  };

  const handleGrafanaUserField = (grafanaUserField: string) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        grafanaUserField,
      },
    });
  };

  return (
    <div className="gf-form-group">
      <DataSourceHttpSettings
        defaultUrl="https://"
        dataSourceConfig={options}
        showAccessOptions={true}
        onChange={onOptionsChange}
      />
      <MiscHttpSettings timeout={timeout} onChange={handleTimeoutChange} />
      <h3 className="page-heading">OpenNMS Entity Datasource Details</h3>
      <div className="gf-form-group">
        <div className="gf-form-inline">
          <Switch
            checked={useGrafanaUser}
            label="Use Grafana user"
            labelClass="width-11"
            switchClass="max-width-6"
            // @ts-ignore
            tooltip={useGrafanaUserTooltip}
            onChange={e => handleUseGrafanaUserChange(Boolean(e.currentTarget.checked))}
          />
          {useGrafanaUser && (
            <div className="gf-form">
              <InlineFormLabel tooltip={useGrafanaUserFieldTooltip} width={4}>
                Field
              </InlineFormLabel>
              <Select
                options={useGrafanaUserFieldOptions}
                value={grafanaUserField}
                onChange={v => v.value && handleGrafanaUserField(v.value)}
                width={12}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
