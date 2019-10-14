/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-07-29 08:14:22
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-11 16:26:05
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
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

    st = 'md';

    constructor(private dds: DemoDataService) {}

    ngOnInit() {

        this.columns = [
            { field: 'id', width: 100, title: 'ID', resizable: true},
            { field: 'name', width: 150, title: '姓名', resizable: true},
            { field: 'sex', width: 80, title: '性别' }
        ];

        this.total = 1000;
        this.items = this.dds.createData(1000);
    }

}
