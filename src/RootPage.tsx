import React, { PureComponent } from 'react';

import { OpenNMSAppConfig } from './types';

import { AppRootProps } from '@grafana/data';

interface Props extends AppRootProps<OpenNMSAppConfig> {}

export class RootPage extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h4>Received</h4>
        <code>{JSON.stringify(this.props, null, 2)}</code>
      </div>
    );
  }
}
