/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-07-29 08:07:54
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-12 17:04:03
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'normal-datagrid',
    templateUrl: './normal-grid.component.html',
    providers: [
        DemoDataService
    ]
})
export class NormalDatagridComponent implements OnInit {
    showLoading = false;
    columns = [];
    items = [];
    footerItems = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;

    constructor(private dds: DemoDataService) {}

    ngOnInit() {

        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名'},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司' },
            { field: 'nianxin', width: 70, title: '年薪' },
            { field: 'zhiwei', width: 100, title: '职位' }
        ];

        this.total = 100;
        this.items = this.dds.createData(100);
        this.footerItems = this.dds.createFooterData();
    }
}
