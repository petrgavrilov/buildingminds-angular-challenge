import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';

@Component({
  selector: 'app-lazy-load-trigger',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoadTriggerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public shouldTrigger: InputSignal<boolean> = input<boolean>(true);
  public marginBottom: InputSignal<number> = input<number>(500);

  public trigger: OutputEmitterRef<void> = output<void>();

  private _element: ElementRef<HTMLElement> = inject(ElementRef);
  private _observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    this._observer = new IntersectionObserver(
      this.observerCallback.bind(this),
      {
        threshold: 0.5,
        rootMargin: `0px 0px ${this.marginBottom()}px 0px`,
      }
    );
  }

  ngAfterViewInit(): void {
    this._observer?.observe(this._element?.nativeElement);
  }

  ngOnDestroy(): void {
    this._observer?.disconnect();
  }

  private observerCallback(entries: IntersectionObserverEntry[]): void {
    if (this.shouldTrigger()) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.trigger.emit();
        }
      });
    }
  }
}
