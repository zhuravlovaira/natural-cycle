import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import intervalToDuration from 'date-fns/intervalToDuration';
import {combineLatest, delay, interval, Observable, startWith, Subject, takeUntil} from "rxjs";
import {finalize, map, tap} from 'rxjs/operators';
import {Duration, startOfTomorrow} from "date-fns";

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownComponent implements OnInit, OnDestroy {
  @HostListener("window:beforeunload") unloadHandler() {
    this.setDataToStorageOnReload();
  }
  private readonly destroy$: Subject<void> = new Subject();
  readonly minDatepickerDate: Date = startOfTomorrow();
  readonly form: FormGroup = new FormGroup({
    eventTitle: new FormControl(),
    endDate: new FormControl(),
  });
  readonly maxEventTitleLength: number = 50;
  readonly countDownInterval: number = 1000;
  readonly duration$: Observable<Duration> = combineLatest([interval(this.countDownInterval), this.form.get('endDate')!.valueChanges]).pipe(
    map(([interval, endDate]: [number, Date]) => this.getDuration(endDate)),
    finalize(() => this.form.get('endDate')!.reset())
  );
  private readonly eventTitleStorageKey: string = 'eventTitle';
  private readonly endDateStorageKey: string = 'endDate';

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.disableEndDateBasedOnEventTitle();
    this.setInitialDataFromStorage();
  }

  private disableEndDateBasedOnEventTitle(): void {
    this.form.get('eventTitle')!.valueChanges.pipe(takeUntil(this.destroy$), startWith('')).subscribe((eventTitle: string) => {
      if (eventTitle) {
        this.form.get('endDate')!.enable({emitEvent: false});
      }
      else {
        this.form.get('endDate')!.disable({emitEvent: false});
      }
    });
  }

  private getDuration(endDate: Date): Duration {
    return intervalToDuration({
      start: new Date(),
      end: endDate,
    });
  }

  private setInitialDataFromStorage(): void {
    const eventTitle: string | null = localStorage.getItem(this.eventTitleStorageKey);

    if(eventTitle) {
      this.form.patchValue({eventTitle});
      this.changeDetectorRef.detectChanges()
      this.setEndDateIfExists();
    }
  }

  private setEndDateIfExists(): void {
    const endDate: string | null = localStorage.getItem(this.endDateStorageKey);

    if (endDate) {
      this.form.patchValue({endDate: new Date(endDate)})
    }
  }

  private setDataToStorageOnReload(): void {
    const eventTitle = this.form.value.eventTitle;
    const endDate = this.form.value.endDate;

    if(eventTitle) {
      localStorage.setItem(this.eventTitleStorageKey, eventTitle);
      localStorage.setItem(this.endDateStorageKey, endDate ? endDate : '');
    } else {
      localStorage.setItem(this.eventTitleStorageKey, '');
      localStorage.setItem(this.endDateStorageKey, '');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
