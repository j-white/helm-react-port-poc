import { v4 as uuidv4 } from 'uuid';

import { Defaults } from 'types';

import { ClauseConfig, EntityQuery, EntityDataSourceOptions, FilterConfig, OrderByConfig } from './types';

type EntityQueryDefaults = Defaults<EntityQuery, 'featuredAttributes' | 'statement'>;

export const defaultEntityQuery: EntityQueryDefaults = {
  featuredAttributes: true,
  statement: {
    entityType: 'alarm',
  },
};

type EntityDataSourceOptionsDefaults = Defaults<EntityDataSourceOptions, 'grafanaUserField' | 'useGrafanaUser'>;

export const defaultEntityDataSourceOptions: EntityDataSourceOptionsDefaults = {
  grafanaUserField: 'login',
  useGrafanaUser: false,
};

export function createEmptyClause(): ClauseConfig {
  return {
    id: uuidv4(),
    restriction: {
      attribute: '',
      comparator: { label: 'EQ' },
      value: '',
    },
    operator: { label: 'AND' },
  };
}

export function createEmptyNestedClause(): ClauseConfig {
  return {
    id: uuidv4(),
    restriction: {
      clauses: [createEmptyClause()],
    },
    operator: { label: 'AND' },
  };
}

export function createEmptyOrderBy(): OrderByConfig {
  return {
    id: uuidv4(),
    attribute: '',
    order: { label: 'ASC' },
  };
}

export function createDefaultFilter(): FilterConfig {
  return {
    clauses: [createEmptyClause()],
    orderBy: [createEmptyOrderBy()],
    limit: 0,
  };
}
