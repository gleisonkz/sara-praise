import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spLog',
  standalone: true,
})
export class LogPipe implements PipeTransform {
  transform(value: unknown): void {
    console.info('value', value);
  }
}
