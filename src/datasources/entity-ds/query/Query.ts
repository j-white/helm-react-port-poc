import { Filter } from 'opennms/src/api/Filter';
import { OrderBy } from 'opennms/src/api/OrderBy';

export class Query {
  entityName: string;
  filter: Filter;
  orderBy: OrderBy[];
  limit: number;

  static fromJson(queryJson: string): Query {
    const parsed = JSON.parse(queryJson);
    return new Query(parsed.entityName, parsed.filter, parsed.orderBy, parsed.limit);
  }

  constructor(entityName = 'alarm', filter = new Filter(), orderBy = [], limit = 0) {
    this.entityName = entityName;
    this.filter = filter;
    this.orderBy = orderBy;
    this.limit = limit;
  }
}
