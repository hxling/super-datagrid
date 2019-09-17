import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'list-card-demo',
    templateUrl: './list-card-demo.component.html',
    providers: [
        DemoDataService
    ]
})
export class ListCardDemoComponent implements OnInit {
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;
    footerItems = [];

    showBorder = true;
    constructor(private dds: DemoDataService) {}

    ngOnInit(): void {
        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名' , sortable: true},
            { field: 'sex', width: 70, title: '性别'},
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否', sortable: true},
            { field: 'addr', width: 170, title: '地址'},
            { field: 'company', width: 100, title: '公司'},
            { field: 'nianxin', width: 70, title: '年薪', sortable: true, order: 'asc'},
            { field: 'zhiwei', width: 100, title: '职位'}
        ];

        this.total = 100;
        this.items = this.dds.createData(100);
        this.footerItems = this.dds.createFooterData();
    }
}
