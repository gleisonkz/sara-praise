import {
    ChangeDetectorRef, Directive, Input, NgModule, OnDestroy, OnInit, TemplateRef, ViewContainerRef
} from '@angular/core';

import {
    EmptyListNoMessageComponent
} from 'apps/sp-web/src/app/widget/components/empty-list-no-message/empty-list-no-message.component';
import { Observable, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[spFor]',
})
export class SpForDirective<T> implements OnInit, OnDestroy {
  @Input('spForOf') items$: Observable<T[]>;
  @Input('spForElse') emptyMessage: string;
  readonly destroy$ = new Subject<void>();

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.items$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      const hasNoItems = !items || items.length === 0;
      if (hasNoItems) this.renderNoMessage();

      items.forEach((item) => {
        this.viewContainer.createEmbeddedView(this.templateRef, {
          $implicit: item,
          length: items.length,
        });
      });

      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  renderNoMessage(): void {
    const componentRef = this.viewContainer.createComponent(EmptyListNoMessageComponent);
    componentRef.instance.message = this.emptyMessage;
  }
}

@NgModule({
  declarations: [SpForDirective],
  exports: [SpForDirective],
})
export class SpForDirectiveWidgetModule {}
