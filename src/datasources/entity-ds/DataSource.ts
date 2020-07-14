import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { EntityQuery, EntityDataSourceOptions, defaultEntityQuery } from './types';

import { Query } from './query/Query';
import { getQueryDisplayText } from './query/QueryDisplayText';

export const entityTypes = [
  {
    label: 'Alarms',
    value: 'alarm',
    queryFunction: 'alarms',
  },
  {
    label: 'Nodes',
    value: 'node',
    queryFunction: 'nodes',
  },
];

export class DataSource extends DataSourceApi<EntityQuery, EntityDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<EntityDataSourceOptions>) {
    super(instanceSettings);
  }

  getQueryDisplayText(query: EntityQuery): string {
    try {
      const { queryJson = defaultEntityQuery.queryJson } = query;
      return getQueryDisplayText(Query.fromJson(queryJson));
    } catch (error) {
      return `ERROR: ${error}`;
    }
  }

  async query(options: DataQueryRequest<EntityQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map(target => {
      const query = defaults(target, defaultEntityQuery);
      return new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [query.constant, query.constant], type: FieldType.number },
        ],
      });
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
