import { Filter } from 'opennms-js-ts';

export class QueryStatement {
  entityType: string;
  filter: Filter;
  limit: number;

  static fromJson(queryJson: any): QueryStatement {
    return new QueryStatement(queryJson.entityType, Filter.fromJson(queryJson.filter), queryJson.limit);
  }

  constructor(entityType = 'alarm', filter = new Filter(), limit = 0) {
    this.entityType = entityType;
    this.filter = filter;
    this.limit = limit;
  }
}
