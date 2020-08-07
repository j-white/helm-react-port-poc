import React, { useMemo } from 'react';
import { css } from 'emotion';

import { EntityService } from 'datasources/entity-ds/entity/service/EntityService';

import { Autocomplete } from './common/Autocomplete';

const withMinWidth = css`
  min-width: 144px;
`;

type Props = {
  attribute: string;
  disabled?: boolean;
  entityService: EntityService;
  value: string;
  onChange: (value: string) => void;
};

export const RestrictionValueEditor: React.FC<Props> = ({ attribute, disabled, entityService, value, onChange }) => {
  const loadValues = useMemo(() => {
    return () => entityService.autocompleteAttributeValue(attribute);
  }, [attribute]);

  return (
    <Autocomplete
      className={withMinWidth}
      disabled={disabled}
      value={value}
      loadValues={loadValues}
      onChange={onChange}
    />
  );
};
