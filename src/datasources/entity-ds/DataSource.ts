import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { EntityDataSourceOptions, EntityQuery, defaultEntityQuery } from './types';

import { QueryStatement } from './query/QueryStatement';
import { getQueryStatementDisplayText } from './query/QueryDisplayText';

import { ClientDelegate } from '../../common/ClientDelegate';

export class DataSource extends DataSourceApi<EntityQuery, EntityDataSourceOptions> {
  opennmsClient: ClientDelegate;
  constructor(instanceSettings: DataSourceInstanceSettings<EntityDataSourceOptions>) {
    super(instanceSettings);
    this.opennmsClient = new ClientDelegate(instanceSettings);
  }

  getQueryDisplayText(query: EntityQuery): string {
    try {
      const { statement = defaultEntityQuery.statement } = query;
      return getQueryStatementDisplayText(QueryStatement.fromJson(statement));
    } catch (error) {
      return `ERROR: ${error}`;
    }
  }

  async query(options: DataQueryRequest<EntityQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const data = options.targets.map(target => {
      const query = defaults(target, defaultEntityQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'time', type: FieldType.time },
          { name: 'value', type: FieldType.number },
        ],
      });
      const duration = to - from;
      const step = duration / 1000;
      for (let t = 0; t < duration; t += step) {
        frame.add({ time: from + t, value: Math.sin((2 * Math.PI * t) / duration) });
      }
      return frame;
    });

    return { data };
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
