import { EntityColumn } from 'datasources/entity-ds/types';

export const columns: EntityColumn[] = [
  { text: 'ID', resource: 'id' },
  { text: 'Label', resource: 'label', featured: true },
  { text: 'Label Source', resource: 'labelSource' },
  { text: 'Foreign Source', resource: 'foreignSource', featured: true },
  { text: 'Foreign ID', resource: 'foreignId', featured: true },
  { text: 'Location', resource: 'location.locationName' },
  { text: 'Creation Time', resource: 'createTime', featured: true },
  { text: 'Parent ID', resource: 'parent.id' },
  { text: 'Parent Foreign Source', resource: 'parent.foreignSource' },
  { text: 'Parent Foreign ID', resource: 'parent.foreignId' },
  { text: 'Type', resource: 'type' },
  { text: 'SNMP sysObjectID', resource: 'sysObjectId' },
  { text: 'SNMP sysName', resource: 'sysName' },
  { text: 'SNMP sysDescription', resource: 'sysDescription' },
  { text: 'SNMP sysLocation', resource: 'sysLocation' },
  { text: 'SNMP sysContact', resource: 'sysContact' },
  { text: 'NETBIOS/SMB Name', resource: 'netBiosName' },
  { text: 'NETBIOS/SMB Domain', resource: 'netBiosDomain' },
  { text: 'Operating System', resource: 'operatingSystem' },
  { text: 'Last Poll Time', resource: 'lastCapsdPoll' },
  /* { text: 'Primary SNMP Physical Address', resource: 'ipInterface.snmpInterface.physAddr' }, */
  { text: 'Primary SNMP ifIndex', resource: 'snmpInterface.ifIndex' },
  { text: 'Primary IP Interface', resource: 'ipInterface.ipAddress' },
  /* { text: 'Primary IP Hostname', resource: 'ipInterface.ipHostname' }, */
  { text: 'Categories', resource: 'category.name', featured: true },
];
