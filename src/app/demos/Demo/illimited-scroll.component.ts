import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MockDataService } from '../mock-data.service';
import { DATAGRID_REST_SERVICEE, DatagridComponent } from '@farris/ui-datagrid';

@Component({
    selector: 'illimited-scroll',
    template: `
    <div #box class="d-flex flex-column" style="width: 100%; height: 300px;">
        <div region="north" class="north" style="height: 60px;background: #edfff5; border: 1px solid #cdcdcd; border-bottom: none;">
            <div class="fluid-container" style="margin: 10px">
                <div class="custom-control custom-checkbox  custom-control-inline tt-checkbox">
                    <input id="chk_useStripe" type="checkbox" #chk class="custom-control-input" [(ngModel)]="useStripe">
                    <label for="chk_useStripe" class="custom-control-label">启用 斑马线 </label>
                </div>

                <div class="custom-control custom-checkbox  custom-control-inline tt-checkbox">
                    <input id="chk_showBorder" type="checkbox" #chk class="custom-control-input" [(ngModel)]="showBorder">
                    <label for="chk_showBorder" class="custom-control-label">显示边框线 </label>
                </div>
                设置加载数据量：
                <button type="button" (click)="setDataLength(1000)">加载1000条</button>
                <button type="button" (click)="setDataLength(2000)">加载2000条</button>
                <button type="button" (click)="setDataLength(5000)">加载5000条</button>
                <button type="button" (click)="setDataLength(10000)">加载10000条</button>
                <button type="button" (click)="setDataLength(50000)">加载50000条</button>
                <button type="button" (click)="setDataLength(500000)">加载500000条</button>
            </div>
        </div>
        <div region="center" class="center flex-fill" style="border: 1px solid #cdcdcd;">
            <farris-datagrid [columns]="columns" [data]="items" #dg="datagrid" [fit]="true"
                [idField]="'FSYXDJ_DJBH'" [showBorder]="showBorder"
                [showLineNumber] ="true" [striped]="useStripe" [showCheckbox]="false" [lineNumberWidth]="60"
                [virtualized]="true" [virtualizedAsyncLoad]="true"
                [pagination]="false" [pageSize]= "pageSize" [pageIndex]="pageIndex"  [total]="total"
            ></farris-datagrid>

        </div>
        <div region="south" class="south" style="height: 80px;">
            <p style="    padding: 0;
            margin: 0;
            line-height: 32px;
            padding-top: 10px;
            font-weight: bold;
            color: #ff7f7f;">** 友情提示： 以上均为模拟数据，请勿对号入座 **</p>
        </div>
    </div>
    `,
    providers: [
        MockDataService,
        {provide: DATAGRID_REST_SERVICEE, useClass: MockDataService}
    ]
})
export class IllimitedScrollComponent implements OnInit {

    useStripe = true;
    showBorder = false;


    columns = [];
    items = [];
    total = 0;
    pageSize = 100;
    pageIndex = 1;

    @ViewChild('box') box: ElementRef;
    @ViewChild('dg') dg: DatagridComponent;
    constructor(private mds: MockDataService) { }

    ngOnInit(): void {
        this.columns = [
            { field: 'FSYXDJ_DJBH', width: 150, title: '单据编号' },
            { field: 'FSYXDJ_DJRQ', width: 130, title: '单据日期'},
            { field: 'FSYXDJ_USER', width: 170, title: '制单人' },
            { field: 'FSYXDJ_BXR_LSZGZD_ZGXM', width: 120, title: '报销人'},
            { field: 'FSYXDJ_BMID_LSBMZD_BMMC', width: 170, title: '部门'},
            { field: 'FSYXDJ_WBBH_LSWBZD_BZMC', width: 100, title: '币种' },
            { field: 'FSYXDJ_JE', width: 100, title: '金额' },
            { field: 'FSYXDJ_ZY', width: 270, title: '摘要' },
            { field: 'FSYXDJ_DJZT', width: 100, title: '状态' },
            { field: 'RODJTREE_NAME', width: 130, title: '单据类型' },
            { field: 'FSYXDJ_LCSL_CURRENTPARTICIPANT', width: 100, title: '待审批人' },
            { field: 'FSYXDJ_YXZT', width: 100, title: '影像状态' },
            { field: 'FSYXDJ_DWBH_LSBZDW_DWMC', width: 200, title: '单位' },
            { field: 'FSYXDJ_DYCS', width: 80, title: '打印次数' },
            { field: 'FSYXDJ_YCXX', width: 200, title: '退回原因' },
            { field: 'FSYXDJ_CSRMC', width: 100, title: '初审人' },
            { field: 'FSYXDJ_JHRMC', width: 100, title: '稽核人' },
            { field: 'FSYXDJ_FHRMC', width: 100, title: '复核人' },
            { field: 'FSYXDJ_LZZT', width: 130, title: '原始票据状态' }
        ];

        this.onresize();
    }

    @HostListener('window:resize')
    onresize() {
        const header = document.querySelector('.navbar-dark') as any;
        const headerHeight = header.offsetHeight;
        this.box.nativeElement.style.height = (window.innerHeight - headerHeight) + 'px';
    }

    setDataLength(dataCount) {
        this.dg.restService['dataLength'] = dataCount;
        this.dg.reload();
    }
}
