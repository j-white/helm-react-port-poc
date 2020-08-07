import { DataQuery, DataSourceJsonData, KeyValue } from '@grafana/data';

// ---
// Entity query and its constituent types
// ---

export interface EntityQuery extends DataQuery {
  featuredAttributes?: boolean;
  statement: StatementConfig;
}

export type EntityType = 'alarm' | 'node';

export interface StatementConfig {
  entityType: EntityType;
  filter?: FilterConfig;
}

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
  value: string;
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
  // NOTE: named "label" to align with opennms-js Restriction JSON deserialization logic
  // NOTE: corresponds to OperatorConfig value (rather than human-readable OperatorConfig label)
  label: OperatorType;
}

export interface OrderByConfig {
  id: string;
  attribute: string;
  order: OrderConfig;
}

export type OrderType = 'ASC' | 'DESC';

export interface OrderConfig {
  // NOTE: named "label" to align with opennms-js OrderBy JSON deserialization logic
  label: OrderType;
}

// ---
// Options tailored for use in Grafana UI Select components
// ---

export interface RestrictionAttributeOption {
  attribute: string;
}

export interface RestrictionComparatorOption {
  comparator: ComparatorType;
}

export interface RestrictionAttributeValueOption {
  label: string;
  value: string;
}

// remove?

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
  values?: KeyValue<string>;
}

export interface EntityAttributeValueOption {
  label: string;
  value: string;
}

export interface EntityOrderAttributeOption {
  label: string;
  value: string;
}

// alarm table and featured attribute metadata

export interface EntityColumn {
  text: string;
  resource?: string;
  featured?: boolean;
  visible?: boolean;
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
