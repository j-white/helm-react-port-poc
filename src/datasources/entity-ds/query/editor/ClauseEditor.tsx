import React from 'react';

import { Button, Icon, InlineFormLabel } from '@grafana/ui';

import {
  EntityAttributeOption,
  EntityQueryStatementClause,
  EntityQueryStatementNestedRestriction,
  EntityQueryStatementOperator,
  EntityQueryStatementRestriction,
} from 'datasources/entity-ds/types';

import { ClauseOperatorEditor } from './ClauseOperatorEditor';
import { RestrictionEditor } from './RestrictionEditor';
import { FieldInputWithActions } from 'common/FieldInputWithActions';

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
      {index === 0 ? (
        <InlineFormLabel className="query-keyword" width={8}>
          WHERE
        </InlineFormLabel>
      ) : (
        <ClauseOperatorEditor operator={clause.operator} onChange={handleOperatorChange} />
      )}
      {restriction && (
        <FieldInputWithActions
          actions={
            <>
              <Button variant="secondary" size="xs" title="Add restriction" onClick={() => {}}>
                <Icon name="plus" />
              </Button>
              <Button variant="secondary" size="xs" onClick={() => {}}>
                <Icon name="folder-plus" title="Add nested restriction" />
              </Button>
              <Button variant="secondary" size="xs" onClick={() => {}}>
                <Icon name="trash-alt" title="Remove restriction" />
              </Button>
            </>
          }
        >
          <RestrictionEditor
            attributeOptions={attributeOptions}
            restriction={restriction}
            onChange={handleRestrictionChange}
          />
        </FieldInputWithActions>
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
  );
};
