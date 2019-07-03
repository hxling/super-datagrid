import { Component, OnInit, Input, SkipSelf, Output, EventEmitter } from '@angular/core';
import { DatagridComponent } from '../../datagrid.component';

@Component({
    selector: 'datagrid-pager',
    template: `
    <div class="f-datagrid-pager">
        <pagination-controls #pager [id]="id" [maxSize]="maxSize" [directionLinks]="directionLinks"
            [autoHide]="autoHide" [responsive]="responsive" [previousLabel]="previousLabel" [nextLabel]="nextLabel"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)">
        </pagination-controls>
    </div>
    `
})
export class DatagridPagerComponent implements OnInit {
    @Input() id = 'farris-datagrid-pager';
    /** 显示页码的数量 */
    @Input() maxSize = 7;
    /** 是否显示页码 */
    @Input() directionLinks = true;

    @Input() autoHide = false;

    @Input() responsive = false;
    /** 上页标签 */
    @Input() previousLabel = '上页';
    /** 下页标签 */
    @Input() nextLabel = '下页';

    @Output() pageChange = new EventEmitter();

    constructor(@SkipSelf() private datagrid: DatagridComponent) {}

    ngOnInit(): void {
    }

    onPageChange(pageIdx: number) {
        this.pageChange.emit(pageIdx);
    }

    onPageSizeChange() {}
}
