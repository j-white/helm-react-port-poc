import { NestedRestrictionConfig } from 'datasources/entity-ds/types';

import { isPopulated as isPopulatedClause } from './ClauseConfig';

export function isPopulated(nestedRestriction: NestedRestrictionConfig): boolean {
  return nestedRestriction.clauses.some(clause => isPopulatedClause(clause));
}
