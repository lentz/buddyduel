import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'pointSpread'})
export class PointSpread implements PipeTransform {
  transform(value: number): string {
    if (value === 0) {
      return 'pick';
    } else if (value > 0) {
      return `+${value}`;
    } else {
      return value.toString();
    }
  }
}
