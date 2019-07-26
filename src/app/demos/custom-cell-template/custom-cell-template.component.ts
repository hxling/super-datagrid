import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'custom-cell',
    templateUrl: './custom-cell.component.html',
    providers: [
        DemoDataService
    ]
})
export class CustomCellComponent implements OnInit {
    showLoading = false;
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;

    @ViewChild('cell1') cell1: TemplateRef<any>;
    @ViewChild('cell2') cell2: TemplateRef<any>;

    constructor(private dds: DemoDataService) {}

    ngOnInit() {

        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名', template: this.cell2, align: 'center'},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'nianxin', width: 70, title: '年薪'},
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司' },
            { field: 'zhiwei', width: 100, title: '职位' },
            { title: '管理', width: 200, template: this.cell1, align: 'center', hAlign: 'center', fixed: 'right' }
        ];

        this.total = 1000;
        this.items = this.dds.createData(1000);
    }

    onDeleteClick(event: MouseEvent, ctx: any) {
        console.log(ctx);
        event.stopPropagation();
    }
}
