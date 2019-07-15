import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'cell-editor',
    templateUrl: './cell-editor.component.html',
    providers: [
        DemoDataService
    ]
})
export class CellEditorComponent implements OnInit {
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
            { field: 'name', width: 130, title: '姓名', editor: { type: 'textbox', bindingData: 'name'}},
            { field: 'sex', width: 70, title: '性别', editor: {type: 'input-group'} },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司' },
            { field: 'nianxin', width: 70, title: '年薪' },
            { field: 'zhiwei', width: 100, title: '职位' }
        ];

        this.total = 100;
        this.items = this.dds.createData(100);
    }
}
