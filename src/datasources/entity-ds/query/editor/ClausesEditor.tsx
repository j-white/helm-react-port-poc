import React from 'react';

import { matchById, excludeById } from 'common/Identifiable';

import { createEmptyClause, createEmptyNestedClause } from 'datasources/entity-ds/defaults';

import { EntityAttributeOption, EntityQueryStatementClause } from 'datasources/entity-ds/types';

import { ClauseEditor } from './ClauseEditor';

type Props = {
  attributeOptions: EntityAttributeOption[];
  clauses: EntityQueryStatementClause[];
  depth: number;
  onChange: (clauses: EntityQueryStatementClause[]) => void;
};

export const ClausesEditor: React.FC<Props> = ({ attributeOptions, clauses, depth, onChange }) => {
  const handleClauseChange = (clause: EntityQueryStatementClause) => {
    const index = clauses.findIndex(matchById(clause));
    if (index < 0) {
      throw new Error('Clause not found.');
    }
    const updatedClauses = Object.assign([...clauses], {
      [index]: clause,
    });

    onChange(updatedClauses);
  };

  const handleClauseAdd = (afterClause: EntityQueryStatementClause) => {
    const index = clauses.findIndex(matchById(afterClause)) + 1;
    const updatedClauses = [...clauses.slice(0, index), createEmptyClause(), ...clauses.slice(index)];

    onChange(updatedClauses);
  };

  const handleClauseAddNestedAfter = (afterClause: EntityQueryStatementClause) => {
    const index = clauses.findIndex(matchById(afterClause)) + 1;
    const updatedClauses = [...clauses.slice(0, index), createEmptyNestedClause(), ...clauses.slice(index)];

    onChange(updatedClauses);
  };

  const handleClauseRemove = (clauseToRemove: EntityQueryStatementClause) => {
    const filteredClauses = clauses.filter(excludeById(clauseToRemove));
    const updatedClauses = filteredClauses.length > 0 ? filteredClauses : [createEmptyClause()];

    onChange(updatedClauses);
  };

  return (
    <>
      {clauses.map((clause, index) => (
        <ClauseEditor
          key={clause.id}
          clause={clause}
          depth={depth + 1}
          index={index}
          attributeOptions={attributeOptions}
          onAddAfter={handleClauseAdd}
          onAddNestedAfter={handleClauseAddNestedAfter}
          onChange={handleClauseChange}
          onRemove={handleClauseRemove}
        />
      ))}
    </>
  );
};
