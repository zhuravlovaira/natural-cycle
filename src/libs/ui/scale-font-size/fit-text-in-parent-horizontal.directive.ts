import { DOCUMENT } from '@angular/common'
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core'

@Directive({
  selector: '[fitTextInParentHorizontal]',
})
export class FitTextInParentHorizontalDirective implements OnInit, OnDestroy {
  @HostBinding('style.whiteSpace') whiteSpace = 'nowrap'
  @HostListener('window:resize')
  onOrientationChange() {
    this.reactOnParentSizeChange()
  }

  constructor(
    @Inject(DOCUMENT) private readonly documentRef: Document,
    readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  private readonly reactOnParentSizeChange = () => {
    const textWidth: number = this.elementRef.nativeElement.offsetWidth
    const parentElementWidth: number | undefined =
      this.elementRef.nativeElement.parentElement?.offsetWidth
    const divWidth: number = parentElementWidth ? parentElementWidth : 0
    /**
     * The ratio between width of the parent block and font size, calculated based on the design specifications
     **/
    const fontToBlockRatio: number = 14
    const initialFontSize: number = divWidth / fontToBlockRatio
    const currentFontSize: number = this.getFontSize()
    const scaleFactor: number = divWidth / textWidth
    const scaledFontSize: number = currentFontSize * scaleFactor
    const newFontSize: number =
      scaledFontSize >= initialFontSize ? initialFontSize : scaledFontSize
    this.elementRef.nativeElement.style.fontSize = newFontSize + 'px'
  }
  private readonly observer = new MutationObserver(this.reactOnParentSizeChange)

  ngOnInit(): void {
    this.observer.observe(this.elementRef.nativeElement, {
      characterData: true,
      subtree: true,
    })
  }

  private getFontSize(): number {
    const fontSize: string = window.getComputedStyle(
      this.elementRef.nativeElement,
    ).fontSize
    return parseInt(fontSize, 10)
  }

  ngOnDestroy(): void {
    this.observer.disconnect()
  }
}
