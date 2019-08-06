import { Component, OnInit, Input, Output, EventEmitter, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { PaginationControlsDirective } from './../../pagination/pagination-controls.directive';
import { PaginationControlsComponent } from '../../pagination/pagination-controls.component';

@Component({
    selector: 'datagrid-pager',
    template: `
    <div class="f-datagrid-pager" #pagerContainer>
        <pagination-controls #pager [id]="id" [maxSize]="maxSize" [directionLinks]="directionLinks"
            [autoHide]="autoHide" [responsive]="responsive" [previousLabel]="previousLabel" [nextLabel]="nextLabel"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)">
        </pagination-controls>
    </div>
    `
})
export class DatagridPagerComponent implements OnInit, AfterViewInit {
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
    @Output() pageSizeChange = new EventEmitter();

    @ViewChild('pagerContainer') pc: ElementRef;
    @ViewChild('pager') pager: PaginationControlsComponent;

    get pagination(): PaginationControlsDirective {
        return this.pager.paginationDirective;
    }

    outerHeight: number;

    constructor(public el: ElementRef) {}

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.outerHeight = this.pc.nativeElement.offsetHeight;
    }

    onPageChange(pageIndex: any) {
        this.pageChange.emit(Number.parseInt(pageIndex, 10));
    }

    onPageSizeChange(pageSize: any) {
        this.pageSizeChange.emit(Number.parseInt(pageSize, 10));
    }
}
