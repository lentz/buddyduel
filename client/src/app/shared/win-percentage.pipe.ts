import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'winPercentage' })
export class WinPercentagePipe implements PipeTransform {
  transform(record: { wins: number; losses: number; pushes: number }): number {
    if (record.wins === 0 && record.losses === 0) {
      return 0;
    }
    return record.wins / (record.wins + record.losses);
  }
}
