import { Defaults, OpenNMSAppConfig } from './types';

type OpenNMSAppConfigDefaults = Defaults<OpenNMSAppConfig, 'actions'>;

export const defaultOpenNMSAppConfig: OpenNMSAppConfigDefaults = {
  actions: [],
};
