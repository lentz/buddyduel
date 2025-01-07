import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'record',
    standalone: false
})
export class RecordPipe implements PipeTransform {
  transform(record: { wins: number; losses: number; pushes: number }): string {
    return `${record.wins}-${record.losses}-${record.pushes}`;
  }
}
