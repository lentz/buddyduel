import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'record'})
export class RecordPipe implements PipeTransform {
  transform(record: any): string {
    return `${record.wins}-${record.losses}-${record.pushes}`;
  }
}
