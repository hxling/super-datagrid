import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'datagrid-header-group',
    templateUrl: './header-group.component.html',
    providers: [
        DemoDataService
    ]
})
export class HeaderGroupDemoComponent implements OnInit {
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;

    constructor(private dds: DemoDataService) {}

    ngOnInit() {

        // this.columns = [
        //     [
        //         {title: '基本信息', colspan: 5},
        //         { field: 'addr', width: 170, title: '地址', rowspan: 2, index: 5 },
        //         { title: '工作信息', colspan: 3}
        //     ],
        //     [
        //         { field: 'id', width: 100, title: 'ID', index: 0 },
        //         { field: 'name', width: 130, title: '姓名', index: 1},
        //         { field: 'sex', width: 70, title: '性别', index: 2 },
        //         { field: 'birthday', width: 120, title: '出生日期', index: 3},
        //         { field: 'maray', width: 70, title: '婚否', index: 4},
        //         { field: 'company', width: 100, title: '公司' , index: 6},
        //         { field: 'nianxin', width: 70, title: '年薪' , index: 7},
        //         { field: 'zhiwei', width: 100, title: '职位' , index: 8}
        //     ]
        // ];

        this.columns = [
            [
                {title: '基本信息', colspan: 5, halign: 'center'},
                { field: 'addr', width: 170, title: '地址', rowspan: 3, index: 5 },
                { title: '工作信息', colspan: 3, halign: 'center'}
            ],
            [
                { field: 'id', width: 100, title: 'ID', rowspan: 2, index: 0 },
                { field: 'name', width: 130, title: '姓名', rowspan: 2, index: 1},
                { title: '自身问题', colspan: 3},
                { field: 'company', width: 100, title: '公司', rowspan: 2, index: 6},
                { field: 'nianxin', width: 70, title: '年薪', rowspan: 2 , index: 7},
                { field: 'zhiwei', width: 100, title: '职位', rowspan: 2, index: 8 }
            ],
            [
                { field: 'sex', width: 70, title: '性别' , index: 2},
                { field: 'birthday', width: 120, title: '出生日期', index: 3},
                { field: 'maray', width: 70, title: '婚否', index: 4}
            ]
        ];


        this.total = 100;
        this.items = this.dds.createData(100);
    }
}
