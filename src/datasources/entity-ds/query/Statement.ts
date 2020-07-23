import { Filter } from 'opennms-js-ts';

export class Statement {
  entityType: string;
  filter: Filter;

  static fromJson(queryJson: any): Statement {
    return new Statement(queryJson.entityType, Filter.fromJson(queryJson.filter));
  }

  constructor(entityType = 'alarm', filter = new Filter()) {
    this.entityType = entityType;
    this.filter = filter;
  }
}
