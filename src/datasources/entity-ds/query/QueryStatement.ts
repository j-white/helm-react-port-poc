import { Filter, OrderBy } from 'opennms-js-ts';

export class QueryStatement {
  entityType: string;
  filter: Filter;
  orderBy: OrderBy[];
  limit: number;

  static fromJson(queryJson: any): QueryStatement {
    return new QueryStatement(
      queryJson.entityType,
      Filter.fromJson(queryJson.filter),
      (queryJson.orderBy || []).map((orderBy: any) => OrderBy.fromJson(orderBy)),
      queryJson.limit
    );
  }

  constructor(entityType = 'alarm', filter = new Filter(), orderBy = [], limit = 0) {
    this.entityType = entityType;
    this.filter = filter;
    this.orderBy = orderBy;
    this.limit = limit;
  }
}
