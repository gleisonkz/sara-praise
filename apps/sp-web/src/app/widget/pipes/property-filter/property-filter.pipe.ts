import { Pipe, PipeTransform } from '@angular/core';

import { toLowerCaseWithoutAccents } from '@sp/web/shared/functions';

@Pipe({
  name: 'spPropertyFilter',
  standalone: true,
})
export class PropertyFilterPipe<T> implements PipeTransform {
  readonly ERROR_MESSAGES = {
    NO_ITEMS: 'No items to filter',
    NO_PROPERTY_PATH: 'No property path provided',
  };

  transform(items: T[], filterPropertyPath: string, filterValue: string): T[] {
    const hasItems = items && items.length > 0;
    const hasFilterKey = filterValue && filterValue.toString().length > 0;
    const hasPropertyPath = filterPropertyPath && filterPropertyPath.length > 0;

    if (!hasItems) return [];
    if (!hasPropertyPath) throw new Error(this.ERROR_MESSAGES.NO_PROPERTY_PATH);

    const filteredItems = !hasFilterKey
      ? items
      : items.filter((item) => this.filterByPropertyPathAndValue(item, filterPropertyPath, filterValue));

    return filteredItems;
  }

  filterByPropertyPathAndValue(object: any, filterPropertyPath: string, filterValue: string): boolean {
    const keysUntilProperty = filterPropertyPath.split('.');
    const hasNoDepth = keysUntilProperty.length === 1;
    const firstKey = keysUntilProperty[0];

    if (hasNoDepth) {
      const targetItemValue = object[firstKey];
      return toLowerCaseWithoutAccents(targetItemValue).includes(toLowerCaseWithoutAccents(filterValue));
    }

    const firstKeyValue = object[firstKey];
    const nextKey = filterPropertyPath.split('.')[1];

    return this.filterByPropertyPathAndValue(firstKeyValue, nextKey, filterValue);
  }
}
