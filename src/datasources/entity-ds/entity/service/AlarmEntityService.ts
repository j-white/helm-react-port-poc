import { MutableDataFrame, FieldDTO } from '@grafana/data';

import { Client, Filter, Severities, OnmsAlarm } from 'opennms-js-ts';

import { invert } from 'common/Dictionary';

import { DataSource } from 'datasources/entity-ds/DataSource';
import { columns } from 'datasources/entity-ds/entity/columns/AlarmColumns';
import { fallbackComparators } from 'datasources/entity-ds/query/config/ComparatorConfig';
import { ComparatorType } from 'datasources/entity-ds/types';

import { EntityService, fieldForEntityColumn } from './EntityService';

const attributesByAlias: Record<string, string> = {
  location: 'location.locationName',
  service: 'serviceType.name',
  category: 'category.name',
  ipAddr: 'ipInterface.ipAddress',
  ipAddress: 'ipInterface.ipAddress',
  'lastEvent.severity': 'lastEvent.severity.label',
  severity: 'severity',
  troubleTicketState: 'troubleTicketState.label',
};

const aliasesByAttributes = invert(attributesByAlias);

const featuredAttributeAutocompleteValues: string[] = columns
  .filter(column => column.featured)
  .filter(column => column.resource)
  .map(column => column.resource!);

const booleanAutocompleteValues: string[] = ['false', 'true'];

const severityAutocompleteValues: string[] = Object.values(Severities).map(severity => {
  return severity.label;
});

function getParameterNames(alarms: OnmsAlarm[]): string[] {
  const parameterNames = new Set<string>();
  for (const alarm of alarms) {
    const parameters = alarm.lastEvent?.parameters ?? [];
    for (const parameter of parameters) {
      parameterNames.add(parameter.name);
    }
  }
  parameterNames.delete('label');
  return Array.from(parameterNames).sort();
}

function fieldForParameterName(parameterName: string): FieldDTO {
  return {
    name: `lastEvent.${parameterName}`,
    config: {
      displayName: `Param_${parameterName}`,
    },
  };
}

function rowDataForParameters(alarm: OnmsAlarm, parameterNames: string[]): Record<string, any> {
  const rowData: Record<string, any> = {};
  if (alarm.lastEvent?.parameters) {
    const parameters = alarm.lastEvent?.parameters || {};
    for (const parameter of parameters) {
      if (parameterNames.includes(parameter.name)) {
        const fieldName = `lastEvent.${parameter.name}`;
        rowData[fieldName] = parameter.value;
      }
    }
  }
  return rowData;
}

export class AlarmEntityService implements EntityService {
  datasource: DataSource;

  constructor(datasource: DataSource) {
    this.datasource = datasource;
  }

  async getClient(): Promise<Client> {
    return await this.datasource.opennmsClient.getClient();
  }

  toAttributeAlias(attribute: string): string {
    return aliasesByAttributes[attribute] || attribute;
  }

  fromAttributeAlias(attribute: string): string {
    return attributesByAlias[attribute] || attribute;
  }

  async autocompleteAttribute(featuredAttributes: boolean): Promise<string[]> {
    if (featuredAttributes) {
      return featuredAttributeAutocompleteValues;
    }

    const client = await this.getClient();
    const properties = (await client.alarms().searchProperties()) || [];
    return properties.filter(property => property.id).map(property => property.id!);
  }

  async autocompleteAttributeComparator(attribute: string): Promise<ComparatorType[]> {
    attribute = this.fromAttributeAlias(attribute);

    if (attribute) {
      const client = await this.getClient();
      const property = await client.alarms().searchProperty(attribute);

      if (property && property.type) {
        return property.type.getComparators().map(comparator => comparator.label as ComparatorType);
      }
    }

    return fallbackComparators.map(comparator => comparator);
  }

  async autocompleteAttributeValue(attribute: string): Promise<string[]> {
    attribute = this.fromAttributeAlias(attribute);

    if (!attribute) {
      return [];
    }

    switch (attribute) {
      case 'isSituation':
      case 'isInSituation':
      case 'isAcknowledged':
        return booleanAutocompleteValues;
      case 'severity':
        return severityAutocompleteValues;
      default:
        const client = await this.getClient();
        const property = await client.alarms().searchProperty(attribute);
        if (!property) {
          return [];
        }

        const values = (await property.findValues({ limit: 1000 })) as any[];
        return values.filter(value => value !== null).map(value => value);
    }
  }

  async query(refId: string, filter: Filter): Promise<MutableDataFrame> {
    const client = await this.getClient();
    const alarms = (await client.alarms().find(filter)) ?? [];

    const parameterNames = getParameterNames(alarms);

    var fields: FieldDTO[] = [
      ...columns.filter(column => column.visible !== false).map(column => fieldForEntityColumn(column)),
      ...parameterNames.map(parameterName => fieldForParameterName(parameterName)),
    ];

    // TODO: To add links to rows in a field's column, in field config as defaults for Grafana Table panel:
    /*
    links: [
      {
        url: "https://opennms.org/path/$variable",
        title: "Tooltip Text",
        targetBlank: true
      }
    ]
    */

    const frame = new MutableDataFrame({
      refId,
      fields,
    });

    for (const alarm of alarms) {
      frame.add({
        id: alarm.id,
        count: alarm.count,
        ackUser: alarm.ackUser,
        alarmAckTime: alarm.ackTime,
        uei: alarm.uei,
        severity: alarm.severity?.label,
        'type.label': alarm.type?.label,
        description: alarm.description,
        location: alarm.location,

        logMessage: alarm.logMessage,
        reductionKey: alarm.reductionKey,
        troubleTicket: alarm.troubleTicket,
        'troubleTicketState.label': alarm.troubleTicketState?.label,
        node: alarm.nodeId,
        'node.label': alarm.nodeLabel,
        'service.name': alarm.service?.name,
        suppressedTime: alarm.suppressedTime,
        suppressedUntil: alarm.suppressedUntil,
        suppressedBy: alarm.suppressedBy,
        ipAddress: alarm.lastEvent?.ipAddress?.address,
        isAcknowledged: Boolean((alarm.ackUser ?? false) && (alarm.ackTime ?? false)),

        // Event
        firstEventTime: alarm.firstEventTime,
        'lastEvent.id': alarm.lastEvent?.id,
        'lastEvent.time': alarm.lastEvent?.time,
        'lastEvent.source': alarm.lastEvent?.source,
        'lastEvent.createTime': alarm.lastEvent?.createTime,
        'lastEvent.severity': alarm.lastEvent?.severity?.label,
        'lastEvent.label': alarm.lastEvent?.label,
        'lastEvent.location': alarm.lastEvent?.location,

        // Sticky Note
        'sticky.id': alarm.sticky?.id,
        'sticky.body': alarm.sticky?.body,
        'sticky.author': alarm.sticky?.author,
        'sticky.updated': alarm.sticky?.updated,
        'sticky.created': alarm.sticky?.created,

        // Journal Note
        'journal.id': alarm.journal?.id,
        'journal.body': alarm.journal?.body,
        'journal.author': alarm.journal?.author,
        'journal.updated': alarm.journal?.updated,
        'journal.created': alarm.journal?.created,

        // Situation Data
        isSituation: alarm.relatedAlarms?.length ? 'Y' : 'N',
        situationAlarmCount: alarm.relatedAlarms?.length.toFixed(0),
        affectedNodeCount: alarm.affectedNodeCount?.toFixed(0),
        managedObjectInstance: alarm.managedObjectInstance,
        managedObjectType: alarm.managedObjectType,

        ...rowDataForParameters(alarm, parameterNames),
      });
    }

    // TODO: add any additional meta data required by panel plugins, as necessary

    return frame;
  }
}
