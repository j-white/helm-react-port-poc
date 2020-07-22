import React, { useState } from 'react';
import { css, cx } from 'emotion';

import { InlineFormLabel } from '@grafana/ui';

import { EditorRow } from 'common/components/EditorRow';
import { EditorRowActionButton } from 'common/components/EditorRowActionButton';

import {
  ClauseConfig,
  EntityAttributeOption,
  NestedRestrictionConfig,
  OperatorConfig,
  RestrictionConfig,
} from 'datasources/entity-ds/types';

import { isNestedClause } from '../ClauseConfig';

import { ClausesEditor } from './ClausesEditor';
import { EditorHBox } from 'common/components/EditorHBox';
import { OperatorEditor } from './OperatorEditor';
import { RestrictionEditor } from './RestrictionEditor';

const withAddHighlight = css`
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 3px;
    bottom: 1px;
    left: 0;
    border-bottom: 2px solid rgba(51, 162, 229, 0.8);
    pointer-events: none;
    z-index: 1;
  }
`;

const withRemoveHighlight = css`
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 3px;
    bottom: 1px;
    left: 0;
    border: 2px solid rgba(51, 162, 229, 0.8);
    pointer-events: none;
    z-index: 1;
  }
`;

const withIndentedBorder = css`
  margin-left: 8px;
  padding-left: 11px;

  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 7px;
    left: 0;
    width: 8px;
    border: 2px solid rgba(51, 162, 229, 0.8);
    border-right: none;
    border-top: none;
    pointer-events: none;
    z-index: 1;
  }
`;

type Props = {
  attributeOptions: EntityAttributeOption[];
  clause: ClauseConfig;
  depth: number;
  index: number;
  siblingCount: number;
  onAddAfter: (clause: ClauseConfig) => void;
  onAddNestedAfter: (clause: ClauseConfig) => void;
  onChange: (clause: ClauseConfig) => void;
  onRemove: (clause: ClauseConfig) => void;
};

export const ClauseEditor: React.FC<Props> = ({
  attributeOptions,
  clause,
  depth,
  index,
  siblingCount,
  onAddAfter,
  onAddNestedAfter,
  onChange,
  onRemove,
}) => {
  const [showAddHighlight, setShowAddHighlight] = useState(false);
  const [showRemoveHighlight, setShowRemoveHighlight] = useState(false);

  const handleOperatorChange = (operator: OperatorConfig) => {
    onChange({
      ...clause,
      operator,
    });
  };

  const handleRestrictionChange = (restriction: RestrictionConfig) => {
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

  const handleClausesChange = (clauses: ClauseConfig[]) => {
    onChange({
      ...clause,
      restriction: {
        clauses,
      },
    });
  };

  const isNested = isNestedClause(clause);
  const restriction = !isNested ? (clause.restriction as RestrictionConfig) : null;
  const nestedRestriction = isNested ? (clause.restriction as NestedRestrictionConfig) : null;

  return (
    <div className={cx(showAddHighlight && withAddHighlight, showRemoveHighlight && withRemoveHighlight)}>
      <div>
        <EditorRow
          actions={
            <EditorHBox>
              <EditorRowActionButton
                name="plus"
                title="Add restriction"
                onClick={e => {
                  handleAddAfterClick();
                  e.currentTarget.blur();
                }}
                onMouseEnter={() => setShowAddHighlight(true)}
                onMouseLeave={() => setShowAddHighlight(false)}
              />
              <EditorRowActionButton
                name="folder-plus"
                title="Add nested restriction"
                onClick={e => {
                  handleAddNestedAfterClick();
                  e.currentTarget.blur();
                }}
                onMouseEnter={() => setShowAddHighlight(true)}
                onMouseLeave={() => setShowAddHighlight(false)}
              />
              <EditorRowActionButton
                name={siblingCount > 1 ? 'trash-alt' : 'times'}
                title={siblingCount > 1 ? 'Remove restriction' : 'Clear restriction'}
                onClick={e => {
                  handleRemoveClick();
                  e.currentTarget.blur();
                }}
                onMouseEnter={() => setShowRemoveHighlight(true)}
                onMouseLeave={() => setShowRemoveHighlight(false)}
              />
            </EditorHBox>
          }
          label={
            index === 0 ? (
              <InlineFormLabel className="query-keyword" width={8}>
                WHERE
              </InlineFormLabel>
            ) : (
              <OperatorEditor operator={clause.operator} onChange={handleOperatorChange} />
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
    </div>
  );
};
