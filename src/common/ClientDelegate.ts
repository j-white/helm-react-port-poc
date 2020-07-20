import { Client, GrafanaHTTP, Comparators, Operators, Filter, OnmsAuthConfig, OnmsServer } from 'opennms-js-ts';
import _ from 'lodash';
import { getBackendSrv } from '@grafana/runtime';
import { DataSourceInstanceSettings } from '@grafana/data';

export class ClientDelegate {
  backendSrv: any;
  searchLimit: number;
  client: Client | undefined;
  settings: DataSourceInstanceSettings<any>;
  constructor(settings: DataSourceInstanceSettings<any>) {
    this.settings = settings;
    this.backendSrv = getBackendSrv();
    this.searchLimit = 1000;
    this.client = undefined;
  }

  async decorateError(err: any) {
    let ret = err;
    if (err.err) {
      ret = err.err;
    }
    if (err.data && err.data.err) {
      ret = err.data.err;
    }
    let statusText = 'Request failed.';

    // cancelled property causes the UI to never complete on failure
    if (err.cancelled) {
      statusText = 'Request timed out.';
      delete err.cancelled;
    }
    if (err.data && err.data.cancelled) {
      statusText = 'Request timed out.';
      delete err.data.cancelled;
    }

    if (!ret.message) {
      ret.message = ret.statusText || statusText;
    }
    if (!ret.status) {
      ret.status = 'error';
    }
    return Promise.reject(ret);
  }

  async getClient() {
    if (!this.client) {
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
      }
    }
    return this.client;
  }

  // Inventory (node) related functions

  async getNodeDao() {
    this.client = await this.getClient();
    if (this.client) {
      return this.client.nodes();
    }
    return undefined;
  }

  async findNodes(filter: Filter | undefined) {
    try {
      let nodeDao = await this.getNodeDao();
      if (nodeDao) {
        return nodeDao.find(filter);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getNode(nodeId: number) {
    try {
      let nodeDao = await this.getNodeDao();
      if (nodeDao) {
        return nodeDao.get(nodeId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getNodeProperties() {
    try {
      let nodeDao = await this.getNodeDao();
      if (nodeDao) {
        return nodeDao.searchProperties();
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async findNodeProperty(propertyId: string | undefined) {
    let properties = await this.getNodeProperties();
    return _.find(properties, function(property) {
      return property.id === propertyId;
    });
  }

  async getNodePropertyComparators(propertyId: string | undefined) {
    try {
      let property = await this.findNodeProperty(propertyId);
      if (property && property.type) {
        const comparators = property.type.getComparators();
        if (comparators && comparators.length > 0) {
          return comparators;
        }
      }
      console.log("No comparators found for property with id '" + propertyId + "'. Falling back to EQ.");
      // This may be the case when the user entered a property, which does not exist
      // therefore fallback to EQ
      return [Comparators.EQ];
    } catch (err) {
      return this.decorateError(err);
    }
  }

  // Fault related functions
  async getAlarmDao() {
    this.client = await this.getClient();
    if (this.client) {
      return this.client.alarms();
    }
    return undefined;
  }

  async findAlarms(filter: Filter | undefined) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.find(filter);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getAlarm(alarmId: number) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.get(alarmId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async doEscalate(alarmId: number | import('opennms-js-ts').OnmsAlarm) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.escalate(alarmId);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async doClear(alarmId: number | import('opennms-js-ts').OnmsAlarm) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.clear(alarmId);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async doUnack(alarmId: number | import('opennms-js-ts').OnmsAlarm, user: string | undefined) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.unacknowledge(alarmId, user);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async doAck(alarmId: number | import('opennms-js-ts').OnmsAlarm, user: string | undefined) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.acknowledge(alarmId, user);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async doTicketAction(alarmId: string, action: string) {
    const supportedActions = ['create', 'update', 'close'];
    if (supportedActions.indexOf(action) < 0) {
      throw { message: "Action '" + action + "' not supported." };
    }
    try {
      return this.backendSrv.datasourceRequest({
        url: this.settings.url + '/api/v2/alarms/' + alarmId + '/ticket/' + action,
        method: 'POST',
      });
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async saveSticky(alarmId: number | import('opennms-js-ts').OnmsAlarm, sticky: string, user: string | undefined) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.saveStickyMemo(alarmId, sticky, user);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async deleteSticky(alarmId: number | import('opennms-js-ts').OnmsAlarm) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.deleteStickyMemo(alarmId);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async saveJournal(alarmId: number | import('opennms-js-ts').OnmsAlarm, journal: string, user: string | undefined) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.saveJournalMemo(alarmId, journal, user);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async deleteJournal(alarmId: number | import('opennms-js-ts').OnmsAlarm) {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.deleteJournalMemo(alarmId);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async findOperators() {
    const operators = await _.map(Operators, function(operator) {
      return {
        id: operator.id,
        label: operator.label,
      };
    });
    return operators;
  }

  async getAlarmProperties() {
    try {
      let alarmDao = await this.getAlarmDao();
      if (alarmDao) {
        return alarmDao.searchProperties();
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async findAlarmProperty(propertyId: any) {
    let properties = await this.getAlarmProperties();
    return await _.find(properties, function(property) {
      return property.id === propertyId;
    });
  }

  async getAlarmPropertyComparators(propertyId: string) {
    try {
      let property = await this.findAlarmProperty(propertyId);
      if (property && property.type) {
        const comparators = property.type.getComparators();
        if (comparators && comparators.length > 0) {
          return comparators;
        }
      }
      console.log("No comparators found for property with id '" + propertyId + "'. Falling back to EQ.");
      // This may be the case when the user entered a property, which does not exist
      // therefore fallback to EQ
      return [Comparators.EQ];
    } catch (err) {
      return this.decorateError(err);
    }
  }

  // Situation Feedback functions

  async getSituationfeedbackDao() {
    try {
      this.client = await this.getClient();
      if (this.client) {
        return this.client.situationfeedback();
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSituationfeedback(situationId: any) {
    try {
      let feedbackDao = await this.getSituationfeedbackDao();
      if (feedbackDao) {
        return feedbackDao.getFeedback(situationId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async submitSituationFeedback(situationId: any, feedback: any) {
    try {
      let feedbackDao = await this.getSituationfeedbackDao();
      if (feedbackDao) {
        return feedbackDao.saveFeedback(feedback, situationId);
      }
    } catch (err) {
      return this.decorateError(err);
    }
  }

  // Flow related functions

  async getFlowDao() {
    try {
      this.client = await this.getClient();
      if (this.client) {
        return this.client.flows();
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getApplications(prefix: any, start: any, end: any, nodeCriteria: any, interfaceId: any) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getApplications(prefix, start, end, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSeriesForTopNApplications(
    N: any,
    start: any,
    end: any,
    step: any,
    includeOther: any,
    nodeCriteria: any,
    interfaceId: any
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSeriesForTopNApplications(N, start, end, step, includeOther, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSeriesForApplications(
    applications: any,
    start: any,
    end: any,
    step: any,
    includeOther: any,
    nodeCriteria: any,
    interfaceId: any
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSeriesForApplications(
          applications,
          start,
          end,
          step,
          includeOther,
          nodeCriteria,
          interfaceId
        );
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSummaryForTopNApplications(
    N: any,
    start: any,
    end: any,
    includeOther: any,
    nodeCriteria: any,
    interfaceId: any
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSummaryForTopNApplications(N, start, end, includeOther, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSummaryForApplications(
    applications: any,
    start: any,
    end: any,
    includeOther: any,
    nodeCriteria: any,
    interfaceId: any
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSummaryForApplications(applications, start, end, includeOther, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSeriesForTopNConversations(
    N: any,
    start: number,
    end: number,
    step: number,
    includeOther: any,
    nodeCriteria: string,
    interfaceId: number
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSeriesForTopNConversations({
          N: N,
          start: start,
          end: end,
          step: step,
          exporterNodeCriteria: nodeCriteria,
          ifIndex: interfaceId,
          includeOther: includeOther,
        });
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSeriesForConversations(
    conversations: any,
    start: any,
    end: any,
    step: any,
    includeOther: any,
    nodeCriteria: any,
    interfaceId: any
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSeriesForConversations(
          conversations,
          start,
          end,
          step,
          includeOther,
          nodeCriteria,
          interfaceId
        );
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSummaryForTopNConversations(
    N: any,
    start: number,
    end: number,
    includeOther: any,
    nodeCriteria: string,
    interfaceId: number
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSummaryForTopNConversations({
          N: N,
          start: start,
          end: end,
          exporterNodeCriteria: nodeCriteria,
          ifIndex: interfaceId,
          includeOther: includeOther,
        });
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSummaryForConversations(
    conversations: any,
    start: any,
    end: any,
    includeOther: any,
    nodeCriteria: any,
    interfaceId: any
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSummaryForConversations(conversations, start, end, includeOther, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getHosts(prefix: string, start: any, end: any, nodeCriteria: any, interfaceId: any) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getHosts(prefix + '.*', start, end, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSeriesForHosts(
    hosts: any,
    start: any,
    end: any,
    step: any,
    includeOther: any,
    nodeCriteria: any,
    interfaceId: any
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSeriesForHosts(hosts, start, end, step, includeOther, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSeriesForTopNHosts(
    N: any,
    start: any,
    end: any,
    step: any,
    includeOther: any,
    nodeCriteria: any,
    interfaceId: any
  ) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSeriesForTopNHosts(N, start, end, step, includeOther, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSummaryForTopNHosts(N: any, start: any, end: any, includeOther: any, nodeCriteria: any, interfaceId: any) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSummaryForTopNHosts(N, start, end, includeOther, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getSummaryForHosts(hosts: any, start: any, end: any, includeOther: any, nodeCriteria: any, interfaceId: any) {
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getSummaryForHosts(hosts, start, end, includeOther, nodeCriteria, interfaceId);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getExporters() {
    let searchLimit = this.searchLimit;
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getExporters(searchLimit);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }

  async getExporter(nodeCriteria: any) {
    let searchLimit = this.searchLimit;
    try {
      let flowDao = await this.getFlowDao();
      if (flowDao) {
        return flowDao.getExporter(nodeCriteria, searchLimit);
      }
      return undefined;
    } catch (err) {
      return this.decorateError(err);
    }
  }
}
