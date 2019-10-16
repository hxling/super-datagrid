import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { DATAGRID_REST_SERVICEE } from '@farris/ui-datagrid';

@Component({
    selector: 'auto-height-demo',
    templateUrl: './auto-height-demo.component.html',
    providers: [
        DemoDataService,
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class AutoHeightDemoComponent implements OnInit {
    columns = [];
    items;
    total = 0;
    pageSize = 100;

    fields = [];

    @ViewChild('gridContainer') gc: ElementRef;

    constructor(private dds: DemoDataService) { }

    ngOnInit(): void {
        this.columns = [
            { field: 'id', width: 100, title: 'ID'},
            { field: 'name', width: 130, title: '姓名'},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司'},
            { field: 'nianxin', width: 70, title: '年薪'},
            { field: 'zhiwei', width: 100, title: '职位' }
        ];

    }

}
