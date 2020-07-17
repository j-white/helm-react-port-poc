import React from 'react';
import { css, cx } from 'emotion';

import { InlineFormLabel } from '@grafana/ui';

import {
  EntityAttributeOption,
  EntityQueryStatementClause,
  EntityQueryStatementNestedRestriction,
  EntityQueryStatementOperator,
  EntityQueryStatementRestriction,
} from 'datasources/entity-ds/types';

import { OperatorEditor } from './OperatorEditor';
import { RestrictionEditor } from './RestrictionEditor';

const withChildRightMargins = css`
  > *:not(:last-child) {
    margin-right: 4px;
  }
`;

type Props = {
  attributeOptions: EntityAttributeOption[];
  clause: EntityQueryStatementClause;
  index: number;
  onChange: (value: EntityQueryStatementClause) => void;
};

export const ClauseEditor: React.FC<Props> = ({ attributeOptions, clause, index, onChange }) => {
  const handleOperatorChange = (operator: EntityQueryStatementOperator) => {
    onChange({
      ...clause,
      operator,
    });
  };

  const handleRestrictionChange = (restriction: EntityQueryStatementRestriction) => {
    onChange({
      ...clause,
      restriction,
    });
  };

  const handleNestedRestrictionClauseChange = (clause: EntityQueryStatementClause) => {
    // TODO: implement onChange()
  };

  const isNestedRestriction = 'clauses' in clause.restriction;
  const restriction = !isNestedRestriction ? (clause.restriction as EntityQueryStatementRestriction) : null;
  const nestedRestriction = isNestedRestriction ? (clause.restriction as EntityQueryStatementNestedRestriction) : null;

  return (
    <div className="gf-form">
      <div className={cx('gf-form-inline', withChildRightMargins)}>
        {index === 0 ? (
          <InlineFormLabel className="query-keyword" width={8}>
            WHERE
          </InlineFormLabel>
        ) : (
          <OperatorEditor operator={clause.operator} onChange={handleOperatorChange} />
        )}
        {restriction && (
          <RestrictionEditor
            attributeOptions={attributeOptions}
            restriction={restriction}
            onChange={handleRestrictionChange}
          />
        )}
        {nestedRestriction &&
          nestedRestriction.clauses.map((clause, index) => (
            <ClauseEditor
              key={clause.id}
              clause={clause}
              attributeOptions={attributeOptions}
              index={index}
              onChange={handleNestedRestrictionClauseChange}
            />
          ))}
      </div>
    </div>
  );
};
