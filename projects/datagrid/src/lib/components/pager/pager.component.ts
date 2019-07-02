import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'datagrid-pager',
    template: `
    <div class="farris-datagrid-pager">
        <pagination-controls #pager [id]="id" [maxSize]="maxSize" [directionLinks]="directionLinks"
            [autoHide]="autoHide" [responsive]="responsive" [previousLabel]="previousLabel" [nextLabel]="nextLabel"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)">
        </pagination-controls>
    </div>
    `
})
export class DatagridPagerComponent implements OnInit {
    id = 'Farris-DataGrid-Pagination';
    /** 显示页码的数量 */
    @Input() maxSize = 7;
    /** 是否显示页码 */
    @Input() directionLinks = true;

    @Input() autoHide = false;

    @Input() responsive = false;
    /** 上页标签 */
    @Input() previousLabel = '';
    /** 下页标签 */
    @Input() nextLabel = '';

    constructor() { }

    ngOnInit(): void { }

    onPageChange() {}

    onPageSizeChange() {}
}
