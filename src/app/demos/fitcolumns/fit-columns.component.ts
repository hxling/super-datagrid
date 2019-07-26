import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'fit-columns-demo',
    templateUrl: './fit-columns.component.html',
    providers: [
        DemoDataService
    ]
})
export class FitColumnsComponent implements OnInit {
    showLoading = false;
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;


    constructor(private dds: DemoDataService) {}

    ngOnInit() {

        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 150, title: '姓名'},
            { field: 'sex', width: 80, title: '性别' }
        ];

        this.total = 1000;
        this.items = this.dds.createData(1000);
    }

}
