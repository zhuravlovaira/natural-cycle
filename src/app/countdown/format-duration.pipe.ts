import { Pipe, PipeTransform } from '@angular/core';
import {Duration} from "date-fns";

@Pipe({ name: 'formatDuration' })
export class FormatDurationPipe implements PipeTransform {
  transform(duration: Duration): string {
    if (!duration) {
      return '';
    }

    const {years, months, weeks, days, hours, minutes, seconds}: Duration = duration;
    const formatYears: string = years ? `${years} years,` : '';
    const formatMonths: string = months ? `${months} months,` : '';
    const formatWeeks: string = weeks ? `${weeks} weeks,` : '';
    const formatDays: string = days ? `${days} days,` : '';
    const formatHours: string = hours ? `${hours}h,` : '';
    const formatMinutes: string = minutes ? `${minutes}m,` : '';
    const formatSeconds: string = seconds ? `${seconds}s,` : '';

    return this.removeLastComma(`${formatYears} ${formatMonths} ${formatWeeks} ${formatDays} ${formatHours} ${formatMinutes} ${formatSeconds}`.trim());
  }

  private removeLastComma(string: string): string {
    return string.slice(0, -1);
  }
}
