import { DataQuery, DataSourceJsonData, KeyValue } from '@grafana/data';

export interface EntityQuery extends DataQuery {
  featuredAttributes?: boolean;
  statement: StatementConfig;
}

export interface StatementConfig {
  entityType: EntityType;
  filter?: FilterConfig;
}

export type EntityType = 'alarm' | 'node';

export interface FilterConfig {
  clauses: ClauseConfig[];
  orderBy: OrderByConfig[];
  limit: number;
}

export interface ClauseConfig {
  id: string;
  operator: OperatorConfig;
  restriction: RestrictionConfig | NestedRestrictionConfig;
}

export interface RestrictionConfig {
  attribute: string;
  comparator: ComparatorConfig;
  value?: any;
}

export type ComparatorType = 'EQ' | 'NE' | 'GT' | 'LT' | 'GE' | 'LE';

export interface ComparatorConfig {
  label: ComparatorType;
}

export interface NestedRestrictionConfig {
  clauses: ClauseConfig[];
}

export type OperatorType = 'AND' | 'OR';

export interface OperatorConfig {
  label: OperatorType;
}

export interface OrderByConfig {
  id: string;
  attribute: string;
  order: OrderConfig;
}

export type OrderType = 'ASC' | 'DESC';

export interface OrderConfig {
  label: OrderType;
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

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface EntitySecureJsonData {}
