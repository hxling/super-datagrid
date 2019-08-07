import { DatagridFacadeService } from './../../services/datagrid-facade.service';
import { DatagridService } from './../../services/datagrid.service';

import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataColumn } from '../../types';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyComponent } from './datagrid-body.component';


@Component({
    selector: 'datagrid-rows',
    templateUrl: './datagrid-rows.component.html',
})
export class DatagridRowsComponent implements OnInit, AfterViewInit {

    @Input() startRowIndex: number;
    @Input() data: any;
    @Input() columns: DataColumn[];
    @ViewChild('tableEl') tableEl: ElementRef;

    constructor(public dg: DatagridComponent, public dgb: DatagridBodyComponent, public el: ElementRef,
                private dgs: DatagridService, private dfs: DatagridFacadeService) { }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (!this.dg.nowrap) {
                const trheights = this.getTrDomHeight();
                this.dgb.updateRowHeight(trheights);
                // this.dgb.rowHeightList = trheights;
            }
        });
    }

    private getTrDomHeight() {
        const trDoms = this.el.nativeElement.querySelectorAll('.f-datagrid-body-row');
        const arr = [];
        trDoms.forEach(tr => arr.push(tr.offsetHeight ));
        return arr;
    }
}
