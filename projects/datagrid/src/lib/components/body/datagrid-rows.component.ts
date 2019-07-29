
import { Component, OnInit, Input } from '@angular/core';
import { DatagridFacadeService } from './../../services/datagrid-facade.service';
import { DataColumn } from '../../types';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyComponent } from './datagrid-body.component';


@Component({
    selector: 'datagrid-rows',
    templateUrl: './datagrid-rows.component.html',
})
export class DatagridRowsComponent implements OnInit {

    @Input() startRowIndex: number;
    @Input() data: any;
    @Input() columns: DataColumn[];


    constructor(public dg: DatagridComponent, public dgb: DatagridBodyComponent, private dfs: DatagridFacadeService) { }

    ngOnInit(): void { }
}
