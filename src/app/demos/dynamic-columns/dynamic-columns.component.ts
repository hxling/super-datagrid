import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { DATAGRID_REST_SERVICEE, CalculationType } from '@farris/ui-datagrid';

@Component({
    selector: 'dynamic-columns',
    templateUrl: './dynamic-columns.component.html',
    providers: [
        DemoDataService,
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class DynamicColumnsComponent implements OnInit {
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

        this.onresize();
    }

    @HostListener('window:resize')
    onresize() {
        this.gc.nativeElement.style.height = (window.innerHeight - 140) + 'px';
    }


    changeFields(col) {
        console.log(col);
        const chked = !col.checked;
        if (chked) {
            this.fields = [ ...this.fields, col ];
        } else {
            this.fields = this.fields.filter( c => c.field !== col.field );
        }
    }
}
