import { Directive, Input, NgZone, ElementRef, Renderer2, AfterViewInit, OnDestroy, Optional } from '@angular/core';
import { DataColumn } from '../../types/data-column';
import { DatagridComponent } from './../../datagrid.component';
import { DatagridHeaderComponent } from './datagrid-header.component';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-10 09:04:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 08:52:01
 * @QQ: 1055818239
 * @Version: v0.0.12
 */

@Directive({
    selector: '[resize-column]',
})
export class DatagridResizeColumnDirective implements AfterViewInit, OnDestroy {
    @Input('resize-column') col: DataColumn;
    resizer: HTMLSpanElement;
    resizerMouseDownListener: any;
    documentMouseMoveListener: any;
    documentMouseUpListener: any;
    dblclickListener: any;
    private dg: DatagridComponent;
    constructor(
        @Optional() public dh: DatagridHeaderComponent,
        public ngzone: NgZone, public el: ElementRef, public render: Renderer2
    ) {
        this.dg = this.dh.dg;
    }

    ngAfterViewInit() {
        if (this.isEnable) {
            this.render.addClass(this.el.nativeElement, 'f-datagrid-header-cell-resize');

            this.resizer = document.createElement('span');
            this.resizer.className = 'column-resize-bar';
            this.el.nativeElement.appendChild(this.resizer);

            this.ngzone.runOutsideAngular(() => {
                this.resizerMouseDownListener = this.onMouseDown.bind(this);
                this.resizer.addEventListener('mousedown', this.resizerMouseDownListener);
            });
        }
    }

    private isEnable() {
        return this.dg.resizeColumn && this.col.resizable;
    }

    bindDocumentEvents() {
        this.ngzone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.onMouseMove.bind(this);
            document.addEventListener('mousemove', this.documentMouseMoveListener);

            this.documentMouseUpListener = this.onMouseUp.bind(this);
            document.addEventListener('mouseup', this.documentMouseUpListener);
        });
    }

    unbindDocumentEvents() {
        if (this.documentMouseMoveListener) {
            document.removeEventListener('mousemove', this.documentMouseMoveListener);
            this.documentMouseMoveListener = null;
        }

        if (this.documentMouseUpListener) {
            document.removeEventListener('mouseup', this.documentMouseUpListener);
            this.documentMouseUpListener = null;
        }
    }

    onMouseDown(event: MouseEvent) {
        this.dg.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onMouseMove(event: MouseEvent) {
        this.dg.onColumnResize(event);
    }

    onMouseUp(event: MouseEvent) {
        this.dg.onColumnResizeEnd(event, this.col);
        this.unbindDocumentEvents();
    }

    ngOnDestroy() {
        if (this.resizerMouseDownListener) {
            this.resizer.removeEventListener('mousedown', this.resizerMouseDownListener);
        }

        this.unbindDocumentEvents();

        if (this.dblclickListener) {
            this.dblclickListener();
        }
    }
}
