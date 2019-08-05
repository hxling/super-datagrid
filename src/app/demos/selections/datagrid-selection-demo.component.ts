import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { REST_SERVICEE } from '@farris/ui-datagrid';

@Component({
    selector: 'grid-selection',
    templateUrl: './datagrid-selection-demo.component.html',
    providers: [
        DemoDataService,
        {provide: REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class DatagridSelectionDemoComponent implements OnInit {
    items;
    total = 0;
    pageSize = 100;

    @ViewChild('box') box: ElementRef;

    useRowHover = true;
    showBorder = false;
    keepSelect = true;
    showRowNumber = true;
    useStripe = true;
    // 多选

    _useMultiSelect = false;
    get useMultiSelect() {
        return this._useMultiSelect;
    }
    set useMultiSelect(v) {
        this._useMultiSelect = v;
        if (v) {
            this.showAllCheckbox = true;
            this.showCheckbox = true;
            this.checkonselect = true;
            this.selectoncheck = true;
            this.onlySelectSelf = true;
        } else {
            this.showAllCheckbox = false;
            this.showCheckbox = false;
            this.checkonselect = false;
            this.selectoncheck = false;
            this.onlySelectSelf = false;
        }
    }

    onlySelectSelf = false;
    showAllCheckbox = false;
    checkonselect = false;
    selectoncheck = false;
    showCheckbox = false;


    columns = [
        { field: 'id', width: 100, title: 'ID' },
        { field: 'name', width: 130, title: '姓名'},
        { field: 'sex', width: 70, title: '性别'},
        { field: 'birthday', width: 120, title: '出生日期'},
        { field: 'maray', width: 70, title: '婚否'},
        { field: 'addr', width: 170, title: '地址'},
        { field: 'company', width: 100, title: '公司'},
        { field: 'nianxin', width: 70, title: '年薪'},
        { field: 'zhiwei', width: 100, title: '职位'}
    ];


    constructor(private dds: DemoDataService) {}

    ngOnInit(): void {
        this.onresize();
    }

    @HostListener('window:resize')
    onresize() {
        const header = document.querySelector('.navbar-dark') as any;
        const headerHeight = header.offsetHeight;
        this.box.nativeElement.style.height = (window.innerHeight - headerHeight) + 'px';
    }
}
