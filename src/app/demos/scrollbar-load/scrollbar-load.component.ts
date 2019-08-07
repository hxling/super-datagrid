import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { DATAGRID_REST_SERVICEE } from 'projects/datagrid/src/lib/services/rest.service';

@Component({
    selector: 'scroll-load-async',
    templateUrl: './scrollbar-load.component.html',
    providers: [
        DemoDataService,
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class ScrollBarLoadComponent implements OnInit {

    showLoading = false;
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;

    private  allDataSource = [];
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

        // this.allDataSource = this.dds.createData(100);
        // this.showLoading = true;
        // this.dds.serverCall(this.allDataSource, 1, this.pageSize).subscribe( res => {
        //     this.items = res.items;
        //     this.total = res.total;
        //     this.showLoading = false;
        // });
    }


    onScrollY(y: number) {
        // console.log(y);
    }
}
