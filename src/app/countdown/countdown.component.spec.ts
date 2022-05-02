import { CountdownComponent } from './countdown.component'
import { ChangeDetectorRef } from '@angular/core'

describe('CountdownComponent', () => {
  let component: CountdownComponent
  let changeDetectorRef: ChangeDetectorRef

  beforeEach(() => {
    changeDetectorRef = jasmine.createSpyObj<ChangeDetectorRef>(
      'ChangeDetectorRef',
      ['detectChanges'],
    )
    component = new CountdownComponent(changeDetectorRef)
  })

  describe('disableEndDateBasedOnEventTitle', () => {
    beforeEach(() => {
      // @ts-ignore
      spyOn(component.form.get('endDate'), 'enable')
      // @ts-ignore
      spyOn(component.form.get('endDate'), 'disable')
      component.ngOnInit()
    })

    it('should disable datepicker if an even title is NOT set', (done: DoneFn) => {
      component.form.get('eventTitle')!.valueChanges.subscribe(() => {
        expect(component.form.get('endDate')?.disable).toHaveBeenCalledWith({
          emitEvent: false,
        })
        done()
      })
      component.form.get('eventTitle')?.patchValue('')
    })

    it('should enable datepicker if an even title is set', (done: DoneFn) => {
      component.form.get('eventTitle')!.valueChanges.subscribe(() => {
        expect(component.form.get('endDate')?.enable).toHaveBeenCalledWith({
          emitEvent: false,
        })
        done()
      })
      component.form.get('eventTitle')?.patchValue('title')
    })
  })

  describe('setInitialDataFromStorage', () => {
    const eventTitle: string = 'title'
    const endDate: string = '11/11/2011'

    beforeEach(() => {
      // @ts-ignore
      spyOn(component.form, 'patchValue')
    })

    afterEach(() => {
      localStorage.clear()
    })

    it('should NOT set data if eventTitle is NOT in the localStorage', () => {
      component.ngOnInit()
      expect(component.form.patchValue).not.toHaveBeenCalledWith({ eventTitle })
    })

    it('should set eventTitle if eventTitle is in the localStorage', () => {
      localStorage.setItem('eventTitle', eventTitle)
      component.ngOnInit()
      expect(component.form.patchValue).toHaveBeenCalledWith({ eventTitle })
    })

    it('should set endDate if eventTitle and endDate is in the localStorage', () => {
      localStorage.setItem('eventTitle', eventTitle)
      localStorage.setItem('endDate', endDate)
      component.ngOnInit()
      expect(component.form.patchValue).toHaveBeenCalledWith({
        endDate: new Date(endDate),
      })
    })

    it('should NOT set endDate if eventTitle is NOT in the localStorage', () => {
      localStorage.setItem('endDate', endDate)
      component.ngOnInit()
      expect(component.form.patchValue).not.toHaveBeenCalledWith({
        endDate: new Date(endDate),
      })
    })

    it('should fire changeDetectorRef to trigger duration calculation', () => {
      localStorage.setItem('eventTitle', eventTitle)
      localStorage.setItem('endDate', endDate)
      component.ngOnInit()
      expect(changeDetectorRef.detectChanges).toHaveBeenCalled()
    })
  })
})
