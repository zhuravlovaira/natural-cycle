import {FormatDurationPipe} from "./format-duration.pipe";
import {Duration} from "date-fns";

describe('FormatDurationPipe', () => {
  let pipe: FormatDurationPipe;

  beforeEach(() => {
    pipe = new FormatDurationPipe();
  });

  it('should format duration when all properties are set', () => {
    const duration: Duration = {
      days: 12,
      hours: 10,
      minutes: 14,
      weeks: 2,
      months: 10,
      seconds: 16,
      years: 2,
    };
    const {years, months, weeks, days, hours, minutes, seconds}: Duration = duration;
    const formatDuration: string = pipe.transform(duration);
    expect(formatDuration).toEqual(`${years} years, ${months} months, ${weeks} weeks, ${days} days, ${hours}h, ${minutes}m, ${seconds}s`);
  });

  it('should format duration when NOT all properties are set', () => {
    const duration: Duration = {
      days: 0,
      hours: 2,
      minutes: 14,
      weeks: 0,
      months: 0,
      seconds: 1,
      years: 0,
    };
    const {hours, minutes, seconds}: Duration = duration;
    const formatDuration: string = pipe.transform(duration);
    expect(formatDuration).toBe(`${hours}h, ${minutes}m, ${seconds}s`);
  });

  it('should return empty string if duration is not set', () => {
    const formatDuration: string = pipe.transform(null as unknown as Duration);
    expect(formatDuration).toEqual('');
  });
});
