import React, { useMemo } from 'react';
import { css } from 'emotion';

import { EntityService } from 'datasources/entity-ds/entity/service/EntityService';

import { Autocomplete } from './common/Autocomplete';

const withMinWidth = css`
  min-width: 144px;
`;

type Props = {
  attribute: string;
  entityService: EntityService;
  featuredAttributes: boolean;
  onChange: (value: string) => void;
};

export const OrderByAttributeEditor: React.FC<Props> = ({ attribute, entityService, featuredAttributes, onChange }) => {
  const loadValues = useMemo(() => {
    return () => entityService.autocompleteAttribute(featuredAttributes);
  }, [featuredAttributes]);

  return <Autocomplete className={withMinWidth} loadValues={loadValues} value={attribute} onChange={onChange} />;
};
