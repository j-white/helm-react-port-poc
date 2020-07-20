import React from 'react';
import { css } from 'emotion';
import { v4 as uuidv4 } from 'uuid';

import { Button, Icon, InlineFormLabel, Input, LegacyForms, Select, Tooltip } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';

import {
  defaultEntityQuery,
  EntityAttributeOption,
  EntityDataSourceOptions,
  EntityPropertiesResult,
  EntityQuery,
  EntityQueryStatement,
  EntityQueryStatementClause,
  EntityType,
  EntityQueryStatementOrderBy,
} from './types';

import { DataSource } from './DataSource';

import { ClauseEditor } from './query/editor/ClauseEditor';
import { OrderByEditor } from './query/editor/OrderByEditor';
import { FieldInputWithActions } from 'common/FieldInputWithActions';

const { Switch } = LegacyForms;

// TODO: temporarily inlined data - fetch via datasource, once possible
const properties: EntityPropertiesResult = {
  offset: 0,
  count: 173,
  totalCount: 173,
  searchProperty: [
    {
      id: 'affectedNodeCount',
      name: 'affectedNodeCount',
      type: 'INTEGER',
      orderBy: false,
      iplike: false,
    },
    {
      id: 'alarmAckTime',
      name: 'Acknowledged Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'alarmAckUser',
      name: 'Acknowledging User',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'alarmType',
      name: 'Alarm Type',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
      values: {
        '1': 'Problem',
        '2': 'Resolution',
      },
    },
    {
      id: 'applicationDN',
      name: 'Application DN',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'clearKey',
      name: 'Clear Key',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'counter',
      name: 'Event Counter',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'description',
      name: 'Description',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'firstAutomationTime',
      name: 'First Automation Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'firstEventTime',
      name: 'First Event Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'id',
      name: 'ID',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'ifIndex',
      name: 'SNMP Interface Index',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'ipAddr',
      name: 'IP Address',
      type: 'IP_ADDRESS',
      orderBy: false,
      iplike: true,
    },
    {
      id: 'isAcknowledged',
      name: 'Is Acknowledged',
      type: 'BOOLEAN',
      orderBy: false,
      iplike: false,
      values: {
        '0': 'FALSE',
        '1': 'TRUE',
      },
    },
    {
      id: 'isInSituation',
      name: 'Is in a Situation',
      type: 'BOOLEAN',
      orderBy: false,
      iplike: false,
      values: {
        '0': 'FALSE',
        '1': 'TRUE',
      },
    },
    {
      id: 'isSituation',
      name: 'Is Situation',
      type: 'BOOLEAN',
      orderBy: false,
      iplike: false,
      values: {
        '0': 'FALSE',
        '1': 'TRUE',
      },
    },
    {
      id: 'lastAutomationTime',
      name: 'Last Automation Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEventTime',
      name: 'Last Event Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'logMsg',
      name: 'Log Message',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'managedObjectInstance',
      name: 'Managed Object Instance',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'managedObjectType',
      name: 'Managed Object Type',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'mouseOverText',
      name: 'Mouseover Text',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'operInstruct',
      name: 'Operator Instructions',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'ossPrimaryKey',
      name: 'OSS Primary Key',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'qosAlarmState',
      name: 'QoS Alarm State',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'reductionKey',
      name: 'Reduction Key',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'severity',
      name: 'Severity',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
      values: {
        '1': 'Indeterminate',
        '2': 'Cleared',
        '3': 'Normal',
        '4': 'Warning',
        '5': 'Minor',
        '6': 'Major',
        '7': 'Critical',
      },
    },
    {
      id: 'situationAlarmCount',
      name: 'situationAlarmCount',
      type: 'INTEGER',
      orderBy: false,
      iplike: false,
    },
    {
      id: 'suppressedTime',
      name: 'Suppressed Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'suppressedUntil',
      name: 'Suppressed Until',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'suppressedUser',
      name: 'Suppressed User',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'uei',
      name: 'UEI',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'x733AlarmType',
      name: 'X.733 Alarm Type',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'x733ProbableCause',
      name: 'X.733 Probable Cause',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.additionalhardware',
      name: 'Asset: Additional Hardware',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.admin',
      name: 'Asset: Admin',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.assetNumber',
      name: 'Asset: Asset Number',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.autoenable',
      name: 'Asset: Auto-enable',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.building',
      name: 'Asset: Building',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.category',
      name: 'Asset: Category',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.circuitId',
      name: 'Asset: Circuit ID',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.comment',
      name: 'Asset: Comment',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.connection',
      name: 'Asset: Connection',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.cpu',
      name: 'Asset: CPU',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.dateInstalled',
      name: 'Asset: Date Installed',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.department',
      name: 'Asset: Department',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.description',
      name: 'Asset: Description',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.displayCategory',
      name: 'Asset: Display Category',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.division',
      name: 'Asset: Division',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.enable',
      name: 'Asset: Enable',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.floor',
      name: 'Asset: Floor',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.hdd1',
      name: 'Asset: HDD 1',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.hdd2',
      name: 'Asset: HDD 2',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.hdd3',
      name: 'Asset: HDD 3',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.hdd4',
      name: 'Asset: HDD 4',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.hdd5',
      name: 'Asset: HDD 5',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.hdd6',
      name: 'Asset: HDD 6',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.id',
      name: 'Asset: ID',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.inputpower',
      name: 'Asset: Input Power',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.lastModifiedBy',
      name: 'Asset: Last Modified By',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.lastModifiedDate',
      name: 'Asset: Last Modified Date',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.lease',
      name: 'Asset: Lease',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.leaseExpires',
      name: 'Asset: Lease Expires',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.maintContractExpiration',
      name: 'Asset: Maintenance Contract Expiration',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.maintcontract',
      name: 'Asset: Maintenance Contract',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.managedObjectInstance',
      name: 'Asset: Managed Object Instance',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.managedObjectType',
      name: 'Asset: Managed Object Type',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.manufacturer',
      name: 'Asset: Manufacturer',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.modelNumber',
      name: 'Asset: Model Number',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.notifyCategory',
      name: 'Asset: Notify Category',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.numpowersupplies',
      name: 'Asset: Number of Power Supplies',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.operatingSystem',
      name: 'Asset: Operating System',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.password',
      name: 'Asset: Password',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.pollerCategory',
      name: 'Asset: Poller Category',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.port',
      name: 'Asset: Port',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.rack',
      name: 'Asset: Rack',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.rackunitheight',
      name: 'Asset: Rack Unit Height',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.ram',
      name: 'Asset: RAM',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.region',
      name: 'Asset: Region',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.room',
      name: 'Asset: Room',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.serialNumber',
      name: 'Asset: Serial Number',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.slot',
      name: 'Asset: Slot',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.snmpcommunity',
      name: 'Asset: SNMP Community',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.storagectrl',
      name: 'Asset: Storage Controller',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.supportPhone',
      name: 'Asset: Support Phone',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.thresholdCategory',
      name: 'Asset: Threshold Category',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.username',
      name: 'Asset: Username',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vendor',
      name: 'Asset: Vendor',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vendorAssetNumber',
      name: 'Asset: Vendor Asset Number',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vendorFax',
      name: 'Asset: Vendor Fax',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vendorPhone',
      name: 'Asset: Vendor Phone',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vmwareManagedEntityType',
      name: 'Asset: VMware Managed Entity Type',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vmwareManagedObjectId',
      name: 'Asset: VMware Managed Object ID',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vmwareManagementServer',
      name: 'Asset: VMware Management Server',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vmwareState',
      name: 'Asset: VMware State',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'assetRecord.vmwareTopologyInfo',
      name: 'Asset: VMware Topology Information',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'category.description',
      name: 'Category: Description',
      type: 'STRING',
      orderBy: false,
      iplike: false,
    },
    {
      id: 'category.id',
      name: 'Category: ID',
      type: 'INTEGER',
      orderBy: false,
      iplike: false,
    },
    {
      id: 'category.name',
      name: 'Category: Name',
      type: 'STRING',
      orderBy: false,
      iplike: false,
    },
    {
      id: 'distPoller.id',
      name: 'Monitoring System: ID',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'distPoller.label',
      name: 'Monitoring System: Label',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'distPoller.lastUpdated',
      name: 'Monitoring System: Last Updated',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'distPoller.location',
      name: 'Monitoring System: Monitoring Location',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'eventParameter.name',
      name: 'Event Parameter: Name',
      type: 'STRING',
      orderBy: false,
      iplike: false,
    },
    {
      id: 'eventParameter.type',
      name: 'Event Parameter: Type',
      type: 'STRING',
      orderBy: false,
      iplike: false,
    },
    {
      id: 'eventParameter.value',
      name: 'Event Parameter: Value',
      type: 'STRING',
      orderBy: false,
      iplike: false,
    },
    {
      id: 'ipInterface.id',
      name: 'IP Interface: ID',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'ipInterface.ipAddress',
      name: 'IP Interface: IP Address',
      type: 'IP_ADDRESS',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'ipInterface.ipHostName',
      name: 'IP Interface: Hostname',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'ipInterface.ipLastCapsdPoll',
      name: 'IP Interface: Last Provisioning Scan',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'ipInterface.isManaged',
      name: 'IP Interface: Management Status',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'ipInterface.netMask',
      name: 'IP Interface: Network Mask',
      type: 'IP_ADDRESS',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventTTicketState',
      name: 'Last Event: Trouble Ticket State',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
      values: {
        '0': 'Off',
        '1': 'On',
      },
    },
    {
      id: 'lastEvent.eventDisplay',
      name: 'Last Event: Display',
      type: 'STRING',
      orderBy: true,
      iplike: false,
      values: {
        Y: 'Yes',
        N: 'No',
      },
    },
    {
      id: 'lastEvent.eventSource',
      name: 'Last Event: Source',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventMouseOverText',
      name: 'Last Event: Mouseover Text',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventSnmp',
      name: 'Last Event: SNMP',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventLogMsg',
      name: 'Last Event: Log Message',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventUei',
      name: 'Last Event: UEI',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventPathOutage',
      name: 'Last Event: Path Outage',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventAckUser',
      name: 'Last Event: Acknowledging User',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventForward',
      name: 'Last Event: Forward',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventTTicket',
      name: 'Last Event: Trouble Ticket ID',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.ifIndex',
      name: 'Last Event: ifIndex',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventCreateTime',
      name: 'Last Event: Creation Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventDescr',
      name: 'Last Event: Description',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventCorrelation',
      name: 'Last Event: Correlation',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventSnmpHost',
      name: 'Last Event: SNMP Host',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventAutoAction',
      name: 'Last Event: Autoaction',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventOperAction',
      name: 'Last Event: Operator Action',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.ipAddr',
      name: 'Last Event: IP Address',
      type: 'IP_ADDRESS',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventLog',
      name: 'Last Event: Log',
      type: 'STRING',
      orderBy: true,
      iplike: false,
      values: {
        Y: 'Yes',
        N: 'No',
      },
    },
    {
      id: 'lastEvent.eventAckTime',
      name: 'Last Event: Acknowledged Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventTime',
      name: 'Last Event: Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventOperActionMenuText',
      name: 'Last Event: Operator Action Menu Text',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventSeverity',
      name: 'Last Event: Severity',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
      values: {
        '1': 'Indeterminate',
        '2': 'Cleared',
        '3': 'Normal',
        '4': 'Warning',
        '5': 'Minor',
        '6': 'Major',
        '7': 'Critical',
      },
    },
    {
      id: 'lastEvent.eventNotification',
      name: 'Last Event: Notification',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventLogGroup',
      name: 'Last Event: Log Group',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.id',
      name: 'Last Event: ID',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventOperInstruct',
      name: 'Last Event: Operator Instructions',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventHost',
      name: 'Last Event: Host',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'lastEvent.eventSuppressedCount',
      name: 'Last Event: Suppressed Count',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'location.geolocation',
      name: 'Location: Geographic Address',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'location.latitude',
      name: 'Location: Latitude',
      type: 'FLOAT',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'location.locationName',
      name: 'Location: ID',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'location.longitude',
      name: 'Location: Longitude',
      type: 'FLOAT',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'location.monitoringArea',
      name: 'Location: Monitoring Area',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'location.priority',
      name: 'Location: UI Priority',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.createTime',
      name: 'Node: Creation Time',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.foreignId',
      name: 'Node: Foreign ID',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.foreignSource',
      name: 'Node: Foreign Source',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.id',
      name: 'Node: ID',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.label',
      name: 'Node: Label',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.labelSource',
      name: 'Node: Label Source',
      type: 'STRING',
      orderBy: true,
      iplike: false,
      values: {
        A: 'IP Address',
        H: 'Hostname',
        N: 'NetBIOS',
        S: 'SNMP sysName',
        ' ': 'Unknown',
        U: 'User-Defined',
      },
    },
    {
      id: 'node.lastCapsdPoll',
      name: 'Node: Last Provisioning Scan',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.netBiosDomain',
      name: 'Node: Windows NetBIOS Domain',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.netBiosName',
      name: 'Node: Windows NetBIOS Name',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.operatingSystem',
      name: 'Node: Operating System',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.sysContact',
      name: 'Node: SNMP sysContact',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.sysDescription',
      name: 'Node: SNMP sysDescription',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.sysLocation',
      name: 'Node: SNMP sysLocation',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.sysName',
      name: 'Node: SNMP sysName',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.sysObjectId',
      name: 'Node: SNMP sysObjectId',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'node.type',
      name: 'Node: Type',
      type: 'STRING',
      orderBy: true,
      iplike: false,
      values: {
        A: 'Active',
        D: 'Deleted',
        ' ': 'Unknown',
      },
    },
    {
      id: 'serviceType.id',
      name: 'Service: ID',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'serviceType.name',
      name: 'Service: Service Name',
      type: 'STRING',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'snmpInterface.id',
      name: 'SNMP Interface: ID',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'snmpInterface.ifAdminStatus',
      name: 'SNMP Interface: Admin Status',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'snmpInterface.ifIndex',
      name: 'SNMP Interface: Interface Index',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'snmpInterface.ifOperStatus',
      name: 'SNMP Interface: Operational Status',
      type: 'INTEGER',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'snmpInterface.ifSpeed',
      name: 'SNMP Interface: Interface Speed (Bits per second)',
      type: 'LONG',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'snmpInterface.lastCapsdPoll',
      name: 'SNMP Interface: Last Provisioning Scan',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
    {
      id: 'snmpInterface.lastSnmpPoll',
      name: 'SNMP Interface: Last SNMP Interface Poll',
      type: 'TIMESTAMP',
      orderBy: true,
      iplike: false,
    },
  ],
};

// TODO: move this transformation into datasource fetching logic
const attributeOptions: EntityAttributeOption[] = properties.searchProperty.map(
  ({ id, name, type, orderBy, iplike, values }) => ({
    label: name,
    value: id,
    type,
    orderBy,
    iplike,
    values,
  })
);

// ---

interface EntityTypeOption {
  label: string;
  value: EntityType;
}

const entityTypeOptions: EntityTypeOption[] = [
  {
    label: 'Alarms',
    value: 'alarm',
  },
  {
    label: 'Nodes',
    value: 'node',
  },
];

const withWarningColor = css`
  color: rgb(229, 189, 28);
`;

const orderByTooltop = (
  <>
    <p>Note: "ORDER BY" only affects the data as queried from OpenNMS.</p>
    <p>
      Sorting in the table will override this order, but it can be useful to sort at query-time for queries with a
      'Limit' set.
    </p>
  </>
);

const limitTooltip = 'Limit the number of items returned (0=unlimited)';

const limitWarningTooltip = (
  <>
    <b>Note:</b> When using limits, column sorting only applies to the returned results.
  </>
);

const featuredAttributesTooltip = 'Toggles whether featured attributes or all attributes are shown';

type Props = QueryEditorProps<DataSource, EntityQuery, EntityDataSourceOptions>;

function createEmptyClause(): EntityQueryStatementClause {
  return {
    id: uuidv4(),
    restriction: {
      attribute: '',
      comparator: { label: 'EQ' },
      value: '',
    },
    operator: { label: 'AND' },
  };
}

function createEmptyOrderBy(): EntityQueryStatementOrderBy {
  return {
    id: uuidv4(),
    attribute: '',
    order: { label: 'ASC' },
  };
}

function createDefaultStatement(): EntityQueryStatement {
  console.log('called');
  return {
    entityType: 'alarm',
    filter: {
      clauses: [createEmptyClause()],
      orderBy: [createEmptyOrderBy()],
      limit: 0,
    },
  };
}

interface Identifiable {
  id: string;
}

function matchById(identifable: Identifiable): (candidate: Identifiable) => boolean {
  return candidate => candidate.id === identifable.id;
}

export const QueryEditor: React.FC<Props> = ({ query, onChange, onRunQuery }) => {
  const { featuredAttributes = defaultEntityQuery.featuredAttributes, statement = createDefaultStatement() } = query;

  console.log('query:', JSON.stringify(query, null, 2));

  const { entityType, filter } = statement;
  const { clauses, limit, orderBy } = filter;

  const handleEntityTypeChange = (entityType: EntityType) => {
    onChange({ ...query, statement: { ...statement, entityType } });
    onRunQuery();
  };

  const handleFilterClauseChange = (clause: EntityQueryStatementClause) => {
    const index = clauses.findIndex(matchById(clause));
    if (index < 0) {
      throw new Error('Clause not found.');
    }
    onChange({
      ...query,
      statement: {
        ...statement,
        filter: {
          ...filter,
          clauses: Object.assign([...clauses], {
            [index]: clause,
          }),
        },
      },
    });
  };

  // TODO: debounce 250ms? (or is this handled in the DataSourceAPI?)
  const handleLimitChange = (limit: number) => {
    onChange({ ...query, statement: { ...statement, filter: { ...filter, limit } } });
    onRunQuery();
  };

  const handleOrderByChange = (o: EntityQueryStatementOrderBy) => {
    const index = orderBy.findIndex(matchById(o));
    if (index < 0) {
      throw new Error('Clause not found.');
    }
    onChange({
      ...query,
      statement: {
        ...statement,
        filter: {
          ...filter,
          orderBy: Object.assign([...orderBy], {
            [index]: o,
          }),
        },
      },
    });
  };

  const handleFeaturedAttributesChange = (featuredAttributes: boolean) => {
    onChange({ ...query, featuredAttributes });
    onRunQuery();
  };

  return (
    <>
      <div className="gf-form-group">
        <div className="gf-form">
          <div className="gf-form-inline">
            <InlineFormLabel className="query-keyword" width={8}>
              SELECT
            </InlineFormLabel>
            <Select
              options={entityTypeOptions}
              value={entityType}
              width={12}
              onChange={v => v.value && handleEntityTypeChange(v.value)}
            />
          </div>
        </div>
        {clauses.map((clause, index) => (
          <ClauseEditor
            key={clause.id}
            clause={clause}
            index={index}
            attributeOptions={attributeOptions}
            onChange={handleFilterClauseChange}
          />
        ))}
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" tooltip={orderByTooltop} width={8}>
            ORDER BY
          </InlineFormLabel>
          <FieldInputWithActions
            actions={
              <>
                <Button variant="secondary" size="xs" title="Add attribute" onClick={() => {}}>
                  <Icon name="plus" />
                </Button>
                <Button variant="secondary" size="xs" onClick={() => {}}>
                  <Icon name="trash-alt" title="Remove attribute" />
                </Button>
              </>
            }
          >
            {orderBy.map((orderBy, index) => (
              <OrderByEditor
                key={orderBy.id}
                attributeOptions={attributeOptions}
                orderBy={orderBy}
                onChange={handleOrderByChange}
              />
            ))}
          </FieldInputWithActions>
        </div>
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" tooltip={limitTooltip} width={8}>
            LIMIT
          </InlineFormLabel>
          <Input
            min={0}
            step={1}
            type="number"
            value={limit + ''} // https://github.com/facebook/react/issues/9402
            width={8}
            onChange={e => handleLimitChange(Number(e.currentTarget.value))}
          />
          {limit > 0 && (
            <InlineFormLabel width="auto">
              <Tooltip content={limitWarningTooltip}>
                <Icon className={withWarningColor} name="exclamation-triangle" size="lg" />
              </Tooltip>
            </InlineFormLabel>
          )}
        </div>
      </div>
      <div className="gf-form-group">
        <div className="gf-form">
          <Switch
            checked={featuredAttributes}
            label="Featured attributes"
            labelClass="width-11"
            switchClass="max-width-6"
            tooltip={featuredAttributesTooltip}
            onChange={e => handleFeaturedAttributesChange(Boolean(e.currentTarget.checked))}
          />
        </div>
      </div>
    </>
  );
};
