import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CountdownComponent } from './countdown.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { FitTextInParentHorizontalModule } from '../../libs/ui/scale-font-size/fit-text-in-parent-horizontal.module'
import { FormatDurationPipe } from './format-duration.pipe'

@NgModule({
  declarations: [CountdownComponent, FormatDurationPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FitTextInParentHorizontalModule,
  ],
  exports: [CountdownComponent],
})
export class CountdownModule {}
