import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordPipe } from './record.pipe';
import { WinPercentagePipe } from './win-percentage.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [RecordPipe, WinPercentagePipe],
  exports: [CommonModule, RecordPipe, WinPercentagePipe]
})
export class SharedModule { }
