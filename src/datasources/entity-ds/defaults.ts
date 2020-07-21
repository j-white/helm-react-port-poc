import { v4 as uuidv4 } from 'uuid';

import { Defaults } from 'types';

import {
  EntityQuery,
  EntityQueryStatementClause,
  EntityQueryStatementOrderBy,
  EntityQueryStatementFilter,
  EntityDataSourceOptions,
} from './types';

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

export function createEmptyClause(): EntityQueryStatementClause {
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

export function createEmptyNestedClause(): EntityQueryStatementClause {
  return {
    id: uuidv4(),
    restriction: {
      clauses: [createEmptyClause()],
    },
    operator: { label: 'AND' },
  };
}

export function createEmptyOrderBy(): EntityQueryStatementOrderBy {
  return {
    id: uuidv4(),
    attribute: '',
    order: { label: 'ASC' },
  };
}

export function createDefaultFilter(): EntityQueryStatementFilter {
  return {
    clauses: [createEmptyClause()],
    orderBy: [createEmptyOrderBy()],
    limit: 0,
  };
}
