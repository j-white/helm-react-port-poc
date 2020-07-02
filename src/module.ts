import { AppPlugin } from '@grafana/data';

import { OpenNMSAppConfig } from './types';

import { ConfigTab } from './config/ConfigTab';
import { RootPage } from './RootPage';

export const plugin = new AppPlugin<OpenNMSAppConfig>().setRootPage(RootPage).addConfigPage({
  body: ConfigTab,
  icon: 'cog',
  id: 'config',
  title: 'Configuration',
});
