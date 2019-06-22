import { Component, OnInit, Input, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyRowComponent } from './body-row.component';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { DataColumn } from '../../types';
import { DatagridService } from '../../services/datagrid.service';

@Component({
    selector: 'datagrid-fixed-row',
    template: `
    <div class="f-datagrid-body-row" [ngStyle]="rowStyle" [ngClass]="cls" #rowEl>

        <div class="f-datagrid-cell-group " #leftFixedContainer [style.width.px]="leftFixedWidth" [style.height.px]="rowHeight">
            <!--行号-->
            <div class="f-datagrid-cell f-datagrid-cell-rownumber" *ngIf="datagrid.showRowNumber" [ngStyle]="{'width': datagrid.rowNumberWidth + 'px', 'height': rowHeight +'px', 'line-height': rowHeight + 'px'}">

                <div class="f-datagrid-cell-content" [style.height.px]="rowHeight" #cellContainer>
                    {{ index + 1 }}
                </div>

            </div>

            <!-- 全选checkbox 
            <div class="f-datagrid-cell-header" *ngIf="datagrid.showCheckbox && datagrid.multiSelect">
                <xui-datagrid-cell [width]="36"  [height]="36">
                    <xui-checkbox [color]="'p-success'"></xui-checkbox>
                </xui-datagrid-cell>
            </div> -->

            <datagrid-body-cell *ngFor="let col of leftFixedCols;trackBy:trackByColumns; let i = index;"
                (cellClick)="onCellClick($event, data[col.field], data, i)"
                [width]="col.width" [left]="col.left" [height]="rowHeight" [column]="col" [rowData]="data" [rowIndex]="index">
            </datagrid-body-cell>
        </div>

    </div>
    `,
})
export class DatagridBodyFixedRowComponent extends DatagridBodyRowComponent {

    @Input() leftFixedCols: DataColumn[];
    @Input() rightFixedCols: DataColumn[];
    @Input() leftFixedWidth: number;
    @Input() rightFixedWidth: number;

    constructor(public datagrid: DatagridComponent,
        dfs: DatagridFacadeService,
        dgSer: DatagridService,
        el: ElementRef,
        zone: NgZone,
        render: Renderer2) {
        super(datagrid, dfs, dgSer, el, zone, render);
    }

}
