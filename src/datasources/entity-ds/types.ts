import { DataQuery, DataSourceJsonData } from '@grafana/data';

import { Defaults } from '../../types';

export type EntityType = 'alarm' | 'node';

export interface EntityQueryStatement {
  entityType: EntityType;
  limit: number;
}

export interface EntityQuery extends DataQuery {
  featuredAttributes?: boolean;
  statement?: EntityQueryStatement;
}

type EntityQueryDefaults = Defaults<EntityQuery, 'featuredAttributes' | 'statement'>;

export const defaultEntityQuery: EntityQueryDefaults = {
  featuredAttributes: true,
  statement: {
    entityType: 'alarm',
    limit: 0,
  },
};

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
