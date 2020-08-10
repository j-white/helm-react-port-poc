import { Client, Filter, Severities } from 'opennms-js-ts';

import { invert } from 'common/Dictionary';

import { DataSource } from 'datasources/entity-ds/DataSource';
import { columns } from 'datasources/entity-ds/entity/columns/NodeColumns';
import { fallbackComparators } from 'datasources/entity-ds/query/config/ComparatorConfig';
import { ComparatorType } from 'datasources/entity-ds/types';

import { EntityService } from './EntityService';

const attributesByAlias: Record<string, string> = {
  category: 'category.name',
  categories: 'category.name',
  'categories.name': 'category.name',
  ifIndex: 'snmpInterface.ifIndex',
  ipAddr: 'ipInterface.ipAddress',
  ipAddress: 'ipInterface.ipAddress',
  ipHostname: 'ipInterface.ipHostname',
  location: 'location.locationName',
  parentId: 'parent.id',
  parentForeignSource: 'parent.foreignSource',
  parentForeignId: 'parent.foreindId',
};

const aliasesByAttributes = invert(attributesByAlias);

const featuredAttributeAutocompleteValues: string[] = columns
  .filter(column => column.featured)
  .filter(column => column.resource)
  .map(column => column.resource!);

export class NodeEntityService implements EntityService {
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
    const properties = (await client.nodes().searchProperties()) || [];
    return properties.filter(property => property.id).map(property => property.id!);
  }

  async autocompleteAttributeComparator(attribute: string): Promise<ComparatorType[]> {
    attribute = this.fromAttributeAlias(attribute);

    if (attribute) {
      const client = await this.getClient();
      const property = await client.nodes().searchProperty(attribute);

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

    const client = await this.getClient();
    const property = await client.nodes().searchProperty(attribute);
    if (!property) {
      return [];
    }

    const values = (await property.findValues({ limit: 1000 })) as any[];
    return values.filter(value => value !== null).map(value => value);
  }

  async query(filter: Filter): Promise<any[]> {
    // TODO: rename opennmsClient back in DataSource?

    // TODO: implement
    // const alarms = await this.datasource.opennmsClient.findAlarms(filter);

    // TODO: post-processing

    return [];
  }
}
