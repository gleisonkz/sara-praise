import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spRemoveDots',
})
export class RemoveDotsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const noDots = value.replace(/\./g, '');
    return noDots;
  }
}
