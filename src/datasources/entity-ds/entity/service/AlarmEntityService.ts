import { Client, Filter, Severities } from 'opennms-js-ts';

import { invert } from 'common/Dictionary';

import { DataSource } from 'datasources/entity-ds/DataSource';
import { columns } from 'datasources/entity-ds/entity/columns/AlarmColumns';
import { fallbackComparators } from 'datasources/entity-ds/query/config/ComparatorConfig';
import { ComparatorType } from 'datasources/entity-ds/types';

import { EntityService } from './EntityService';

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

  async query(filter: Filter): Promise<any[]> {
    // TODO: rename opennmsClient back in DataSource?

    // TODO: implement
    // const alarms = await this.datasource.opennmsClient.findAlarms(filter);

    // TODO: post-processing

    return [];
  }
}
