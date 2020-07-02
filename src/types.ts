import { AppPluginMeta, KeyValue } from '@grafana/data';

export interface OpenNMSAppConfig extends KeyValue {}

export interface OpenNMSPluginMeta extends AppPluginMeta<OpenNMSAppConfig> {}
