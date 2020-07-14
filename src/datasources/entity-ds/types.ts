import { DataQuery, DataSourceJsonData } from '@grafana/data';

import { Defaults } from '../../types';

export interface EntityQuery extends DataQuery {
  featuredAttributes?: boolean;
  statement?: EntityQueryStatement;
}

type EntityQueryDefaults = Defaults<EntityQuery, 'featuredAttributes' | 'statement'>;

export const defaultEntityQuery: EntityQueryDefaults = {
  featuredAttributes: true,
  statement: {
    entityType: 'alarm',
    filter: {
      clauses: [],
      orderBy: [],
      limit: 0,
    },
  },
};

export interface EntityQueryStatement {
  entityType: EntityType;
  filter: EntityQueryStatementFilter;
}

export type EntityType = 'alarm' | 'node';

export interface EntityQueryStatementFilter {
  clauses: EntityQueryStatementClause[];
  orderBy: EntityQueryStatementOrderBy[];
  limit: number;
}

export interface EntityQueryStatementClause {
  restriction: EntityQueryStatementRestriction | EntityQueryStatementNestedRestriction;
  operator: EntityQueryStatementOperator;
}

export interface EntityQueryStatementRestriction {
  attribute: string;
  comparator: EntityQueryStatementComparator;
  value?: any;
}

export interface EntityQueryStatementComparator {
  label: 'EQ' | 'NE' | 'ILIKE' | 'LIKE' | 'GT' | 'LT' | 'GE' | 'LE' | 'NULL' | 'NOTNULL';
}

export interface EntityQueryStatementNestedRestriction {
  clauses: EntityQueryStatementClause[];
}

export interface EntityQueryStatementOperator {
  label: 'AND' | 'OR';
}

export interface EntityQueryStatementOrderBy {
  attribute: string;
  order: EntityQueryStatementOrder;
}

export interface EntityQueryStatementOrder {
  label: 'ASC' | 'DESC';
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
