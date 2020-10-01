import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  TimeRange,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';

import { Comparators, Filter, NestedRestriction, Restriction } from 'opennms-js-ts';

import { defaultEntityQuery } from './defaults';

import { EntityDataSourceOptions, EntityQuery, EntityType } from './types';

import { getStatementDisplayText } from './query/QueryDisplayText';
import { Statement } from './query/Statement';

import { ClientDelegate } from 'common/ClientDelegate';

import { prepareStatement, PrepareStatementOptions } from './query/config/StatementConfig';

import { AlarmEntityService } from './entity/service/AlarmEntityService';
import { EntityService } from './entity/service/EntityService';
import { NodeEntityService } from './entity/service/NodeEntityService';

export class DataSource extends DataSourceApi<EntityQuery, EntityDataSourceOptions> {
  opennmsClient: ClientDelegate;
  constructor(instanceSettings: DataSourceInstanceSettings<EntityDataSourceOptions>) {
    super(instanceSettings);
    this.opennmsClient = new ClientDelegate(instanceSettings);
  }

  getEntityService(entityType: EntityType): EntityService {
    switch (entityType) {
      case 'alarm':
        return new AlarmEntityService(this);
      case 'node':
        return new NodeEntityService(this);
    }
  }

  getQueryDisplayText(query: EntityQuery): string {
    try {
      const statementConfig = query.statement ? query.statement : defaultEntityQuery.statement;
      const statementOptions: PrepareStatementOptions = {
        fromAttributeAlias: (alias: string) => alias,
        interpolateVariables: (value: string) => value,
      };
      const statement = Statement.fromJson(prepareStatement(statementConfig, statementOptions));
      return getStatementDisplayText(Statement.fromJson(statement));
    } catch (error) {
      return `ERROR: ${error}`;
    }
  }

  async query(options: DataQueryRequest<EntityQuery>): Promise<DataQueryResponse> {
    const data = await Promise.all(
      options.targets.map(async target => {
        const statementConfig = target.statement ?? defaultEntityQuery.statement;
        const entityType = statementConfig.entityType;
        const entityService = this.getEntityService(entityType);

        const statementOptions: PrepareStatementOptions = {
          fromAttributeAlias: (alias: string) => entityService.fromAttributeAlias(alias),
          interpolateVariables: (value: string) => getTemplateSrv().replace(value, options.scopedVars),
        };
        const statement = Statement.fromJson(prepareStatement(statementConfig, statementOptions));
        console.log('statement (prepared):', JSON.stringify(statement, null, 2));

        const filter = this.applyRange(entityType, statement.filter, options.range);
        return entityService.query(target.refId, filter);
      })
    );
    return { data };
  }

  applyRange(entityType: EntityType, filter: any, range: TimeRange) {
    switch (entityType) {
      case 'alarm':
        const clonedFilter = Filter.fromJson(filter);
        clonedFilter.withAndRestriction(
          new NestedRestriction()
            .withAndRestriction(new Restriction('lastEventTime', Comparators.GE, range.from.valueOf()))
            .withAndRestriction(new Restriction('lastEventTime', Comparators.LE, range.to.valueOf()))
        );
        return clonedFilter;
      default:
        return filter;
    }
  }

  async testDatasource() {
    // Implement a health check for your data source.
    const metadata = await this.opennmsClient.getClient();
    try {
      if (metadata) {
        return {
          status: 'success',
          message: 'Data source is working',
          title: 'Success',
        };
      } else {
        return {
          status: 'danger',
          message: 'OpenNMS provided a response, but no metadata was found.',
          title: 'Unexpected Response',
        };
      }
    } catch (e) {
      if (e.message === 'Unsupported Version') {
        return {
          status: 'danger',
          message:
            'The OpenNMS version you are trying to connect to is not supported. ' +
            'OpenNMS Horizon version >= 20.1.0 or OpenNMS Meridian version >= 2017.1.0 is required.',
          title: e.message,
        };
      } else {
        throw e;
      }
    }
  }
}
