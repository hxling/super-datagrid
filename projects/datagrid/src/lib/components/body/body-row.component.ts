import { Component, OnInit, Input, ViewChild, ElementRef, NgZone, Renderer2, AfterViewInit } from '@angular/core';
import { DataColumn } from '../../types';
import { DatagridComponent } from '../../datagrid.component';
import { isPlainObject } from 'lodash-es';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DatagridService } from '../../services/datagrid.service';
@Component({
    selector: 'datagrid-row',
    template: `
    <div #rowEl class="f-datagrid-body-row" [ngStyle]="rowStyle" [ngClass]="cls">
        <div class="f-datagrid-cell-group">
            <datagrid-body-cell *ngFor="let col of columns;trackBy:trackByColumns; let i = index;"
                (cellClick)="onCellClick($event, data[col.field], data, i)"
                [width]="col.width" [left]="col.left" [height]="rowHeight" [column]="col" [rowData]="data" [rowIndex]="index">
            </datagrid-body-cell>
        </div>
    </div>
    `,
})
export class DatagridBodyRowComponent implements OnInit, AfterViewInit {

    rowStyle: any;
    cls: any;
    
    @Input() rowHeight: number;
    @Input() odd = false;
    @Input() data: any;
    @Input() top: number;
    @Input() minWidth: number;
    @Input() index: number;
    @Input() columns: DataColumn[];
    @Input() isSelected = false;


    @ViewChild('rowEl') rowEl: ElementRef;
    constructor(public datagrid: DatagridComponent, 
        private dfs: DatagridFacadeService,
        private dgSer: DatagridService,
        private el: ElementRef,
        private zone: NgZone,
        private render: Renderer2) { }

    ngOnInit(): void {
        this.rowStyle = this.initStyle();
        this.cls  = {
            'f-datagrid-row-odd': this.odd && this.datagrid.striped,
            'f-datagrid-row-even': !this.odd && this.datagrid.striped,
            'f-datagrid-row-selected': this.isSelected
        }
    }

    ngAfterViewInit() {
        this.registerMouseEvents();
    }

    trackByColumns(index: number, column: DataColumn): string { return column.field; }

    private initStyle() {
        let css = {};
        if (this.datagrid) {
            css = {
                minWidth: `${this.minWidth}px`,
                height: this.rowHeight + 'px',
                lineHeight: (this.rowHeight - 16) + 'px',
                transform: `translate3d(0px, ${this.top}px, 0px)`
            };

            if (this.datagrid.rowStyler) {
                const cusCss = this.datagrid.rowStyler.call(this.datagrid, this.data);
                if (cusCss && isPlainObject(cusCss)) {
                    css = Object.assign(css, cusCss);
                }
            }
        }

        return css;
    }

    private registerMouseEvents() {
        this.zone.runOutsideAngular(() => {
            this.render.listen(this.el.nativeElement, 'mouseenter', () => {
                this.dgSer.onRowHover(this.index, this.data, true);
            });
            this.render.listen(this.el.nativeElement, 'mouseleave', () => {
                this.dgSer.onRowHover(this.index, this.data, false);
            });

            // this.render.listen(this.el.nativeElement, 'click', () => {
                // this.dgSer.onRowClick(this.index, this.data);
                // this.store.dispatch({type: 'CLICK_ROW', payload: { index: this.index, data: this.data }});
                // this.store.dispatch(new ClickDataGridRow({ id: this.data[this.datagrid.idField], index: this.index, data: this.data }));
            // });
        });
    }

    onCellClick(event: any, val, rowData, index) {
        
    }
}
