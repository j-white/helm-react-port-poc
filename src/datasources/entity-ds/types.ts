import { DataQuery, DataSourceJsonData, KeyValue } from '@grafana/data';

import { Defaults } from '../../types';

export interface EntityQuery extends DataQuery {
  featuredAttributes?: boolean;
  statement: EntityQueryStatement;
}

type EntityQueryDefaults = Defaults<EntityQuery, 'featuredAttributes' | 'statement'>;

export const defaultEntityQuery: EntityQueryDefaults = {
  featuredAttributes: true,
  statement: {
    entityType: 'alarm',
  },
};

export interface EntityQueryStatement {
  entityType: EntityType;
  filter?: EntityQueryStatementFilter;
}

export type EntityType = 'alarm' | 'node';

export interface EntityQueryStatementFilter {
  clauses: EntityQueryStatementClause[];
  orderBy: EntityQueryStatementOrderBy[];
  limit: number;
}

export interface EntityQueryStatementClause {
  id: string;
  restriction: EntityQueryStatementRestriction | EntityQueryStatementNestedRestriction;
  operator: EntityQueryStatementOperator;
}

export interface EntityQueryStatementRestriction {
  attribute: string;
  comparator: EntityQueryStatementComparator;
  value?: any;
}

export type EntityQueryStatementComparatorType = 'EQ' | 'NE' | 'GT' | 'LT' | 'GE' | 'LE';

export interface EntityQueryStatementComparator {
  label: EntityQueryStatementComparatorType;
}

export interface EntityQueryStatementNestedRestriction {
  clauses: EntityQueryStatementClause[];
}

export type EntityQueryStatementOperatorType = 'AND' | 'OR';

export interface EntityQueryStatementOperator {
  label: EntityQueryStatementOperatorType;
}

export interface EntityQueryStatementOrderBy {
  id: string;
  attribute: string;
  order: EntityQueryStatementOrder;
}

export type EntityQueryStatementOrderType = 'ASC' | 'DESC';

export interface EntityQueryStatementOrder {
  label: EntityQueryStatementOrderType;
}

export interface EntityPropertiesResult {
  offset: number;
  count: number;
  totalCount: number;
  searchProperty: EntityProperty[];
}

export type EntityPropertyType = 'BOOLEAN' | 'FLOAT' | 'INTEGER' | 'IP_ADDRESS' | 'LONG' | 'STRING' | 'TIMESTAMP';

export interface EntityProperty {
  id: string;
  name: string;
  type: EntityPropertyType;
  orderBy: boolean;
  iplike: boolean;
  values?: KeyValue<string>;
}

export interface EntityAttributeOption {
  label: string;
  value: string;
  type: EntityPropertyType;
  orderBy: boolean;
  iplike: boolean;
  values?: KeyValue<string>;
}

/**
 * These are options configured for each DataSource instance
 */
export interface EntityDataSourceOptions extends DataSourceJsonData {
  grafanaUserField?: string;
  timeout?: number;
  useGrafanaUser?: boolean;
}

type EntityDataSourceOptionsDefaults = Defaults<EntityDataSourceOptions, 'grafanaUserField' | 'useGrafanaUser'>;

export const defaultEntityDataSourceOptions: EntityDataSourceOptionsDefaults = {
  grafanaUserField: 'login',
  useGrafanaUser: false,
};

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface EntitySecureJsonData {}
