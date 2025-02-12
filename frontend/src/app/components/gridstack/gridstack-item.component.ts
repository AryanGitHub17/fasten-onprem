/**
 * gridstack-item.component.ts 7.3.0
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { GridItemHTMLElement, GridStackNode } from 'gridstack';
import {CommonModule} from '@angular/common';

/** store element to Ng Class pointer back */
export interface GridItemCompHTMLElement extends GridItemHTMLElement {
  _gridItemComp?: GridstackItemComponent;
}

/**
 * HTML Component Wrapper for gridstack items, in combination with GridstackComponent for parent grid
 */
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'gridstack-item',
  template: `
    <div class="grid-stack-item-content">
      <!-- this is where you would create the right component based on some internal type or id. doing .content for demo purpose -->
      {{options.content}}
      <ng-content></ng-content>
      <!-- where dynamic items go (like sub-grids) -->
      <ng-template #container></ng-template>
    </div>`,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridstackItemComponent implements OnDestroy {

  /** container to append items dynamically */
  @ViewChild('container', { read: ViewContainerRef, static: true}) public container?: ViewContainerRef;

  /** list of options for creating/updating this item */
  @Input() public set options(val: GridStackNode) {
    if (this.el.gridstackNode?.grid) {
      // already built, do an update...
      this.el.gridstackNode.grid.update(this.el, val);
    } else {
      // store our custom element in options so we can update it and not re-create a generic div!
      val.el = this.el;
      this._options = val;
    }
  }
  /** return the latest grid options (from GS once built, otherwise initial values) */
  public get options(): GridStackNode {
    return this.el.gridstackNode || this._options || {el: this.el};
  }

  private _options?: GridStackNode;

  /** return the native element that contains grid specific fields as well */
  public get el(): GridItemCompHTMLElement { return this.elementRef.nativeElement; }

  /** clears the initial options now that we've built */
  public clearOptions() {
    delete this._options;
  }

  constructor(private readonly elementRef: ElementRef<GridItemHTMLElement>) {
    this.el._gridItemComp = this;
  }

  public ngOnDestroy(): void {
    delete this.el._gridItemComp;
  }
}
