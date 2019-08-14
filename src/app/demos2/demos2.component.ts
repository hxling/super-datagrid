/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-14 09:39:20
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 10:15:49
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit } from '@angular/core';
import { DemoDataService } from './../demos/demo-data.service';

@Component({
    selector: 'demos2-name',
    template: `
    <div class="row" style="padding: 20px 0; margin-top: 120px; height: 800px; border: 2px dashed darkorchid">

        <farris-datagrid [columns]="columns" [data]="items"
            [showLineNumber] ="true" [striped]="false" [showCheckbox]="false"
            [virtualized]="true" [fitColumns]="true" [fit]="true" [showBorder]="true"
            [pagination]="false" [pageSize]= "pageSize" [pageIndex]="pageIndex"  [total]="total"
        ></farris-datagrid>

    </div>
    `,
    providers: [
        DemoDataService
    ]
})
export class Demos2Component implements OnInit {
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;


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
