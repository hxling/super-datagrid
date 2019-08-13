/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-13 19:21:06
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { DatagridComponent } from './../../datagrid.component';
import { Directive, Input, NgZone, OnInit, Renderer2, ElementRef, OnDestroy, Inject, forwardRef } from '@angular/core';
import { DatagridBodyComponent } from './datagrid-body.component';

@Directive({
    selector: '[row-hover]',
    exportAs: 'rowHover'
})
export class DatagridRowHoverDirective implements OnInit, OnDestroy {

    @Input() rowIndex: number;
    @Input('row-hover') rowData: any;

    private rowMouseEnterEvent: any;
    private rowMouseLeaveEvent: any;

    constructor(
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent,
        @Inject(forwardRef(() => DatagridBodyComponent)) public dgb: DatagridBodyComponent,
        private el: ElementRef, private zone: NgZone, private render: Renderer2) {
    }

    ngOnInit() {
        if (this.dg.rowHover) {
            this.zone.runOutsideAngular( () => {
                this.rowMouseEnterEvent = this.render.listen(this.el.nativeElement, 'mouseenter', this.onmouseenter.bind(this));
                this.rowMouseLeaveEvent = this.render.listen(this.el.nativeElement, 'mouseleave', this.onmouseleave.bind(this));
            });
        }
    }

    ngOnDestroy() {
        if (this.rowMouseEnterEvent) {
            this.rowMouseEnterEvent();
        }

        if (this.rowMouseLeaveEvent) {
            this.rowMouseLeaveEvent();
        }
    }

    onmouseenter() {
        this.dgb.hoverRowIndex = this.rowIndex;
    }

    onmouseleave() {
        this.dgb.hoverRowIndex = -1;
    }

}
