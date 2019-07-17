import { Component, OnInit, Input, ViewChild, Renderer2,
    ElementRef, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef,
    OnChanges, SimpleChanges, ChangeDetectionStrategy, NgZone } from '@angular/core';

import { Subscription, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { PerfectScrollbarDirective } from '../../perfect-scrollbar/perfect-scrollbar.directive';
import { ColumnGroup } from '../../types';
import { SelectedRow } from './../../services/state';
import { SCROLL_X_ACTION, SCROLL_Y_ACTION, SCROLL_X_REACH_START_ACTION, FIXED_LEFT_SHADOW_CLS, ROW_HOVER_CLS } from '../../types/constant';
import { DatagridService } from '../../services/datagrid.service';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyRowComponent } from './body-row.component';
import { RowHoverEventParam } from '../../types/event-params';
import { DataResult } from '../../services/state';
import { PerfectScrollbarComponent } from '../../perfect-scrollbar/perfect-scrollbar.component';

import PerfectScrollbar from 'perfect-scrollbar';

@Component({
    selector: 'datagrid-body',
    templateUrl: './body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridBodyComponent implements OnInit, OnDestroy, OnChanges {

    psConfig = { swipeEasing: true,  minScrollbarLength: 20, handlers: ['click-rail', 'drag-thumb', 'wheel', 'touch'] };
    psConfigLeft = { suppressScrollX: true, suppressScrollY: false };

    top: number;
    height: number;
    width: number;
    colsWidth: number;
    leftFixedWidth: number;
    rightFixedWidth: number;
    columnsGroup: ColumnGroup;
    rowHeight: number;
    bodyStyle: any;
    scrollTop = 0;
    scrollLeft = 0;
    deltaTopHeight = 0;
    wheelHeight = 0;
    // 虚拟加载
    @Input() topHideHeight = 0;
    @Input() bottomHideHeight = 0;

    @Input() data: any;

    @ViewChild('ps') ps?: PerfectScrollbarDirective;
    // @ViewChild('psContainer') psc: ElementRef;
    @ViewChild('topDiv') topDiv: ElementRef;
    @ViewChild('bottomDiv') bottomDiv: ElementRef;

    private rowHoverSubscription: Subscription;

    private scrollTimer: any = null;
    private clientVirtualLoadTimer = null;
    _index = 0;

    currentRowId =  undefined;

    selectedRowId$ = this.dfs.currentRow$.pipe(
        map( (row: SelectedRow) => {
            this.datagrid.selectedRow = row;
            if (row) {
                return row.id;
            }
            return undefined;
        })
    );

    // ps: any;

    constructor(
        private cd: ChangeDetectorRef, private el: ElementRef,
        private dfs: DatagridFacadeService, public datagrid: DatagridComponent,
        private render: Renderer2, private dgs: DatagridService, private zone: NgZone) {
    }

    ngOnInit(): void {

        const initSubscrition = this.dfs.state$.subscribe(state => {
            if (state) {
                this.top = state.headerHeight;
                const pagerHeight = state.pagerHeight;

                this.height = state.height - this.top - pagerHeight;

                this.width = state.width;
                this.rowHeight = state.rowHeight;
                this.columnsGroup = state.columnsGroup;
                this.colsWidth = state.columnsGroup.minWidth;
                this.leftFixedWidth = state.columnsGroup.leftFixedWidth;
                this.setWheelHeight();
                this.bodyStyle = this.getBodyStyle();
            }
        });

        this.dgs.onDataSourceChange.subscribe(() => {
            // this.ps.scrollToTop();
        });

        this.selectedRowId$.subscribe(id => {
            this.currentRowId = id;
            this.cd.detectChanges();
        });

        // this.ps = new PerfectScrollbar(this.psc.nativeElement, this.psConfig);

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.setWheelHeight();
            this.ps.update();
            // setTimeout( () => this.ps.update());
        }
    }

    ngOnDestroy() {
        this.rowHoverSubscription.unsubscribe();
        this.rowHoverSubscription = null;
    }

    trackByRows = (index: number, row: any) => {
        return row[this.datagrid.idField];
    }

    private setWheelHeight() {
        this.wheelHeight = this.datagrid.pagination ?
            this.datagrid.pageSize * this.rowHeight : this.datagrid.total *  this.rowHeight;
    }

    private getBodyStyle() {
        return {
            width: `${this.width - 2}px`,
            height: `${this.height - 2}px`,
            maxHeight: `${this.wheelHeight}px`,
        };
    }


    onScrollToX($event: any) {
        const x = $event.target.scrollLeft;
        this.scrollLeft = x;
        this.cd.detectChanges();
        this.dgs.onScrollMove(x, SCROLL_X_ACTION);
    }

    onScrollToY($event: any) {
        const y = $event.target.scrollTop;
        // console.log(y);
        this.scrollYMove(y);
        this.datagrid.scrollY.emit(y);
        this.dgs.onScrollMove(y, SCROLL_Y_ACTION);
    }

    onPsXReachStart($event: any) {
        const x = $event.target.scrollLeft;
        this.dgs.onScrollMove(x, SCROLL_X_REACH_START_ACTION);
    }

    private scrollYMove(y: number, isUp: boolean = false) {
        let scrollTop = y;
        if (y > this.datagrid.total * this.rowHeight) {
            // scrollTop = this.datagrid.total * this.rowHeight - this.height;
            // this.ps.elementRef.nativeElement.scrollTop = scrollTop;
            // this.ps.scrollToBottom(y - scrollTop  );
            // this.ps.scrollToY(scrollTop);
            console.log(scrollTop);
            // setTimeout( () => {
            //     // this.ps.scrollToBottom();
            //     this.ps.update();
            // });
            return;
        }

        this.dfs.setScrollTop(scrollTop);
        this.scrollTop = scrollTop;
        if (!this.datagrid.virtualized) {
            return;
        }

        this.dfs.updateVirthualRows(this.scrollTop);
        if (this.datagrid.virtualized && this.datagrid.virtualizedAsyncLoad) {

            if (this.needFetchData()) {
                if (this.scrollTimer) {
                    clearTimeout(this.scrollTimer);
                }
                this.scrollTimer = setTimeout(() => {
                    this.scrolling(isUp);
                }, 100);
            }
        }
    }

    private needFetchData() {
        const virtualRowPos = this.getVirtualRowPosition();
        if (!virtualRowPos) { return false; }

        const { top, bottom } = { ...virtualRowPos };

        if (this.bottomHideHeight === 0) {
            return false;
        }

        if (top < 0  && bottom > this.height) {
            return false;
        }
        return true;
    }

    private getVirtualRowPosition(): {top: number, bottom: number} {
        if (!this.topDiv || !this.bottomDiv) { return; }
        const vs = this.dfs.getVirtualState();
        const headerHeight = this.top;
        const bodyRect = this.getBoundingClientRect(this.el);
        const topDivRect = this.getBoundingClientRect(this.topDiv);
        const bottomDivRect = this.getBoundingClientRect(this.bottomDiv);

        const topDivHeight = topDivRect.top - bodyRect.top + topDivRect.height - headerHeight;
        const bottomDivHeight = bottomDivRect.top - bodyRect.top - headerHeight;
        const top = Math.floor(topDivHeight);
        const bottom = Math.floor(bottomDivHeight);

        return { top, bottom };
    }

    private scrolling(isUp: boolean) {

        const virtualRowPos = this.getVirtualRowPosition();
        if (!virtualRowPos) { return; }

        const { top, bottom } = { ...virtualRowPos };

        const vs = this.dfs.getVirtualState();
        const pi = this.dfs.getPageInfo();
        const allItems = this.dfs.getData();

        if (bottom < 0 || top > this.height) {
            // 重新计算位置并取数
            // console.log('reload');
            this.reload(isUp);
        } else if (top > 0) {
            // 向上连续滚动
            // console.log('fetchData - ↑');
            const prevPager = Math.floor(vs.rowIndex / pi.pageSize);
            this.datagrid.loading = true;
            this.datagrid.fetchData(prevPager).subscribe( (r: DataResult) => {
                this.datagrid.loading = false;
                const { items, pageIndex, pageSize, total } = {...r};
                this.dfs.setPagination(pageIndex, pageSize, total);
                const newData = items.concat(allItems);
                this._index = pageSize;

                const idx = (prevPager - 1) * pageSize;
                this.dfs.getVirtualState().rowIndex = idx;
                this._index = idx;

                this.dfs.loadData(newData);
            });
        } else if (bottom < this.height) {
            // 向下连续滚动
            if (this.data.length + vs.rowIndex >= this.datagrid.total || allItems.length === this.datagrid.total) {
                return;
            }

            const nextPager = Math.floor(this._index / pi.pageSize) + 2;

            this.datagrid.loading = true;
            // console.log('fetchData - ↓', this._index);

            this.datagrid.fetchData(nextPager).subscribe( (r: DataResult) => {
                this.datagrid.loading = false;
                const { items, pageIndex, pageSize, total } = {...r};
                this.dfs.setPagination(pageIndex, pageSize, total);
                const newData = allItems.concat(items);
                this._index += pageSize;
                this.dfs.loadData(newData);
            });
        }
    }

    private reload(isUp: boolean) {
        const _pageSize = this.datagrid.pageSize;
        const rowHeight = this.datagrid.rowHeight;
        const top  = this.scrollTop;
        const index = Math.floor(top / rowHeight);
        const page = Math.floor(index / _pageSize) + 1;
        this.datagrid.showLoading();

        this.datagrid.fetchData(page).subscribe( (res: DataResult) => {
            this.datagrid.closeLoading();
            const { items, pageIndex, pageSize, total } = {...res};
            this.dfs.setPagination(pageIndex, pageSize, total);

            const idx = (page - 1) * _pageSize;
            this.dfs.getVirtualState().rowIndex = idx;
            this._index = idx;

            this.dfs.loadDataForVirtual(items);

            this.changeScrollTop(idx);
        });
    }

    private changeScrollTop(startRowIndex: number) {
        this.deltaTopHeight = this.dfs.getDeltaTopHeight(this.scrollTop, startRowIndex);

        if (this.deltaTopHeight !== 0) {
            const virtualRowPos = this.getVirtualRowPosition();
            const { top: _top, bottom: _bottom } = { ...virtualRowPos };
            // console.log('取数前检查：✔', this.deltaTopHeight,  _top, _bottom);
            if (_top > 0) {
                this.deltaTopHeight = +this.deltaTopHeight;
            } else {
                if (_bottom <  this.height) {
                    this.deltaTopHeight = -this.deltaTopHeight;
                }
            }
            this.scrollTop = this.scrollTop + this.deltaTopHeight;
            this.ps.scrollToTop(this.scrollTop);
        }
    }

    private getBoundingClientRect(el: ElementRef) {
        return el.nativeElement.getBoundingClientRect();
    }

}
