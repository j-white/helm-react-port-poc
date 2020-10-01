import { createDefaultFilter } from 'datasources/entity-ds/defaults';

import {
  StatementConfig,
  ClauseConfig,
  FilterConfig,
  OrderByConfig,
  NestedRestrictionConfig,
  RestrictionConfig,
} from 'datasources/entity-ds/types';

import { isNestedClause, isPopulated as isPopulatedClause } from './ClauseConfig';
import { isPopulated as isPopulatedOrderBy } from './OrderByConfig';

function prepareRestriction(restriction: RestrictionConfig, options: PrepareStatementOptions): RestrictionConfig {
  const { attribute, comparator, value } = restriction;
  return {
    attribute: options.fromAttributeAlias(attribute),
    comparator,
    value: options.interpolateVariables(value),
  };
}

function prepareClauses(clauses: ClauseConfig[], options: PrepareStatementOptions): ClauseConfig[] {
  return clauses.filter(isPopulatedClause).map(clause => {
    const { id, operator, restriction } = clause;
    if (isNestedClause(clause)) {
      const { clauses } = restriction as NestedRestrictionConfig;
      return {
        id,
        operator,
        restriction: {
          clauses: prepareClauses(clauses, options),
        },
      };
    } else {
      return {
        id,
        operator,
        restriction: prepareRestriction(restriction as RestrictionConfig, options),
      };
    }
  });
}

function prepareOrderBy(orderBy: OrderByConfig, options: PrepareStatementOptions): OrderByConfig {
  const { id, attribute, order } = orderBy;
  return {
    id,
    attribute: options.fromAttributeAlias(attribute),
    order,
  };
}

function prepareOrderBys(orderBys: OrderByConfig[], options: PrepareStatementOptions): OrderByConfig[] {
  return orderBys.filter(isPopulatedOrderBy).map(orderBy => prepareOrderBy(orderBy, options));
}

function prepareFilter(filter: FilterConfig, options: PrepareStatementOptions): FilterConfig {
  const { clauses, orderBy, limit } = filter;

  return {
    clauses: prepareClauses(clauses, options),
    orderBy: prepareOrderBys(orderBy, options),
    limit,
  };
}

export interface PrepareStatementOptions {
  fromAttributeAlias: (alias: string) => string;
  interpolateVariables: (value: string) => string;
}

export function prepareStatement(statement: StatementConfig, options: PrepareStatementOptions): StatementConfig {
  const { entityType, filter = createDefaultFilter() } = statement;

  return {
    entityType: entityType,
    filter: prepareFilter(filter, options),
  };
}
