import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordPipe } from './record.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ RecordPipe ],
  exports:      [ RecordPipe, CommonModule ]
})
export class SharedModule { }
