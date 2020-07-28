import _ from 'lodash';

import { Comparators, NestedRestriction, Restriction } from 'opennms-js-ts';

import Entity from './Entity';

const COLUMNS = Object.freeze([
  { name: 'ID', type: 'id' },
  { name: 'Count', type: 'count' },
  { name: 'Acked By', type: 'ackUser' },
  { name: 'Ack Time', type: 'alarmAckTime', featured: true },
  { name: 'UEI', type: 'uei', featured: true },
  { name: 'Severity', type: 'severity', featured: true },
  { name: 'Type', type: 'type.label' },
  { name: 'Description', type: 'description' },
  { name: 'Location', type: 'location', featured: true },
  { name: 'Log Message', type: 'logMessage' },
  { name: 'Reduction Key', type: 'reductionKey', featured: true },
  { name: 'Trouble Ticket', type: 'troubleTicket' },
  { name: 'Trouble Ticket State', type: 'troubleTicketState.label' },
  { name: 'Node ID', type: 'node', featured: true },
  { name: 'Node Label', type: 'node.label', featured: true },
  { name: 'Service', type: 'service.name', featured: true },
  { name: 'Suppressed Time', type: 'suppressedTime' },
  { name: 'Suppressed Until', type: 'suppressedUntil' },
  { name: 'Suppressed By', type: 'suppressedBy' },
  { name: 'IP Address', type: 'ipAddress', featured: true },
  { name: 'Is Acknowledged', type: 'isAcknowledged', featured: true },
  { name: 'First Event Time', type: 'firstEventTime' },
  { name: 'Last Event ID', type: 'lastEvent.id' },
  { name: 'Last Event Time', type: 'lastEvent.time' },
  { name: 'Last Event Source', type: 'lastEvent.source' },
  { name: 'Last Event Creation Time', type: 'lastEvent.createTime' },
  { name: 'Last Event Severity', type: 'lastEvent.severity' },
  { name: 'Last Event Label', type: 'lastEvent.label' },
  { name: 'Last Event Location', type: 'lastEvent.location' },
  { name: 'Sticky ID', type: 'sticky.id' },
  { name: 'Sticky Note', type: 'sticky.body' },
  { name: 'Sticky Author', type: 'sticky.author' },
  { name: 'Sticky Update Time', type: 'sticky.updated' },
  { name: 'Sticky Creation Time', type: 'sticky.created' },
  { name: 'Journal ID', type: 'journal.id' },
  { name: 'Journal Note', type: 'journal.body' },
  { name: 'Journal Author', type: 'journal.author' },
  { name: 'Journal Update Time', type: 'journal.updated' },
  { name: 'Journal Creation Time', type: 'journal.created' },
  { name: 'Is Situation', type: 'isSituation', featured: true },
  { name: 'Is In Situation', type: 'isInSituation', featured: true, visible: false },
  { name: 'Situation Alarm Count', type: 'situationAlarmCount', featured: true },
  { name: 'Affected Node Count', type: 'affectedNodeCount', featured: true },
  { name: 'Managed Object Instance', type: 'managedObjectInstance' },
  { name: 'Managed Object Type', type: 'managedObjectType' },
  { name: 'Categories', type: 'category', featured: true, visible: false },
  { name: 'Data Source' },
]);

// const mapping = ({
//   location: 'location.locationName',
//   service: 'serviceType.name',
//   category: 'category.name',
//   ipAddr: 'ipInterface.ipAddress',
//   ipAddress: 'ipInterface.ipAddress',
//   'lastEvent.severity': 'lastEvent.severity.label',
//   severity: 'severity',
//   troubleTicketState: 'troubleTicketState.label',
// });

const TYPE = 'alarm';

export default class AlarmEntity extends Entity {
  type: string;
  datasource: any;
  client: any;
  columns: any;
  constructor(client: any, datasource: any) {
    super(client, datasource);
    this.type = TYPE;
    this.columns = Array.from(COLUMNS);
  }

  getColumns() {
    return this.columns;
  }

  getPanelRestrictions() {
    const self = this;
    const dashboard = self.datasource.dashboardSrv.getCurrent();
    const filterPanel = dashboard.panels.filter(
      (panel: { type: string }) => panel.type === 'opennms-helm-filter-panel'
    )[0];
    const restrictions = new NestedRestriction();

    if (filterPanel && filterPanel.columns && filterPanel.columns.length > 0) {
      filterPanel.columns.forEach((column: { selected: any }) => {
        const selected = column.selected;
        if (!selected) {
          return;
        }
        let key = selected.type;
        if (selected.entityType && selected.entityType.id !== self.type) {
          key = selected.entityType.id + '.' + key;
        }
        const comparator = Comparators.EQ;
        const getValueRestriction = (val: string) => {
          if (!self.datasource.templateSrv.isAllValue(val) && !_.isNil(val)) {
            if (selected.type === 'categories' || selected.type === 'category.name') {
              return new Restriction('category.name', comparator, val);
            } else if (selected.inputType === 'name') {
              if (val.length === 0) {
                return undefined;
              }
              if (!val.startsWith('*') && !val.endsWith('*')) {
                return new Restriction(key, comparator, '*' + val + '*');
              }
            }
            return new Restriction(key, comparator, val);
          }
          return undefined;
        };
        if (selected.value) {
          const values = Array.isArray(selected.value) ? selected.value : [selected.value];
          let restriction: NestedRestriction | Restriction | undefined;
          if (values.length === 0) {
            return;
          } else if (values.length === 1) {
            restriction = getValueRestriction(values[0]);
          } else {
            restriction = new NestedRestriction();
            // values.forEach((val: any) => {
            //   if (val && restriction) restriction.withOrRestriction(getValueRestriction(val));
            // });
            if (!restriction.clauses || restriction.clauses.length === 0) {
              restriction = undefined;
            }
          }
          if (restriction) {
            restrictions.withAndRestriction(restriction);
          }
        }
      });
    }
    if (restrictions.clauses && restrictions.clauses.length > 0) {
      return restrictions;
    }
    return undefined;
  }

  async query(filter: { withAndRestriction: (arg0: NestedRestriction) => void }) {
    // const panelRestrictions = this.getPanelRestrictions();

    // if (panelRestrictions) {
    //   filter.withAndRestriction(panelRestrictions);
    // }

    const alarms = await this.client.findAlarms(filter);
    let metadata = this.client.metadata;

    // Rebuild the list of columns - we append to these based on the event parms that are available
    this.columns = Array.from(COLUMNS);
    return AlarmEntity.toTable(alarms, this.columns, metadata, this.datasource.name);
  }

  static builtinColumns() {
    return COLUMNS;
  }

  static toTable(alarms: any, columns: any, metadata: { ticketerConfig: any }, datasourceName: any) {
    // Build a sorted list of (unique) event parameter names
    let parameterNames = _.uniq(
      _.sortBy(
        _.flatten(
          _.map(alarms, alarm => {
            if (!alarm.lastEvent || !alarm.lastEvent.parameters) {
              return [];
            }
            return _.map(alarm.lastEvent.parameters, parameter => {
              return parameter.name;
            });
          })
        ),
        name => name
      )
    );

    // Include the event parameters as columns
    _.each(parameterNames, parameterName => {
      columns.push({
        name: 'Param_' + parameterName,
        type: 'lastEvent.' + parameterName,
      });
    });

    const rows = _.map(alarms, alarm => {
      let row = {
        ID: alarm.id,
        Count: alarm.count,
        'Acked By': alarm.ackUser,
        'Ack Time': alarm.ackTime,
        UEI: alarm.uei,
        Severity: alarm.severity ? alarm.severity.label : undefined,
        Type: alarm.type ? alarm.type.label : undefined,
        Description: alarm.description,
        Location: alarm.location,

        'Log Message': alarm.logMessage,
        'Reduction Key': alarm.reductionKey,
        'Trouble Ticket': alarm.troubleTicket,
        'Trouble Ticket State': alarm.troubleTicketState ? alarm.troubleTicketState.label : undefined,
        'Node ID': alarm.nodeId,
        'Node Label': alarm.nodeLabel,
        Service: alarm.service ? alarm.service.name : undefined,
        'Suppressed Time': alarm.suppressedTime,
        'Suppressed Until': alarm.suppressedUntil,
        'Suppressed By': alarm.suppressedBy,
        'IP Address': alarm.lastEvent
          ? alarm.lastEvent.ipAddress
            ? alarm.lastEvent.ipAddress.address
            : undefined
          : undefined,
        'Is Acknowledged': !_.isNil(alarm.ackUser) && !_.isNil(alarm.ackTime),

        // // Event
        'First Event Time': alarm.firstEventTime,
        'Last Event ID': alarm.lastEvent ? alarm.lastEvent.id : undefined,
        'Last Event Time': alarm.lastEvent ? alarm.lastEvent.time : undefined,
        'Last Event Source': alarm.lastEvent ? alarm.lastEvent.source : undefined,
        'Last Every Create Time': alarm.lastEvent ? alarm.lastEvent.createTime : undefined,
        'Last Event Severity': alarm.lastEvent && alarm.lastEvent.severity ? alarm.lastEvent.severity.label : undefined,
        'Last Event Label': alarm.lastEvent ? alarm.lastEvent.label : undefined,
        'Last Event Location': alarm.lastEvent ? alarm.lastEvent.location : undefined,

        // // Sticky Note
        'Sticky ID': alarm.sticky ? alarm.sticky.id : undefined,
        'Sticky Note': alarm.sticky ? alarm.sticky.body : undefined,
        'Sticky Author': alarm.sticky ? alarm.sticky.author : undefined,
        'Sticky Update Time': alarm.sticky ? alarm.sticky.updated : undefined,
        'Sticky Creation Time': alarm.sticky ? alarm.sticky.created : undefined,

        // // Journal Note
        'Journal ID': alarm.journal ? alarm.journal.id : undefined,
        'Journal Note': alarm.journal ? alarm.journal.body : undefined,
        'Journal Author': alarm.journal ? alarm.journal.author : undefined,
        'Journal Update Time': alarm.journal ? alarm.journal.updated : undefined,
        'Journal Creation Time': alarm.journal ? alarm.journal.created : undefined,

        // // Situation Data
        'Is Situation': alarm.relatedAlarms && alarm.relatedAlarms.length > 0 ? 'Y' : 'N',
        'Is In Situation': alarm.relatedAlarms ? alarm.relatedAlarms.length.toFixed(0) : undefined,
        'Affected Alarm Count': alarm.affectedNodeCount ? alarm.affectedNodeCount.toFixed(0) : undefined,
        'Situation Alarm Count': alarm.situationAlarmCount ? alarm.situationAlarmCount.toFixed(0) : undefined,
        'Managed Object Instance': alarm.managedObjectInstance ? alarm.managedObjectInstance : undefined,
        'Managed Object Type': alarm.managedObjectType ? alarm.managedObjectType : undefined,

        // // Data Source
        'Data Source': self.name,
      };

      // Index the event parameters by name
      //   const eventParametersByName = {};
      //   if (alarm.lastEvent && alarm.lastEvent.parameters) {
      //     _.each(alarm.lastEvent.parameters, parameter => {
      //       eventParametersByName[parameter.name] = parameter.value;
      //     });
      //   }

      //   // Append the event parameters to the row
      //   _.each(parameterNames, parameterName => {
      //     if (eventParametersByName.hasOwnProperty(parameterName)) {
      //       row.push(eventParametersByName[parameterName]);
      //     } else {
      //       row.push(undefined);
      //     }
      //   });

      return row;
    });

    const metas = _.map(alarms, alarm => {
      return {
        // Store the alarm for easy access by the panels
        alarm: alarm,
        // Store the name of the data-source as part of the data so that
        // the panel can grab an instance of the DS to perform actions
        // on the alarms
        source: datasourceName,
        // Store the entity type
        type: TYPE,
        // Store the ticketerConfig here
        // ticketerConfig: metadata.ticketerConfig,
      };
    });

    return {
      columns: columns.filter((column: { visible: boolean }) => column.visible !== false),
      meta: {
        entity_metadata: metas,
      },
      rows: rows,
      type: 'table',
    };
  }
}
