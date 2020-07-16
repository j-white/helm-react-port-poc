import { Client, GrafanaHTTP, OnmsAuthConfig, OnmsServer } from 'opennms-js-ts';
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

  //     decorateError(err) {
  //         let ret = err;
  //         if (err.err) {
  //             ret = err.err;
  //         }
  //         if (err.data && err.data.err) {
  //             ret = err.data.err;
  //         }
  //         let statusText = 'Request failed.';

  //         // cancelled property causes the UI to never complete on failure
  //         if (err.cancelled) {
  //             statusText = 'Request timed out.';
  //             delete err.cancelled;
  //         }
  //         if (err.data && err.data.cancelled) {
  //             statusText = 'Request timed out.';
  //             delete err.data.cancelled;
  //         }

  //         if (!ret.message) {
  //             ret.message = ret.statusText || statusText;
  //         }
  //         if (!ret.status) {
  //             ret.status = 'error';
  //         }
  //         return Q.reject(ret);
  //     }

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

  //     // Inventory (node) related functions

  //     getNodeDao() {
  //         return this.getClient().then(function(client) {
  //             return client.nodes();
  //         });
  //     }

  //     findNodes(filter) {
  //         return this.getNodeDao()
  //             .then(function(nodeDao) {
  //                 return nodeDao.find(filter);
  //             }).catch(this.decorateError);
  //     }

  //     getNode(nodeId) {
  //       return this.getNodeDao()
  //         .then(function(nodeDao) {
  //             return nodeDao.get(nodeId);
  //         }).catch(this.decorateError);
  //     }

  //     getNodeProperties() {
  //         return this.getNodeDao()
  //             .then(nodeDao => {
  //                 return nodeDao.searchProperties();
  //             }).catch(this.decorateError);
  //     }

  //     findNodeProperty(propertyId) {
  //         return this.getNodeProperties()
  //             .then(properties => {
  //                 return _.find(properties, function(property) {
  //                     return property.id === propertyId;
  //                 });
  //             });
  //     }

  //     getNodePropertyComparators(propertyId) {
  //         return this.findNodeProperty(propertyId)
  //             .then(property => {
  //                 if (property) {
  //                     const comparators = property.type.getComparators();
  //                     if (comparators && comparators.length > 0) {
  //                         return comparators;
  //                     }
  //                 }
  //                 console.log("No comparators found for property with id '" + propertyId + "'. Falling back to EQ.");
  //                 // This may be the case when the user entered a property, which does not exist
  //                 // therefore fallback to EQ
  //                 return [ API.Comparators.EQ ];
  //             }).catch(this.decorateError);
  //     }

  //     // Fault related functions

  //     getAlarmDao() {
  //         return this.getClient().then(function(client) {
  //             return client.alarms();
  //         });
  //     }

  //     findAlarms(filter) {
  //         return this.getAlarmDao()
  //             .then(function(alarmDao) {
  //                 return alarmDao.find(filter);
  //             }).catch(this.decorateError);
  //     }

  //     getAlarm(alarmId) {
  //       return this.getAlarmDao()
  //         .then(function(alarmDao) {
  //             return alarmDao.get(alarmId);
  //         }).catch(this.decorateError);
  //     }

  //     doEscalate(alarmId, user) {
  //         return this.getAlarmDao()
  //             .then(alarmDao => {
  //                 return alarmDao.escalate(alarmId, user)
  //             }).catch(this.decorateError);
  //     }

  //     doClear(alarmId, user) {
  //         return this.getAlarmDao()
  //             .then(alarmDao => {
  //                 return alarmDao.clear(alarmId, user);
  //             }).catch(this.decorateError);
  //     }

  //     doUnack(alarmId, user) {
  //         return this.getAlarmDao()
  //             .then(alarmDao => {
  //                 return alarmDao.unacknowledge(alarmId, user);
  //             }).catch(this.decorateError);
  //     }

  //     doAck(alarmId, user) {
  //         return this.getAlarmDao()
  //             .then(function(alarmDao) {
  //                 return alarmDao.acknowledge(alarmId, user);
  //             }).catch(this.decorateError);
  //     }

  //     doTicketAction(alarmId, action) {
  //         const supportedActions = ["create", "update", "close"];
  //         if (supportedActions.indexOf(action) < 0) {
  //             throw {message: "Action '" + action + "' not supported."};
  //         }
  //         const self = this;
  //         return this.backendSrv.datasourceRequest({
  //             url: self.url + '/api/v2/alarms/' + alarmId + "/ticket/" + action,
  //             method: 'POST',
  //         }).catch(this.decorateError);
  //     }

  //     saveSticky(alarmId, sticky, user) {
  //       return this.getAlarmDao()
  //         .then(function(alarmDao) {
  //           return alarmDao.saveStickyMemo(alarmId, sticky, user);
  //         }).catch(this.decorateError);
  //     }

  //     deleteSticky(alarmId) {
  //       return this.getAlarmDao()
  //         .then(function(alarmDao) {
  //           return alarmDao.deleteStickyMemo(alarmId);
  //         }).catch(this.decorateError);
  //     }

  //     saveJournal(alarmId, journal, user) {
  //       return this.getAlarmDao()
  //         .then(function(alarmDao) {
  //           return alarmDao.saveJournalMemo(alarmId, journal, user);
  //         }).catch(this.decorateError);
  //     }

  //     deleteJournal(alarmId) {
  //       return this.getAlarmDao()
  //         .then(function(alarmDao) {
  //           return alarmDao.deleteJournalMemo(alarmId);
  //         }).catch(this.decorateError);
  //     }

  //     findOperators() {
  //         const operators = _.map(API.Operators, function(operator) {
  //             return {
  //                 id: operator.id,
  //                 label: operator.label
  //             }
  //         });
  //         return this.$q.when(operators);
  //     }

  //     getAlarmProperties() {
  //         return this.getAlarmDao()
  //             .then(alarmDao => {
  //                 return alarmDao.searchProperties();
  //             }).catch(this.decorateError);
  //     }

  //     findAlarmProperty(propertyId) {
  //         return this.getAlarmProperties()
  //             .then(properties => {
  //                 return _.find(properties, function(property) {
  //                     return property.id === propertyId;
  //                 });
  //             });
  //     }

  //     getAlarmPropertyComparators(propertyId) {
  //         return this.findAlarmProperty(propertyId)
  //             .then(property => {
  //                 if (property) {
  //                     const comparators = property.type.getComparators();
  //                     if (comparators && comparators.length > 0) {
  //                         return comparators;
  //                     }
  //                 }
  //                 console.log("No comparators found for property with id '" + propertyId + "'. Falling back to EQ.");
  //                 // This may be the case when the user entered a property, which does not exist
  //                 // therefore fallback to EQ
  //                 return [ API.Comparators.EQ ];
  //             }).catch(this.decorateError);
  //     }

  //     // Situation Feedback functions

  //     getSituationfeedbackDao() {
  //         return this.getClient().then(function (c) {
  //             return c.situationfeedback();
  //         }).catch(this.decorateError);
  //     }

  //     getSituationfeedback(situationId) {
  //         return this.getSituationfeedbackDao()
  //         .then(function(feedbackDao) {
  //             return feedbackDao.getFeedback(situationId);
  //         }).catch(this.decorateError);
  //     }

  //     submitSituationFeedback(situationId, feedback) {
  //         return this.getSituationfeedbackDao()
  //         .then(function(feedbackDao) {
  //           return feedbackDao.saveFeedback(feedback, situationId);
  //         }).catch(this.decorateError);
  //     }

  //     // Flow related functions

  //     getFlowDao() {
  //         return this.getClient().then(function(c) {
  //             return c.flows();
  //         }).catch(this.decorateError);
  //     }

  //     getApplications(prefix, start, end, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getApplications(prefix, start, end, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSeriesForTopNApplications(N, start, end, step, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSeriesForTopNApplications(N, start, end, step, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSeriesForApplications(applications, start, end, step, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSeriesForApplications(applications, start, end, step, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSummaryForTopNApplications(N, start, end, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSummaryForTopNApplications(N, start, end, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSummaryForApplications(applications, start, end, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSummaryForApplications(applications, start, end, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSeriesForTopNConversations(N, start, end, step, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSeriesForTopNConversations({
  //                     N: N,
  //                     start: start,
  //                     end: end,
  //                     step: step,
  //                     exporterNode: nodeCriteria,
  //                     ifIndex: interfaceId,
  //                     includeOther: includeOther
  //                 });
  //             }).catch(this.decorateError);
  //     }

  //     getSeriesForConversations(conversations, start, end, step, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSeriesForConversations(conversations, start, end, step, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSummaryForTopNConversations(N, start, end, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSummaryForTopNConversations({
  //                     N: N,
  //                     start: start,
  //                     end: end,
  //                     exporterNode: nodeCriteria,
  //                     ifIndex: interfaceId,
  //                     includeOther: includeOther
  //                 });
  //             }).catch(this.decorateError);
  //     }

  //     getSummaryForConversations(conversations, start, end, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSummaryForConversations(conversations, start, end, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getHosts(prefix, start, end, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getHosts(prefix + '.*', start, end, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSeriesForHosts(hosts, start, end, step, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSeriesForHosts(hosts, start, end, step, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSeriesForTopNHosts(N, start, end, step, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSeriesForTopNHosts(N, start, end, step, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSummaryForTopNHosts(N, start, end, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSummaryForTopNHosts(N, start, end, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getSummaryForHosts(hosts, start, end, includeOther, nodeCriteria, interfaceId) {
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getSummaryForHosts(hosts, start, end, includeOther, nodeCriteria, interfaceId);
  //             }).catch(this.decorateError);
  //     }

  //     getExporters() {
  //         let searchLimit = this.searchLimit;
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getExporters(searchLimit);
  //             }).catch(this.decorateError);
  //     }

  //     getExporter(nodeCriteria) {
  //         let searchLimit = this.searchLimit;
  //         return this.getFlowDao()
  //             .then(function(flowDao) {
  //                 return flowDao.getExporter(nodeCriteria, searchLimit);
  //             }).catch(this.decorateError);
  //     }
}
