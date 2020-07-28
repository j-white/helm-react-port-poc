import _ from 'lodash';

import Entity from './Entity';
// import { AttributeMapping } from './mapping/AttributeMapping';
import { Filter } from 'opennms-js-ts';

const COLUMNS = Object.freeze([
  { name: 'ID', resource: 'id' },
  { name: 'Label', resource: 'label', featured: true },
  { name: 'Label Source', resource: 'labelSource' },
  { name: 'Foreign Source', resource: 'foreignSource', featured: true },
  { name: 'Foreign ID', resource: 'foreignId', featured: true },
  { name: 'Location', resource: 'location.locationName' },
  { name: 'Creation Time', resource: 'createTime', featured: true },
  { name: 'Parent ID', resource: 'parent.id' },
  { name: 'Parent Foreign Source', resource: 'parent.foreignSource' },
  { name: 'Parent Foreign ID', resource: 'parent.foreignId' },
  { name: 'Type', resource: 'type' },
  { name: 'SNMP sysObjectID', resource: 'sysObjectId' },
  { name: 'SNMP sysName', resource: 'sysName' },
  { name: 'SNMP sysDescription', resource: 'sysDescription' },
  { name: 'SNMP sysLocation', resource: 'sysLocation' },
  { name: 'SNMP sysContact', resource: 'sysContact' },
  { name: 'NETBIOS/SMB Name', resource: 'netBiosName' },
  { name: 'NETBIOS/SMB Domain', resource: 'netBiosDomain' },
  { name: 'Operating System', resource: 'operatingSystem' },
  { name: 'Last Poll Time', resource: 'lastCapsdPoll' },
  /* { name: 'Primary SNMP Physical Address', resource: 'ipInterface.snmpInterface.physAddr' }, */
  { name: 'Primary SNMP ifIndex', resource: 'snmpInterface.ifIndex' },
  { name: 'Primary IP Interface', resource: 'ipInterface.ipAddress' },
  /* { name: 'Primary IP Hostname', resource: 'ipInterface.ipHostname' }, */
  { name: 'Categories', resource: 'category.name', featured: true },
  { name: 'Data Source' },
]);

// const mapping = new AttributeMapping({
//   category: 'category.name',
//   categories: 'category.name',
//   'categories.name': 'category.name',
//   ifIndex: 'snmpInterface.ifIndex',
//   ipAddr: 'ipInterface.ipAddress',
//   ipAddress: 'ipInterface.ipAddress',
//   ipHostname: 'ipInterface.ipHostname',
//   location: 'location.locationName',
//   parentId: 'parent.id',
//   parentForeignSource: 'parent.foreignSource',
//   parentForeignId: 'parent.foreindId',
// });

export default class NodeEntity extends Entity {
  type: string;
  name: string | undefined;
  datasource: any;
  client: any;
  columns: any;
  constructor(client: any, datasource: any) {
    super(client, datasource);
    this.type = 'node';
    this.columns = Array.from(COLUMNS);
  }

  //   getAttributeMapping() {
  //     return mapping;
  //   }

  getColumns() {
    return this.columns;
  }

  async query(filter: Filter) {
    const self = this;

    const nodes = await this.client.findNodes(filter);

    let getPrimary = (node: { ipInterfaces: any[] }) => {
      if (node && node.ipInterfaces) {
        let primary = node.ipInterfaces.filter((iface: { snmpPrimary: { isPrimary: () => any } }) => {
          return iface.snmpPrimary && iface.snmpPrimary.isPrimary();
        })[0];
        return primary;
      }
      return undefined;
    };

    const rows = _.map(nodes, node => {
      const primaryIpInterface = getPrimary(node);
      const primarySnmp = primaryIpInterface && primaryIpInterface.snmpInterface;

      let row = {
        ID: node.id,
        Label: node.label,
        'Label Source': node.labelSource,
        'Foreign Source': node.foreignSource,
        'Foreign ID': node.foreignId,
        Location: node.location,
        'Creation Time': node.createTime,
        'Parent ID': node.parent ? node.parent.id : undefined,
        'Parent Foreign Source': node.parent ? node.parent.foreignSource : undefined,
        'Parent Foreign ID': node.parent ? node.parent.foreignId : undefined,
        Type: node.type ? node.type.toDisplayString() : undefined,
        'SNMP sysObjectID': node.sysObjectId,
        'SNMP sysName': node.sysName,
        'SNMP sysDescription': node.sysDescription,
        'SNMP sysLocation': node.sysLocation,
        'SNMP sysContact': node.sysContact,
        'NETBIOS/SMB Name': node.netBiosName,
        'NETBIOS/SMB Domain': node.netBiosDomain,
        'Operating System': node.operatingSystem,
        'Last Poll Time': node.lastCapsdPoll,
        /* primarySnmp && primarySnmp.physAddr ? primarySnmp.physAddr.toString() : undefined, */
        'Primary SNMP ifIndex': primarySnmp ? primarySnmp.ifIndex : undefined,
        'Primary IP Interface':
          primaryIpInterface && primaryIpInterface.ipAddress ? primaryIpInterface.ipAddress.correctForm() : undefined,
        /* primaryIpInterface && primaryIpInterface.ipHostname ? primaryIpInterface.ipHostname : undefined, */
        Categories: node.categories ? node.categories.map((cat: { name: any }) => cat.name) : undefined,

        // Data Source
        'Data Source': self.name,
      };
      return row;
    });

    const metas = _.map(nodes, node => {
      return {
        // Store the node for easy access by the panels
        node: node,
        // Store the entity type
        type: 'node',
        // Store the name of the data-source as part of the data so that
        // the panel can grab an instance of the DS to perform actions
        // on the nodes, if necessary
        source: this.datasource.name,
      };
    });

    return {
      columns: this.columns.filter((column: { visible: boolean }) => column.visible !== false),
      meta: {
        entity_metadata: metas,
      },
      rows: rows,
      type: 'table',
    };
  }
}
