import { Component, OnInit, Input, ViewChild, Renderer2,
    ElementRef, OnDestroy, ChangeDetectorRef,
    OnChanges, SimpleChanges, ChangeDetectionStrategy, NgZone } from '@angular/core';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { ScrollbarDirective } from '../../scrollbar/scrollbar.directive';
import { ColumnGroup } from '../../types';
import { SelectedRow } from '../../services/state';
import { SCROLL_X_ACTION, SCROLL_Y_ACTION, SCROLL_X_REACH_START_ACTION } from '../../types/constant';
import { DatagridService } from '../../services/datagrid.service';
import { DatagridComponent } from '../../datagrid.component';
import { DataResult } from '../../services/state';


@Component({
    selector: 'datagrid-body',
    templateUrl: './body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridBodyComponent implements OnInit, OnDestroy, OnChanges {

    psConfig = { swipeEasing: true,  minScrollbarLength: 15, handlers: ['click-rail', 'drag-thumb', 'wheel', 'touch'] };
    psConfigLeft = { suppressScrollX: true, suppressScrollY: false };

    top: number;
    height: number;
    width: number;
    colsWidth: number;
    leftFixedWidth: number;
    rightFixedWidth: number;
    rowHeight: number;
    bodyStyle: any;
    scrollTop = 0;
    scrollLeft = 0;
    deltaTopHeight = 0;
    wheelHeight = 0;
    fixedRightScrollLeft = 0;
    showRightShadow = false;

    @Input() columnsGroup: ColumnGroup;
    // 虚拟加载
    @Input() topHideHeight = 0;
    @Input() bottomHideHeight = 0;

    @Input() startRowIndex = 0;
    @Input() data: any;

    @ViewChild('ps') ps?: ScrollbarDirective;
    // @ViewChild('psContainer') psc: ElementRef;
    // @ViewChild('topDiv') topDiv: ElementRef;
    // @ViewChild('bottomDiv') bottomDiv: ElementRef;
    @ViewChild('datatable') datatableEl: ElementRef;

    private rowHoverSubscription: Subscription;

    private scrollTimer: any = null;

    currentRowId =  undefined;
    gridsize$ = this.dfs.gridSize$;
    selectedRowId$ = this.dfs.currentRow$.pipe(
        map( (row: SelectedRow) => {
            this.dg.selectedRow = row;
            if (row) {
                return row.id;
            }
            return undefined;
        })
    );

    constructor(
        private cd: ChangeDetectorRef, private el: ElementRef,
        private dfs: DatagridFacadeService, public dg: DatagridComponent,
        private render: Renderer2, private dgs: DatagridService, private zone: NgZone) {
    }

    ngOnInit(): void {
        const initSubscrition = this.gridsize$.subscribe(state => {
            if (state) {
                this.top = state.headerHeight;
                const pagerHeight = state.pagerHeight;
                this.height = state.height - this.top - pagerHeight;
                this.width = state.width;
                this.rowHeight = state.rowHeight;
                this.columnsGroup = state.columnsGroup;
                this.leftFixedWidth = this.columnsGroup.leftFixedWidth;
                this.rightFixedWidth = this.columnsGroup.rightFixedWidth;
                this.colsWidth = this.columnsGroup.normalWidth;
                this.setWheelHeight();
                this.fixedRightScrollLeft = this.width - this.rightFixedWidth;
                this.bodyStyle = this.getBodyStyle();

                if (this.colsWidth + this.leftFixedWidth === this.fixedRightScrollLeft) {
                    this.showRightShadow = false;
                } else {
                    this.showRightShadow = true;
                }

                this.cd.detectChanges();
                this.ps.update();
            }
        });

        this.dgs.onDataSourceChange.subscribe(() => {
            this.ps.scrollToTop();
        });

        this.selectedRowId$.subscribe(id => {
            this.currentRowId = id;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.setWheelHeight();
            this.ps.update();
            this.cd.detectChanges();
        }
    }

    ngOnDestroy() {
        this.rowHoverSubscription.unsubscribe();
        this.rowHoverSubscription = null;
    }

    trackByRows = (index: number, row: any) => {
        return row[this.dg.idField];
    }

    private setWheelHeight() {
        this.wheelHeight = this.dg.pagination ?
            this.dg.pageSize * this.rowHeight : this.dg.total *  this.rowHeight;
    }

    private getBodyStyle() {
        return {
            width: `${this.width}px`,
            height: `${this.height}px`
        };
    }

    onScrollToX($event: any) {
        const x = $event.target.scrollLeft;
        this.scrollLeft = x;
        this.fixedRightScrollLeft = this.scrollLeft + this.width - this.rightFixedWidth;

        if (this.fixedRightScrollLeft === this.colsWidth + this.leftFixedWidth) {
            this.showRightShadow = false;
        } else {
            this.showRightShadow = true;
        }

        this.cd.detectChanges();
        this.dgs.onScrollMove(x, SCROLL_X_ACTION);
    }

    onScrollToY($event: any) {
        const y = $event.target.scrollTop;
        this.scrollYMove(y);
        this.dg.scrollY.emit(y);
        this.dgs.onScrollMove(y, SCROLL_Y_ACTION);
    }

    onScrollYEnd($event: any) {
        const y = $event.target.scrollTop;
    }

    onPsXReachStart($event: any) {
        const x = $event.target.scrollLeft;
        this.dgs.onScrollMove(x, SCROLL_X_REACH_START_ACTION);
    }

    onPsXReachEnd($event: any) {
        this.showRightShadow = false;
    }

    private scrollYMove(y: number, isUp: boolean = false) {
        this.dfs.setScrollTop(y);
        this.scrollTop = y;
        if (!this.dg.virtualized) {
            return;
        }

        this.dfs.updateVirthualRows(this.scrollTop);
        if (this.dg.virtualized && this.dg.virtualizedAsyncLoad) {

            if (this.needFetchData()) {
                if (this.scrollTimer) {
                    clearTimeout(this.scrollTimer);
                }
                this.scrollTimer = setTimeout(() => {
                    this.scrolling(isUp);
                }, 100);
            } else {
                const vs = this.dfs.getVirtualState();
            }
        }
    }

    private needFetchData() {
        const virtualRowPos = this.getVirtualRowPosition();
        if (!virtualRowPos) { return false; }

        const { top, bottom, containerBottom } = { ...virtualRowPos };

        if (this.bottomHideHeight === 0) {
            return false;
        }

        if (top < 0  && bottom > containerBottom) {
            return false;
        }
        return true;
    }

    private getVirtualRowPosition(): {top: number, bottom: number, containerBottom: number} {
        const headerHeight = this.top;
        const bodyRect = this.dg.getBoundingClientRect(this.el);
        const datatableRect = this.dg.getBoundingClientRect(this.datatableEl);
        const topDivHeight = datatableRect.top - bodyRect.top - headerHeight;
        const bottomDivHeight = datatableRect.bottom;
        const top = Math.floor(topDivHeight);
        const bottom = Math.floor(bottomDivHeight);
        // grid 容器距底部的尺寸
        const containerBottom = this.dg.getBoundingClientRect(this.ps.elementRef).bottom;
        return { top, bottom, containerBottom };
    }

    private scrolling(isUp: boolean) {

        const virtualRowPos = this.getVirtualRowPosition();
        if (!virtualRowPos) { return; }

        const { top, bottom, containerBottom } = { ...virtualRowPos };

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
            this.dg.loading = true;
            this.dg.fetchData(prevPager, pi.pageSize).subscribe( (r: DataResult) => {
                this.dg.loading = false;
                const { items, pageIndex, pageSize, total } = {...r};
                this.dfs.setPagination(pageIndex, pageSize, total);
                const newData = items.concat(allItems);
                // this.startRowIndex = pageSize;

                const idx = (prevPager - 1) * pageSize;
                this.dfs.getVirtualState().rowIndex = idx;
                this.dfs.loadData(newData);
                this.startRowIndex = idx;
            });
        } else if (bottom < containerBottom) {
            // 向下连续滚动
            if (this.data.length + vs.rowIndex >= this.dg.total || allItems.length === this.dg.total) {
                return;
            }

            const nextPager = Math.floor(this.startRowIndex / pi.pageSize) + 2;

            // console.log('fetchData - ↓', this._index);
            this.dg.loading = true;
            this.dg.fetchData(nextPager, pi.pageSize).subscribe( (r: DataResult) => {
                this.dg.closeLoading();
                const { items, pageIndex, pageSize, total } = {...r};
                this.dfs.setPagination(pageIndex, pageSize, total);
                const newData = allItems.concat(items);
                this.dfs.loadData(newData);
                this.startRowIndex += pageSize;
            });
        }
    }

    private reload(isUp: boolean) {
        const _pageSize = this.dg.pageSize;
        const rowHeight = this.dg.rowHeight;
        const top  = this.scrollTop;
        const index = Math.floor(top / rowHeight);
        const nextPage = Math.floor(index / _pageSize) + 1;

        this.dg.showLoading();
        this.dg.fetchData(nextPage, _pageSize).subscribe( (res: DataResult) => {
            this.dg.closeLoading();
            const { items, pageIndex, pageSize, total } = {...res};
            this.dfs.setPagination(pageIndex, pageSize, total);

            const idx = (nextPage - 1) * _pageSize;
            this.dfs.getVirtualState().rowIndex = idx;
            this.dfs.loadDataForVirtual(items);
            this.startRowIndex = idx;
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


}
