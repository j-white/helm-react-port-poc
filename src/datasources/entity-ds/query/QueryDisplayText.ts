import { Comparators } from 'opennms/src/api/Comparator';
import { Clause } from 'opennms/src/api/Clause';
import { NestedRestriction } from 'opennms/src/api/NestedRestriction';
import { OrderBy } from 'opennms/src/api/OrderBy';
import { Restriction } from 'opennms/src/api/Restriction';

import { Query } from './Query';

function getRestrictionDisplayText(restriction: Restriction): string {
  const { attribute, comparator, value } = restriction;
  if (comparator === Comparators.ISNULL) {
    return `${attribute} is null`;
  } else if (comparator === Comparators.NOTNULL) {
    return `${attribute} is not null`;
  } else {
    return `${attribute} ${comparator.label} "${value}"`;
  }
}

function getClauseDisplayText(clause: Clause): string {
  const { restriction } = clause;
  if (restriction instanceof Restriction) {
    return getRestrictionDisplayText(restriction);
  }
  if (restriction instanceof NestedRestriction) {
    const nestedQueryText = getClausesDisplayText(restriction.clauses);
    return `(${nestedQueryText})`;
  } else {
    throw new Error(`Unknown restriction: ${restriction}`);
  }
}

function getClausesDisplayText(clauses: Clause[]): string {
  return clauses
    .map((clause, index) => {
      const clauseQueryText = getClauseDisplayText(clause);
      if (index === 0) {
        return clauseQueryText;
      }
      return `${clause.operator.label} ${clauseQueryText}`;
    })
    .join(' ');
}

function getOrderByDisplayText(orderBy: OrderBy): string {
  return `${orderBy.attribute} ${orderBy.order.label}`;
}

function getOrderBysDisplayText(orderBys: OrderBy[]): string {
  return orderBys.map(getOrderByDisplayText).join(', ');
}

export function getQueryDisplayText(query: Query): string {
  const { entityName, filter, orderBy, limit } = query;
  let queryText = `select all ${entityName}s`;
  if (filter.clauses.length > 0) {
    const clausesDisplayText = getClausesDisplayText(filter.clauses);
    queryText += ` where ${clausesDisplayText}`;
  }
  if (orderBy.length > 0) {
    const orderByDisplayText = getOrderBysDisplayText(orderBy);
    queryText += ' order by ' + orderByDisplayText;
  }
  if (limit > 0) {
    queryText += ' limit ${limit}';
  }
  return queryText;
}
