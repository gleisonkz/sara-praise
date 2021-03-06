import {
    ChangeDetectorRef, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef
} from '@angular/core';

import {
    EmptyListNoMessageComponent
} from 'apps/sp-web/src/app/widget/components/empty-list-no-message/empty-list-no-message.component';
import { Observable, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[spFor]',
  standalone: true,
})
export class SpForDirective<T> implements OnInit, OnDestroy {
  @Input('spForOf') items$: Observable<T[]> | T[];
  @Input('spForElse') emptyMessage: string;
  readonly destroy$ = new Subject<void>();

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    if (!(this.items$ instanceof Observable)) return this.createView(this.items$);

    this.items$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.createView(items);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private createView(items: T[]) {
    items.forEach((item, index) => {
      this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: item,
        length: items.length,
        index: index,
      });
    });

    this.renderNoMessage(items);

    this.changeDetector.detectChanges();
  }

  private renderNoMessage(items: T[]): void {
    const hasItems = items?.length > 0;
    if (hasItems) return;

    this.viewContainer.clear();
    const componentRef = this.viewContainer.createComponent(EmptyListNoMessageComponent);
    componentRef.instance.message = this.emptyMessage;
    this.changeDetector.detectChanges();
  }
}
