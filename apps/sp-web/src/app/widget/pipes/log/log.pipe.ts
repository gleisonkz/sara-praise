import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spLog',
})
export class LogPipe implements PipeTransform {
  transform(value: any): void {
    console.log('value', value);
  }
}
