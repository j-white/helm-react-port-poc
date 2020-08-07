import React, { useMemo } from 'react';

import { AsyncSelect } from '@grafana/ui';

type Props = {
  className?: string;
  disabled?: boolean;
  loadValues: () => Promise<string[]>;
  value: string;
  onChange: (value: string) => void;
};

interface AutocompleteOption {
  label: string;
  value: string;
}

export const Autocomplete: React.FC<Props> = ({ className, disabled, loadValues, value, onChange }) => {
  const handleBlur = (proposedValue: string) => {
    console.log('handleBlur', proposedValue);
    if (proposedValue !== value) {
      console.log('onChange', value);
      onChange(proposedValue);
    }
  };
  
  const handleChange = (proposedValue: string) => {
    console.log('handleChange', proposedValue);
    if (proposedValue !== value) {
      console.log('onChange', value);
      onChange(proposedValue);
    }
  };

  const loadOptions = useMemo(() => {
    let options: AutocompleteOption[];
    return async (query: string) => {
      if (!options) {
        const values = await loadValues();
        options = values.map(value => ({ label: value, value }));
      }
      if (query) {
        const q = query.toLowerCase();
        return options.filter(option => option.value.toLowerCase().includes(q));
      }
      return options;
    };
  }, [loadValues]);

  const option = useMemo(() => {
    return { label: value, value };
  }, [value]);

  return (
    <AsyncSelect
      className={className}
      components={{
        NoOptionsMessage: () => null,
      }}
      defaultOptions
      disabled={disabled}
      isSearchable={true}
      loadOptions={loadOptions}
      menuPosition="fixed"
      value={option}
      // NOTE: Grafana UI provides an incorrect type definition for this prop.
      // @ts-ignore
      width="auto"
      // NOTE: Grafana UI provides an incorrect type definition for this prop.
      // @ts-ignore
      onBlur={e => handleBlur(e.target.value || value)}
      onChange={v => handleChange(v.value || '')}
    />
  );
};
