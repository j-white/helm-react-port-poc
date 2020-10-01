import { MutableDataFrame, FieldDTO } from '@grafana/data';

import { Client, Filter, OnmsNode } from 'opennms-js-ts';

import { invert } from 'common/Dictionary';

import { DataSource } from 'datasources/entity-ds/DataSource';
import { columns } from 'datasources/entity-ds/entity/columns/NodeColumns';
import { fallbackComparators } from 'datasources/entity-ds/query/config/ComparatorConfig';
import { ComparatorType } from 'datasources/entity-ds/types';

import { EntityService, fieldForEntityColumn } from './EntityService';

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

function getPrimaryIpInterface(node: OnmsNode) {
  return node.ipInterfaces?.find(ipInterface => ipInterface.snmpPrimary?.isPrimary());
}

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

  async query(refId: string, filter: Filter): Promise<MutableDataFrame> {
    const client = await this.getClient();
    const nodes = (await client.nodes().find(filter)) ?? [];

    var fields: FieldDTO[] = [
      ...columns.filter(column => column.visible !== false).map(column => fieldForEntityColumn(column)),
    ];

    const frame = new MutableDataFrame({
      refId,
      fields,
    });

    for (const node of nodes) {
      const primaryIpInterface = getPrimaryIpInterface(node);
      const primarySnmp = primaryIpInterface?.snmpInterface;

      frame.add({
        id: node.id,
        label: node.label,
        labelSource: node.labelSource?.label,
        foreignSource: node.foreignSource,
        foreignId: node.foreignId,
        'location.locationName': node.location,
        createTime: node.createTime,
        'parent.id': node.parent?.id,
        'parent.foreignSource': node.parent?.foreignSource,
        'parent.foreignId': node.parent?.foreignId,
        type: node.type?.toDisplayString(),
        sysObjectId: node.sysObjectId,
        sysName: node.sysName,
        sysDescription: node.sysDescription,
        sysLocation: node.sysLocation,
        sysContact: node.sysContact,
        netBiosName: node.netBiosName,
        netBiosDomain: node.netBiosDomain,
        operatingSystem: node.operatingSystem,
        lastCapsdPoll: node.lastCapsdPoll,
        /* 'ipInterface.snmpInterface.physAddr': primarySnmp.physAddr?.toString(), */
        'snmpInterface.ifIndex': primarySnmp?.ifIndex,
        'ipInterface.ipAddress': primaryIpInterface?.ipAddress?.correctForm(),
        /* 'ipInterface.ipHostname': primaryIpInterface?.ipHostname, */
        'category.name': node.categories?.map(category => category.name),
      });
    }

    // TODO: add any additional meta data required by panel plugins, as necessary

    return frame;
  }
}
