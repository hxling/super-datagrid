import { Component, OnInit } from '@angular/core';
import { REST_SERVICEE } from 'projects/datagrid/src/lib/services/rest.service';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'alldata-load-once',
    templateUrl: './alldata-load-once.html',
    providers: [
        DemoDataService,
        {provide: REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class AllDataLoadOnceComponent implements OnInit {
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
            { field: 'name', width: 130, title: '姓名'},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司' },
            { field: 'nianxin', width: 70, title: '年薪' },
            { field: 'zhiwei', width: 100, title: '职位' }
        ];

        this.total = 200000;
        this.items = this.dds.createData(200000);
    }
}
