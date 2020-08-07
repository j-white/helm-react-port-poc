import { Filter } from 'opennms-js-ts';

import { ComparatorType } from 'datasources/entity-ds/types';

export interface EntityService {
  toAttributeAlias(attribute: string): string;
  fromAttributeAlias(attribute: string): string;

  autocompleteAttribute(featuredAttributes: boolean): Promise<string[]>;
  autocompleteAttributeComparator(attribute: string): Promise<ComparatorType[]>;
  autocompleteAttributeValue(attribute: string): Promise<string[]>;

  // TODO: Refine return type shape.
  query(filter: Filter): Promise<any[]>;
}
