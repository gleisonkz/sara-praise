import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[spImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  @Input('spImgFallback') fallbackSrc: string;

  constructor(private readonly elementRef: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    this.elementRef.nativeElement.src = this.fallbackSrc || 'assets/images/default-avatar.png';
  }
}
