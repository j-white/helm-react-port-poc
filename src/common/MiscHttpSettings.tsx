import React from 'react';

import { LegacyForms } from '@grafana/ui';

const { FormField } = LegacyForms;

interface Props {
  timeout?: number;
  onChange: (timeout?: number) => void;
}

function toOptionalNumber(value: string) {
  return value ? Number(value) : undefined;
}

export const MiscHttpSettings: React.FC<Props> = ({ timeout, onChange }) => {
  return (
    <div className="gf-form-group">
      <h3 className="page-heading">Miscellaneous HTTP Settings</h3>
      <div className="gf-form">
        <FormField
          inputWidth={4}
          label="ReST Timeout (Seconds)"
          labelWidth={12}
          placeholder="10"
          type="number"
          value={timeout}
          onChange={e => onChange(toOptionalNumber(e.currentTarget.value))}
        />
      </div>
    </div>
  );
};
