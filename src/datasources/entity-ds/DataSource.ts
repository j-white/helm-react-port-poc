import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';

import { Comparators, Filter, NestedRestriction, Restriction } from 'opennms-js-ts';

import { defaultEntityQuery } from './defaults';

import { EntityDataSourceOptions, EntityQuery } from './types';

import { getStatementDisplayText } from './query/QueryDisplayText';
import { Statement } from './query/Statement';

import { ClientDelegate } from 'common/ClientDelegate';
import AlarmEntity from './AlarmEntity';

import { sanitizeStatement } from './query/config/StatementConfig';
import NodeEntity from './NodeEntity';

export class DataSource extends DataSourceApi<EntityQuery, EntityDataSourceOptions> {
  opennmsClient: ClientDelegate;
  constructor(instanceSettings: DataSourceInstanceSettings<EntityDataSourceOptions>) {
    super(instanceSettings);
    this.opennmsClient = new ClientDelegate(instanceSettings);
  }

  getQueryDisplayText(query: EntityQuery): string {
    try {
      const statementConfig = query.statement ? query.statement : defaultEntityQuery.statement;
      const statement = Statement.fromJson(sanitizeStatement(statementConfig));
      return getStatementDisplayText(Statement.fromJson(statement));
    } catch (error) {
      return `ERROR: ${error}`;
    }
  }

  async query(options: DataQueryRequest<EntityQuery>): Promise<DataQueryResponse> {
    // const { range } = options;
    // const from = range!.from.valueOf();
    // const to = range!.to.valueOf();
    // const filter = options.filter || new Filter();

    const data = await Promise.all(
      options.targets.map(async target => {
        const statementConfig = target.statement ? target.statement : defaultEntityQuery.statement;
        const statement = Statement.fromJson(sanitizeStatement(statementConfig));
        console.log('statement (sanitized):', JSON.stringify(statement, null, 2));
        let entity;
        if (statement.entityType && statement.entityType === 'node') {
          entity = new NodeEntity(this.opennmsClient, this);
        } else {
          entity = new AlarmEntity(this.opennmsClient, this);
        }

        const clonedFilter = this.buildQuery(statement.filter, options);
        const returnData = await entity.query(clonedFilter);
        let frame = new MutableDataFrame({
          refId: returnData.type,
          fields: returnData.columns,
        });
        returnData.rows.forEach((row: any) => {
          frame.add(row);
        });
        return frame;
      })
    );
    return { data };
  }

  buildQuery(filter: any, options: any) {
    const clonedFilter = Filter.fromJson(filter);

    // TODO: Revisit if this is how this still works in Grafana 7 (or should we be applying the range above?)
    // Before replacing any variables, add a global time range restriction (which is hidden to the user)
    // This behavior should probably be _in_ the entity, but... ¯\_(ツ)_/¯
    if (options && options.enforceTimeRange) {
      if (!options.entity || options.entity.type === 'alarm') {
        clonedFilter.withAndRestriction(
          new NestedRestriction()
            .withAndRestriction(new Restriction('lastEventTime', Comparators.GE, '$range_from'))
            .withAndRestriction(new Restriction('lastEventTime', Comparators.LE, '$range_to'))
        );
      }
    }

    // Substitute $<variable> or [[variable]] in the restriction value
    // this.substitute(clonedFilter.clauses, options);
    return clonedFilter;
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
