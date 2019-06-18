import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DataColumn } from '../../types';
import { DatagridComponent } from '../../datagrid.component';
import { isPlainObject } from 'lodash-es';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
@Component({
    selector: 'datagrid-row',
    template: `
    <div #rowEl class="f-datagrid-body-row" [ngStyle]="rowStyle" [ngClass]="cls" [class.f-datagrid-row-selected]="isSelected">
        <div class="f-datagrid-cell-group">
            <datagrid-body-cell *ngFor="let col of columns;trackBy:trackByColumns; let i = index;"
                (cellClick)="onCellClick($event, data[col.field], data, i)"
                [width]="col.width" [left]="col.left" [height]="rowHeight" [column]="col" [rowData]="data" [rowIndex]="index">
            </datagrid-body-cell>
        </div>
    </div>
    `,
})
export class DatagridBodyRowComponent implements OnInit {

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
    @Input() leftFixedCols: DataColumn[];
    @Input() rightFixedCols: DataColumn[];
    @Input() leftColsWidth: number;
    @Input() rightColsWidth: number;

    @ViewChild('rowEl') rowEl: ElementRef;
    constructor(public datagrid: DatagridComponent, private dfs: DatagridFacadeService) { }

    ngOnInit(): void {
        this.rowStyle = this.initStyle();
        this.cls  = {
            'f-datagrid-row-odd': this.odd && this.datagrid.striped,
            'f-datagrid-row-even': !this.odd && this.datagrid.striped,
            'f-datagrid-row-selected': this.isSelected
        }
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


    onCellClick(event: any, val, rowData, index) {
        
    }
}
