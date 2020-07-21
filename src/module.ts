import { AppPlugin } from '@grafana/data';

import { OpenNMSAppConfig } from './types';

import { RootPage } from './RootPage';

import { ConfigTab } from './config/ConfigTab';

export const plugin = new AppPlugin<OpenNMSAppConfig>().setRootPage(RootPage).addConfigPage({
  body: ConfigTab,
  icon: 'cog',
  id: 'config',
  title: 'Configuration',
});
