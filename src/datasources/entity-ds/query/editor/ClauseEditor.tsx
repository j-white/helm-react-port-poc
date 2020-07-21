import React from 'react';
import { css } from 'emotion';

import { InlineFormLabel } from '@grafana/ui';

import { EditorHBox } from 'common/components/EditorHBox';
import { EditorRow } from 'common/components/EditorRow';
import { EditorRowActionButton } from 'common/components/EditorRowActionButton';

import {
  EntityAttributeOption,
  EntityQueryStatementClause,
  EntityQueryStatementNestedRestriction,
  EntityQueryStatementOperator,
  EntityQueryStatementRestriction,
} from 'datasources/entity-ds/types';


import { ClauseOperatorEditor } from './ClauseOperatorEditor';
import { ClausesEditor } from './ClausesEditor';
import { RestrictionEditor } from './RestrictionEditor';

const withIndentedBorder = css`
  border-left: 2px solid rgb(51, 162, 229, 0.8);
  margin-left: 8px;
  padding-left: 8px;
`;

type Props = {
  attributeOptions: EntityAttributeOption[];
  clause: EntityQueryStatementClause;
  depth: number;
  index: number;
  onAddAfter: (clause: EntityQueryStatementClause) => void;
  onAddNestedAfter: (clause: EntityQueryStatementClause) => void;
  onChange: (clause: EntityQueryStatementClause) => void;
  onRemove: (clause: EntityQueryStatementClause) => void;
};

export const ClauseEditor: React.FC<Props> = ({
  attributeOptions,
  clause,
  depth,
  index,
  onAddAfter,
  onAddNestedAfter,
  onChange,
  onRemove,
}) => {
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

  const handleAddNestedAfterClick = () => {
    onAddNestedAfter(clause);
  };

  const handleRemoveClick = () => {
    onRemove(clause);
  };

  const handleClausesChange = (clauses: EntityQueryStatementClause[]) => {
    onChange({
      ...clause,
      restriction: {
        clauses,
      },
    });
  };

  const isNestedRestriction = 'clauses' in clause.restriction;
  const restriction = !isNestedRestriction ? (clause.restriction as EntityQueryStatementRestriction) : null;
  const nestedRestriction = isNestedRestriction ? (clause.restriction as EntityQueryStatementNestedRestriction) : null;

  return (
    <>
      <div>
        <EditorRow
          actions={
            <EditorHBox>
              <EditorRowActionButton name="plus" title="Add restriction" onClick={handleAddAfterClick} />
              <EditorRowActionButton
                name="folder-plus"
                title="Add nested restriction"
                onClick={handleAddNestedAfterClick}
              />
              <EditorRowActionButton name="trash-alt" title="Remove restriction" onClick={handleRemoveClick} />
            </EditorHBox>
          }
          label={
            index === 0 ? (
              <InlineFormLabel className="query-keyword" width={8}>
                WHERE
              </InlineFormLabel>
            ) : (
              <ClauseOperatorEditor operator={clause.operator} onChange={handleOperatorChange} />
            )
          }
        >
          <EditorHBox>
            {restriction && (
              <RestrictionEditor
                attributeOptions={attributeOptions}
                restriction={restriction}
                onChange={handleRestrictionChange}
              />
            )}
          </EditorHBox>
        </EditorRow>
      </div>
      {nestedRestriction && (
        <div className={withIndentedBorder}>
          <ClausesEditor
            key={clause.id}
            clauses={nestedRestriction.clauses}
            depth={depth + 1}
            attributeOptions={attributeOptions}
            onChange={handleClausesChange}
          />
        </div>
      )}
    </>
  );
};
