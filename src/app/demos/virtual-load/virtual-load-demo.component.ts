import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'demo-virtual-load',
    templateUrl: './virtual-load-demo.component.html',
    styleUrls: ['./datagrid.css'],
    providers: [
        DemoDataService
    ]
})
export class VirtualLoadDemoComponent implements OnInit {
    psConfig = { swipeEasing: true,  minScrollbarLength: 20, handlers: ['click-rail', 'drag-thumb', 'wheel', 'touch'] };
    columns = [
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

    data = [];

    rows = {};

    constructor(private dds: DemoDataService, private cd: ChangeDetectorRef) {
        this.data = this.dds.createData(1000);
    }

    ngOnInit(): void {
        this.rows = this.getRows(0);
    }

    onScrollToY($event: any) {
        const y = $event.target.scrollTop;
        this.rows = this.getRows(y);
        this.cd.markForCheck();
        this.cd.detectChanges();
    }

    onScrollToX(event: any) {}

    onPsXReachStart(event: any) {}

    getRows(scrollTop: number) {
        const minTop =  Math.abs(scrollTop);
        const rowHeight = 36;
        const maxTop = minTop + 400;

        let top = 0;

        const rows = [];
        let topHideHeight = 0;
        let bottomHideHeight = 0;

        const data: any[] = this.data;
        // const total = this..total;

        // console.time('循环所有节点');
        for (const n of data) {
            top += rowHeight;
            if (top + rowHeight < minTop) {
                topHideHeight += rowHeight;
                continue;
            } else {
                if (top > maxTop) {
                    bottomHideHeight += rowHeight;
                    continue;
                }
            }

            rows.push(n);
        }

        // if (this.state.virtualizedAsyncLoad) {
        //     topHideHeight = this.state.virtual.rowIndex * rowHeight  + topHideHeight;
        //     bottomHideHeight = total * rowHeight - rows.length * rowHeight - topHideHeight;
        // }

        return {
            virtualRows: [...rows],
            topHideHeight,
            bottomHideHeight
        };
    }
}
