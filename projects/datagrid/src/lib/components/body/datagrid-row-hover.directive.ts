import { DatagridComponent } from './../../datagrid.component';
import { Directive, HostListener, Input, NgZone, OnInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
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

    constructor(private dgb: DatagridBodyComponent, private dg: DatagridComponent, private el: ElementRef,
                private zone: NgZone, private render: Renderer2) {
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
