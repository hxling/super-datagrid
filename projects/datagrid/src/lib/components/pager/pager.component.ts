import { ChangeDetectorRef } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-17 10:22:39
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, AfterViewInit, ViewChild, HostBinding } from '@angular/core';
import { PaginationControlsDirective } from './../../pagination/pagination-controls.directive';
import { PaginationControlsComponent } from '../../pagination/pagination-controls.component';

@Component({
    selector: 'datagrid-pager',
    template: `
    <div class="f-datagrid-pager" #pagerContainer [ngStyle]="styles">
        <pagination-controls #pager [id]="id" [maxSize]="maxSize" [directionLinks]="directionLinks" [showPageList]="showPageList"
            [autoHide]="autoHide" [responsive]="responsive" [previousLabel]="previousLabel" [nextLabel]="nextLabel"
            [message]="'datagrid.pagination.message' | locale | replaceX: pageSize: total "
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
    @Input() showPageList = false;
    @Input() locked = false;

    @Output() pageChange = new EventEmitter();
    @Output() pageSizeChange = new EventEmitter();

    @ViewChild('pagerContainer') pc: ElementRef;
    @ViewChild('pager') pager: PaginationControlsComponent;

    get pagination(): PaginationControlsDirective {
        return this.pager.paginationDirective;
    }


    get pageSize() {
        return this.pagination.getPageSize();
    }

    get total() {
        return this.pagination.getTotalItems();
    }

    outerHeight: number;
    styles = { opacity: 1 };

    constructor(public el: ElementRef, private cd: ChangeDetectorRef) {}

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

    lock() {
        this.locked = true;
        this.styles = {opacity: 0.5 };
        this.cd.detectChanges();
    }
    unlock() {
        this.locked = false;
        this.styles = {opacity: 1 };
        this.cd.detectChanges();
    }
}
