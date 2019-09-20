import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

@Component({
    selector: 'demo-scrollbar-load',
    templateUrl: './scrollbar-load-demo.component.html',
    styleUrls: ['./datagrid.css'],
    providers: [
        DemoDataService
    ]
})
export class ScrollbarLoadDemoComponent implements OnInit {
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

    rows = undefined;

    private scrollTimer: any;
    @ViewChild('scrollbar') scrollbar: ElementRef;

    constructor(private dds: DemoDataService, private cd: ChangeDetectorRef, private render: Renderer2, private ngZone: NgZone) {
        this.data = this.dds.createData(1000);
    }

    ngOnInit(): void {
        this.rows = this.getRows(0);

        this.render.listen(this.scrollbar.nativeElement, 'scroll', (e) => {
            this.ngZone.runOutsideAngular(() => {
                if (this.scrollTimer) {
                    clearTimeout(this.scrollTimer);
                }
                this.scrollTimer = setTimeout(() => {
                    this.onScrollToY(e);
                }, 50);
            });
        });
    }

    onScrollToY($event: any) {
        const y = $event.target.scrollTop;
        this.rows = this.getRows(y);
        // this.cd.markForCheck();
        // this.cd.detectChanges();
    }

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
