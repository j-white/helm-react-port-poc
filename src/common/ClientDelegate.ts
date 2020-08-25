import { Client, GrafanaHTTP, OnmsAuthConfig, OnmsServer, ServerMetadata } from 'opennms-js-ts';

import { getBackendSrv, BackendSrv } from '@grafana/runtime';
import { DataSourceInstanceSettings } from '@grafana/data';

export class ClientDelegate {
  settings: DataSourceInstanceSettings<any>;
  backendSrv: BackendSrv;
  searchLimit: number;

  client: Client | undefined;

  constructor(settings: DataSourceInstanceSettings<any>) {
    this.settings = settings;
    this.backendSrv = getBackendSrv();
    this.searchLimit = 1000;
  }

  async getClient(): Promise<Client> {
    if (this.client) {
      return this.client;
    }

    let timeout;
    if (this.settings.jsonData && this.settings.jsonData.timeout) {
      timeout = parseInt(this.settings.jsonData.timeout, 10) * 1000;
    }

    let authConfig = undefined;
    if (this.settings.basicAuth) {
      // If basic auth is configured, pass the username and password to the client
      // This allows the datasource to work in direct mode
      // We need the raw username and password, so we decode the token
      const token = this.settings.basicAuth.split(' ')[1];
      const decodedToken = atob(token);
      const username = decodedToken.split(':')[0];
      const password = decodedToken.substring(username.length + 1, decodedToken.length);
      authConfig = new OnmsAuthConfig(username, password);
    }

    const server = OnmsServer.newBuilder(this.settings.url)
      .setName(this.settings.name)
      .setAuth(authConfig)
      .build();
    const http = new GrafanaHTTP(this.backendSrv, server, timeout);
    if (http.server && http.server.name && http.server.url) {
      try {
        const metadata = await Client.getMetadata(http.server, http, timeout);
        // Ensure the OpenNMS we are talking to is compatible
        if (metadata.apiVersion() < 2) {
          throw new Error('Unsupported Version');
        }
        http.server = OnmsServer.newBuilder(http.server.url)
          .setName(this.settings.name)
          .setAuth(authConfig)
          .setMetadata(metadata)
          .build();
        this.client = new Client(http);
        return this.client;
      } catch (e) {
        // in case of error, reset the client, otherwise
        // the datasource may never recover
        this.client = undefined;
        throw e;
      }
    } else {
      throw new Error('Incomplete configuration.');
    }
  }

  async getMetadata(): Promise<ServerMetadata> {
    const client = (await this.getClient()) as Client;
    return client.http!.server!.metadata!;
  }
}
