import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { DATAGRID_REST_SERVICEE } from '@farris/ui-datagrid';

@Component({
    selector: 'group-rows-demo',
    templateUrl: './group-rows-demo.component.html',
    providers: [
        DemoDataService,
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class GroupRowsDemoComponent implements OnInit {
    items;
    total = 0;
    pageSize = 100;

    dataLength = 5000;

    title = 'farris-datagrid';
    columns = [];

    @ViewChild('gridContainer') gc: ElementRef;

    constructor(private dds: DemoDataService) {}

    ngOnInit() {
        this.columns = [
            { field: 'id', width: 100, title: 'ID', groupFooter: {formatter: this.formatterGroupFooterRow, options: { text: '合计' } } },
            { field: 'name', width: 130, title: '姓名', groupFooter: { options: { calculationType: 'count' } }},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司', groupFooter: { formatter: this.formatterGroupFooterRow, options: { text: '最大值' }}},
            { field: 'nianxin', width: 70, title: '年薪', groupFooter: { options: { calculationType: 'max' }}},
            { field: 'zhiwei', width: 100, title: '职位' }
        ];

        this.onresize();
    }

    @HostListener('window:resize')
    onresize() {
        this.gc.nativeElement.style.height = (window.innerHeight - 140) + 'px';
    }

    formatterGroupFooterRow = (v, d, i) => {
        return `<b>${v}</b>`;
    }

    groupRowFormatter = (row) => {
        return `<span style="color:red; padding-left:3px; "><b>${row['value']}</b></span>`;
    }
}
