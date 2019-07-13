import { Component, OnInit, Input, ViewChild, Renderer2,
    ElementRef, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef,
    OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { PerfectScrollbarDirective } from '../../perfect-scrollbar/perfect-scrollbar.directive';
import { ColumnGroup } from '../../types';
import { SelectedRow } from './../../services/state';
import { SCROLL_X_ACTION, SCROLL_Y_ACTION, SCROLL_X_REACH_START_ACTION, FIXED_LEFT_SHADOW_CLS, ROW_HOVER_CLS } from '../../types/constant';
import { DatagridService } from '../../services/datagrid.service';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyFixedRowComponent } from './body-fixed-row.component';
import { DatagridBodyRowComponent } from './body-row.component';
import { RowHoverEventParam } from '../../types/event-params';
import { DataResult } from '../../services/state';

@Component({
    selector: 'datagrid-body',
    templateUrl: './body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridBodyComponent implements OnInit, OnDestroy, OnChanges {

    psConfig = { swipeEasing: true,  minScrollbarLength: 15 };
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
    deltaTopHeight = 0;
    whellHeight = 0;
    // 虚拟加载
    @Input() topHideHeight = 0;
    @Input() bottomHideHeight = 0;

    @Input() data: any;

    @ViewChild('ps') ps?: PerfectScrollbarDirective;
    @ViewChild('psFixedLeft') psFixedLeft?: PerfectScrollbarDirective;
    @ViewChild('fixedLeft') fixedLeftElRef: ElementRef;

    @ViewChild('topDiv') topDiv: ElementRef;
    @ViewChild('bottomDiv') bottomDiv: ElementRef;

    @ViewChildren(DatagridBodyFixedRowComponent) fixedRowsRef: QueryList<DatagridBodyFixedRowComponent>;
    @ViewChildren(DatagridBodyRowComponent) rowsRef: QueryList<DatagridBodyRowComponent>;

    private rowHoverSubscription: Subscription;

    private scrollTimer: any = null;
    private clientVirtualLoadTimer = null;

    _index = 0;

    currentRowId =  undefined;

    selectedRowId$ = this.dfs.currentRow$.pipe(
        map( (row: SelectedRow) => {
            if (row) {
                return row.id;
            }
            return undefined;
        })
    );

    constructor(
        private cd: ChangeDetectorRef, private el: ElementRef,
        private dfs: DatagridFacadeService, public datagrid: DatagridComponent,
        private render: Renderer2, private dgs: DatagridService) {
    }

    ngOnInit(): void {
        this.dfs.state$.subscribe(state => {
            if (state) {
                this.top = state.headerHeight;
                const pagerHeight = state.pagerHeight;

                this.height = state.height - this.top - pagerHeight;

                this.width = state.width;
                this.rowHeight = state.rowHeight;
                this.columnsGroup = state.columnsGroup;
                this.colsWidth = state.columnsGroup.minWidth;
                this.leftFixedWidth = state.columnsGroup.leftFixedWidth;

                this.bodyStyle = this.getBodyStyle();
            }
        });

        this.setWheelHeight();

        this.dgs.onDataSourceChange.subscribe(() => {
            this.ps.scrollToTop();
        });

        this.listenRowHoverEvent();

        this.selectedRowId$.subscribe(id => {
            this.currentRowId = id;
            this.cd.detectChanges();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.setWheelHeight();
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
        this.whellHeight = this.datagrid.pagination ?
            this.datagrid.pageSize * this.rowHeight : this.datagrid.total *  this.rowHeight;
    }

    private getBodyStyle() {
        return {
            width: `${this.width - 2}px`,
            height: `${this.height - 2}px`,
        };
    }

    private listenRowHoverEvent() {
        this.rowHoverSubscription = this.dgs.rowHover$.subscribe((e: RowHoverEventParam) => {
            this.updateHoverCls(e, this.fixedRowsRef);
            this.updateHoverCls(e, this.rowsRef);
        });
    }

    private updateHoverCls(e: RowHoverEventParam, rowsRef: QueryList<DatagridBodyRowComponent>) {
        if (rowsRef && rowsRef.length) {
            const rowCmp = this.getHoverRowComponent(rowsRef, e.index);
            if (rowCmp) {
                if (e.mouseenter && this.datagrid.rowHover) {
                    this.render.addClass(rowCmp.rowEl.nativeElement, ROW_HOVER_CLS);
                } else {
                    this.render.removeClass(rowCmp.rowEl.nativeElement, ROW_HOVER_CLS);
                }
            }
        }
    }

    private getHoverRowComponent(rowsRef: QueryList<DatagridBodyRowComponent>, index: number): DatagridBodyRowComponent {
        if (rowsRef && rowsRef.length) {
            const arr = rowsRef.filter(n => n.index === index);
            if (arr.length) {
                return arr[0];
            }
            return null;
        }
        return null;
    }


    onLeftScrollToY($event: any) {
        const y = $event.target.scrollTop;
        this.ps.scrollToY(y);
    }

    onScrollToX($event: any) {
        const x = $event.target.scrollLeft;
        if (this.fixedLeftElRef) {
            this.render.addClass(this.fixedLeftElRef.nativeElement, FIXED_LEFT_SHADOW_CLS);
        }
        this.dgs.onScrollMove(x, SCROLL_X_ACTION);
    }

    onScrollUp($event: any) {
        const y = $event.target.scrollTop;
        this.scrollYMove(y, true);
    }
    onScrollDown($event: any) {
        const y = $event.target.scrollTop;
        this.scrollYMove(y , false);
    }

    onScrollToY($event: any) {
        const y = $event.target.scrollTop;

        this.scrollTop = y;
        if (this.psFixedLeft) {
            this.psFixedLeft.scrollToY(y);
        }

        this.datagrid.scrollY.emit(y);
        this.dgs.onScrollMove(y, SCROLL_Y_ACTION);
    }

    onPsXReachStart($event: any) {
        const x = $event.target.scrollLeft;
        if (this.fixedLeftElRef) {
            this.render.removeClass(this.fixedLeftElRef.nativeElement, FIXED_LEFT_SHADOW_CLS);
        }
        this.dgs.onScrollMove(x, SCROLL_X_REACH_START_ACTION);
    }

    private scrollYMove(y: number, isUp: boolean) {
        this.dfs.setScrollTop(y);
        // 滚动后如果无需进行服务器端取数，则不执行 scrolling 方法
        if (this.clientVirtualLoadTimer) {
            clearTimeout(this.clientVirtualLoadTimer);
        }
        this.clientVirtualLoadTimer = setTimeout(() => {
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
        }, 20);
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

        // console.log(`topHieght: ${topDivRect.height}, ${vs.rowIndex * 36}`);


        const topDivHeight = topDivRect.top - bodyRect.top + topDivRect.height - headerHeight;
        const bottomDivHeight = bottomDivRect.top - bodyRect.top - headerHeight;
        const top = Math.floor(topDivHeight);
        const bottom = Math.floor(bottomDivHeight);
        // console.log(top, bottom);
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
        this.datagrid.loading = true;

        this.datagrid.fetchData(page).subscribe( (res: DataResult) => {
            this.datagrid.loading = false;
            const { items, pageIndex, pageSize, total } = {...res};
            this.dfs.setPagination(pageIndex, pageSize, total);

            const idx = (page - 1) * _pageSize;
            this.dfs.getVirtualState().rowIndex = idx;
            this._index = idx;

            this.dfs.loadDataForVirtual(items);

            this.deltaTopHeight = this.dfs.getDeltaTopHeight(this.scrollTop, idx);

            const virtualRowPos = this.getVirtualRowPosition();
            const { top: _top, bottom: _bottom } = { ...virtualRowPos };
            if (this.deltaTopHeight !== 0) {
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
        });
    }

    private getBoundingClientRect(el: ElementRef) {
        return el.nativeElement.getBoundingClientRect();
    }

}
