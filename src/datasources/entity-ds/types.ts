import { DataQuery, DataSourceJsonData } from '@grafana/data';

type Defaults<T, K extends keyof T> = Required<Pick<T, K>>;

// TODO: remove entityType and limit - use deserialized Query properties instead
export interface EntityQuery extends DataQuery {
  constant?: number;
  featuredAttributes?: boolean;
  entityType?: string;
  limit?: number;
  queryJson?: string;
}

type EntityQueryDefaults = Defaults<EntityQuery, 'constant' | 'featuredAttributes' | 'entityType' | 'limit'>;

export const defaultEntityQuery: EntityQueryDefaults = {
  constant: 6.5,
  entityType: 'alarm',
  featuredAttributes: true,
  limit: 0,
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
