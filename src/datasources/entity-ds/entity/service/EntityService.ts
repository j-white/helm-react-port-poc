import { MutableDataFrame, FieldDTO } from '@grafana/data';

import { Filter } from 'opennms-js-ts';

import { ComparatorType, EntityColumn } from 'datasources/entity-ds/types';

export interface EntityService {
  toAttributeAlias(attribute: string): string;
  fromAttributeAlias(attribute: string): string;

  autocompleteAttribute(featuredAttributes: boolean): Promise<string[]>;
  autocompleteAttributeComparator(attribute: string): Promise<ComparatorType[]>;
  autocompleteAttributeValue(attribute: string): Promise<string[]>;

  query(refId: string, filter: Filter): Promise<MutableDataFrame>;
}

export function fieldForEntityColumn(column: EntityColumn): FieldDTO {
  return {
    name: column.resource,
    // TODO: type: column.type, (where this is FieldType value)
    config: {
      displayName: column.text,
    },
  };
}
