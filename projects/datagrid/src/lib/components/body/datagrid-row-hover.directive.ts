import { Directive, HostListener, Input, ChangeDetectorRef } from '@angular/core';
import { DatagridBodyComponent } from './datagrid-body.component';

@Directive({
    selector: '[row-hover]',
    exportAs: 'rowHover'
})
export class DatagridRowHoverDirective {

    @Input() rowIndex: number;
    @Input('row-hover') rowData: any;

    constructor(private dgb: DatagridBodyComponent, private cd: ChangeDetectorRef) {}

    @HostListener('mouseenter')
    onmouseenter() {
        this.dgb.hoverRowIndex = this.rowIndex;
        this.cd.detectChanges();
    }

    @HostListener('mouseleave')
    onmouseleave() {
        this.dgb.hoverRowIndex = -1;
        this.cd.detectChanges();
    }

}
