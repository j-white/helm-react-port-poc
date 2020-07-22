import { createDefaultFilter } from 'datasources/entity-ds/defaults';

import {
  StatementConfig,
  ClauseConfig,
  FilterConfig,
  OrderByConfig,
  NestedRestrictionConfig,
} from 'datasources/entity-ds/types';

import { isNestedClause, isPopulated as isPopulatedClause } from './ClauseConfig';
import { isPopulated as isPopulatedOrderBy } from './OrderByConfig';

function sanitizeClauses(clauses: ClauseConfig[]): ClauseConfig[] {
  return clauses.filter(isPopulatedClause).map(clause => {
    if (isNestedClause(clause)) {
      const { id, operator, restriction } = clause;
      const { clauses } = restriction as NestedRestrictionConfig;
      return {
        id,
        operator,
        restriction: {
          clauses: sanitizeClauses(clauses),
        },
      };
    } else {
      return clause;
    }
  });
}

function sanitizeOrderBys(orderBys: OrderByConfig[]): OrderByConfig[] {
  return orderBys.filter(isPopulatedOrderBy);
}

function sanitizeFilter(filter: FilterConfig): FilterConfig {
  const { clauses, orderBy, limit } = filter;

  return {
    clauses: sanitizeClauses(clauses),
    orderBy: sanitizeOrderBys(orderBy),
    limit,
  };
}

export function sanitizeStatement(statement: StatementConfig): StatementConfig {
  const { entityType, filter = createDefaultFilter() } = statement;

  return {
    entityType: entityType,
    filter: sanitizeFilter(filter),
  };
}
