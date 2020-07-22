import { ClauseConfig, RestrictionConfig, NestedRestrictionConfig } from 'datasources/entity-ds/types';

import { isPopulated as isNestedRestrictionPopulated } from './NestedRestrictionConfig';
import { isPopulated as isOperatorPopulated } from './OperatorConfig';
import { isPopulated as isRestrictionPopulated } from './RestrictionConfig';

export function isNestedClause(clause: ClauseConfig): boolean {
  return 'clauses' in clause.restriction;
}

export function isPopulated(clause: ClauseConfig): boolean {
  if (isNestedClause(clause)) {
    const nestedRestriction = clause.restriction as NestedRestrictionConfig;
    return isOperatorPopulated(clause.operator) && isNestedRestrictionPopulated(nestedRestriction);
  } else {
    const restriction = clause.restriction as RestrictionConfig;
    return isOperatorPopulated(clause.operator) && isRestrictionPopulated(restriction);
  }
}
