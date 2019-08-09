import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { DatagridComponent, DATAGRID_REST_SERVICEE } from '@farris/ui-datagrid';

@Component({
    selector: 'page-scroll',
    templateUrl: './page-scroll.component.html',
    providers: [
        DemoDataService,
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class PageScrollComponent implements OnInit {
    private  allDataSource = [];
    items;
    total = 0;
    pageSize = 100;

    dataLength = 5000;

    enabelVirthualRows = true;
    title = 'farris-datagrid';

    @ViewChild('name') textbox: TemplateRef<any>;
    @ViewChild('sex') sexEditor: TemplateRef<any>;
    @ViewChild('birthday') birthdayEditor: TemplateRef<any>;
    @ViewChild('maray') marayEditor: TemplateRef<any>;
    @ViewChild('dg') dg: DatagridComponent;
    @ViewChild('gridContainer') gc: ElementRef;
    columns = [];

    constructor(private dds: DemoDataService) {}

    ngOnInit() {
        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名', editor: this.textbox },
            { field: 'sex', width: 70, title: '性别' , editor: this.sexEditor},
            { field: 'birthday', width: 120, title: '出生日期', editor: this.birthdayEditor },
            { field: 'maray', width: 70, title: '婚否', editor: this.marayEditor },
            { field: 'addr', width: 170, title: '地址', editor: this.textbox  },
            { field: 'company', width: 100, title: '公司', editor: this.textbox  },
            { field: 'nianxin', width: 70, title: '年薪', editor: this.textbox  },
            { field: 'zhiwei', width: 100, title: '职位', editor: this.textbox  }
        ];

        this.onresize();
        // this.allDataSource = this.dds.createData(5000);
        // this.showLoading = true;
        // this.dds.serverCall(this.allDataSource, 1, this.pageSize).subscribe( res => {
        //     this.items = res.items;
        //     this.total = res.total;
        //     this.showLoading = false;
        // });
    }

    @HostListener('window:resize')
    onresize() {
        this.gc.nativeElement.style.height = (window.innerHeight - 140) + 'px';
    }

    setDataLength(dataCount) {
        this.dg.restService['dataLength'] = dataCount;
        this.dg.reload();
    }

    onSelectRow($event) {
        console.log(this.dg.selectedRow);
    }

    changeDataItems(n =  20) {
        const items = this.dds.createData(n);
        this.total = items.length;
        this.pageSize = items.length;
        this.items = items;
    }

    changePageSize(event: any) {
        // this.showLoading = true;
        // this.dds.serverCall(this.allDataSource, event.pageIndex, event.pageSize).subscribe( res => {
        //     this.items = res.items;
        //     this.total = res.total;
        //     this.showLoading = false;
        // });
    }

    changePageIndex(event: any) {
        // this.showLoading = true;
        // this.dds.serverCall(this.allDataSource, event.pageIndex, event.pageSize).subscribe( res => {
        //     this.items = res.items;
        //     this.total = res.total;
        //     this.showLoading = false;
        // });
    }


    onBeginEdit(e: any) {
        // console.log('进入编辑', e);
    }

    onEndEdit(e: any) {
        // console.log('停止编辑', e);
    }
}
