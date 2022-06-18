import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spRemoveDots',
  standalone: true,
})
export class RemoveDotsPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (!value) return value;

    const noDots = value.replace(/\./g, '');
    return noDots;
  }
}
