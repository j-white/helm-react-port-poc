import React from 'react';

import { Button, Icon, InlineFormLabel } from '@grafana/ui';

import {
  EntityAttributeOption,
  EntityQueryStatementClause,
  EntityQueryStatementNestedRestriction,
  EntityQueryStatementOperator,
  EntityQueryStatementRestriction,
} from '../../types';

import { ClausesEditor } from './ClausesEditor';
import { ClauseOperatorEditor } from './ClauseOperatorEditor';
import { FieldInputWithActions } from '../../../../common/components/FieldInputWithActions';
import { RestrictionEditor } from './RestrictionEditor';

type Props = {
  attributeOptions: EntityAttributeOption[];
  clause: EntityQueryStatementClause;
  index: number;
  onAddAfter: (clause: EntityQueryStatementClause) => void;
  onChange: (clause: EntityQueryStatementClause) => void;
  onRemove: (clause: EntityQueryStatementClause) => void;
};

export const ClauseEditor: React.FC<Props> = ({ attributeOptions, clause, index, onAddAfter, onChange, onRemove }) => {
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

  const handleAddAfterClick = () => {
    onAddAfter(clause);
  };

  const handleRemoveClick = () => {
    onRemove(clause);
  };

  const handleClausesChange = (clauses: EntityQueryStatementClause[]) => {
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
              <Button variant="secondary" size="xs" title="Add restriction" onClick={handleAddAfterClick}>
                <Icon name="plus" />
              </Button>
              <Button variant="secondary" size="xs" onClick={() => {}}>
                <Icon name="folder-plus" title="Add nested restriction" />
              </Button>
              <Button variant="secondary" size="xs" onClick={handleRemoveClick}>
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
      {nestedRestriction && (
        <ClausesEditor
          key={clause.id}
          clauses={nestedRestriction.clauses}
          attributeOptions={attributeOptions}
          onChange={handleClausesChange}
        />
      )}
    </div>
  );
};
