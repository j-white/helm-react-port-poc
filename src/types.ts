import { AppPluginMeta, KeyValue } from '@grafana/data';

export type Defaults<T, K extends keyof T> = Required<Pick<T, K>>;

export interface OpenNMSCustomAction {
  id: string;
  label: string;
  url: string;
}

export interface OpenNMSAppConfig extends KeyValue {
  actions: OpenNMSCustomAction[];
}

type OpenNMSAppConfigDefaults = Defaults<OpenNMSAppConfig, 'actions'>;

export const defaultOpenNMSAppConfig: OpenNMSAppConfigDefaults = {
  actions: [],
};

export interface OpenNMSPluginMeta extends AppPluginMeta<OpenNMSAppConfig> {}
