import React, { useMemo } from 'react';

import { EntityService } from 'datasources/entity-ds/entity/service/EntityService';

import { Autocomplete } from './common/Autocomplete';

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

  return <Autocomplete value={attribute} loadValues={loadValues} onChange={onChange} />;
};
