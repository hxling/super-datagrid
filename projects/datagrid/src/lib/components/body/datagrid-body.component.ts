import { Subscription } from 'rxjs';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 07:47:12
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-11 17:50:55
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import {
    Component, OnInit, Input, ViewChild, Renderer2,
    ElementRef, OnDestroy, ChangeDetectorRef, AfterViewInit,
    OnChanges, SimpleChanges, ChangeDetectionStrategy, NgZone, Injector, forwardRef, Inject, Optional, ApplicationRef
} from '@angular/core';

import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { ScrollbarDirective } from '../../scrollbar/scrollbar.directive';
import { ColumnGroup } from '../../types';
import { SelectedRow, DataResult, ROW_INDEX_FIELD, IS_GROUP_ROW_FIELD, GROUP_ROW_FIELD, IS_GROUP_FOOTER_ROW_FIELD } from '../../services/state';
import { SCROLL_X_ACTION, SCROLL_Y_ACTION, SCROLL_X_REACH_START_ACTION } from '../../types/constant';
import { DatagridService } from '../../services/datagrid.service';
import { DatagridComponent } from '../../datagrid.component';

@Component({
    selector: 'datagrid-body',
    templateUrl: './body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridBodyComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

    psConfig = { swipeEasing: false, minScrollbarLength: 15, handlers: ['click-rail', 'drag-thumb', 'wheel', 'touch'] };

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
    maxScrollLeft = 0;
    showRightShadow = false;
    @Input() footerHeight = 0;

    @Input() columnsGroup: ColumnGroup;
    // 虚拟加载
    @Input() topHideHeight = 0;
    @Input() bottomHideHeight = 0;

    @Input() startRowIndex = 0;
    @Input() data: any;

    @ViewChild('ps') ps?: ScrollbarDirective;
    @ViewChild('tableRows') tableRowsCmp: any;
    @ViewChild('fixedLeft') fixedLeftEl: ElementRef;
    @ViewChild('fixedRight') fixedRightEl: ElementRef;
    @ViewChild('main') mainArea: ElementRef;

    private scrollTimer: any = null;

    /** 启用分组时，数据源中自动设置行索引字段 */
    rowIndexFieldWithGroupRows = ROW_INDEX_FIELD;
    isGroupRow = IS_GROUP_ROW_FIELD;
    groupRow = GROUP_ROW_FIELD;
    isGroupFooter = IS_GROUP_FOOTER_ROW_FIELD;

    currentRowId = undefined;

    private _hoverRowIndex = -1;
    get hoverRowIndex(): number {
        return this._hoverRowIndex;
    }
    set hoverRowIndex(rowIdx: number) {
        this._hoverRowIndex = rowIdx;
        this.cd.detectChanges();
    }

    private gridSizeSubscribe: Subscription;
    private columnResizeSubscribe: Subscription;
    private onDataSourceChangeSubscribe: Subscription;
    private selectRowSubscribe: Subscription;
    private unselectRowSubscribe: Subscription;
    private selectAllSubscribe: Subscription;
    private Subscribe: Subscription;
    private checkRowSubscribe: Subscription;
    private clearSelectionsSubscribe: Subscription;
    private checkAllSubscribe: Subscription;
    private uncheckRowSubscribe: Subscription;
    private clearCheckedsSubscribe: Subscription;

    private subscriptions = [];

    public dfs: DatagridFacadeService;
    public dgs: DatagridService;
    public ngZone: NgZone;
    constructor(
        private injector: Injector,
        private app: ApplicationRef,
        @Optional() public dg: DatagridComponent,
        private cd: ChangeDetectorRef, private el: ElementRef
    ) {
        this.dfs = this.injector.get(DatagridFacadeService);
        this.dgs = this.injector.get(DatagridService);
        this.ngZone = this.injector.get(NgZone);
    }

    ngOnInit(): void {
        this.listenSubjects();
        this.dg.scrollInstance = this.ps;
        this.dgs.showGridHeader.subscribe(headerHeight => {
            this.top = headerHeight;
            this.height = this.dg.height - this.top - this.dg.pagerHeight;
            this.bodyStyle = this.getBodyStyle();
            this.cd.detectChanges();
        });

        this.dgs.rowHeightChanged.subscribe(() => {
            this.setWheelHeight();
            this.cd.detectChanges();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.setWheelHeight();
            this.ps.update();
            // if (!this.cd['destroyed']) {
            //     this.cd.detectChanges();
            // }
        }

        if (changes.footerHeight !== undefined && !changes.footerHeight.isFirstChange()) {
            this.setWheelHeight();
        }
    }

    ngOnDestroy() {
        this.destroySubscriptions();
    }

    ngAfterViewInit() {
        // this.setGroupRowViewHeight();
    }

    /** 启用分组行时，将高度重置为 100% */
    private setGroupRowViewHeight() {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                if (this.dg.groupRows) {
                    this.mainArea.nativeElement.style.height = '100%';
                    if (this.fixedLeftEl) {
                        this.fixedLeftEl.nativeElement.style.height = '100%';
                    }
                    if (this.fixedRightEl) {
                        this.fixedRightEl.nativeElement.style.height = '100%';
                    }
                    this.mainArea.nativeElement.parentElement.style.height = '100%';
                }
            }, 100);
        });
    }

    private destroySubscriptions() {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((sub: Subscription) => {
                if (sub) {
                    sub.unsubscribe();
                    sub = null;
                }
            });

            this.subscriptions = [];
        }
    }

    private listenSubjects() {
        this.destroySubscriptions();

        this.gridSizeSubscribe = this.dfs.gridSize$.subscribe(state => {
            if (state) {
                this.top = this.dg.showHeader ? this.dg.realHeaderHeight : 0;
                const pagerHeight = state.pagerHeight;
                this.height = state.height - this.top - pagerHeight;
                this.width = state.width;
                this.rowHeight = state.rowHeight;

                this.updateColumnSize(state.columnsGroup);

                this.setWheelHeight();
                this.fixedRightScrollLeft = this.scrollLeft + this.width - this.rightFixedWidth;
                this.bodyStyle = this.getBodyStyle();
                this.maxScrollLeft = this.colsWidth + this.leftFixedWidth;
                if (this.colsWidth + this.leftFixedWidth === this.fixedRightScrollLeft) {
                    this.showRightShadow = false;
                } else {
                    this.showRightShadow = true;
                }

                if (!this.cd['destroyed']) {
                    this.cd.detectChanges();
                }
                this.ps.update();
            }
        });

        this.subscriptions.push(this.gridSizeSubscribe);

        this.columnResizeSubscribe = this.dfs.columnResize$.subscribe((cg: ColumnGroup) => {
            this.updateColumnSize(cg);
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.columnResizeSubscribe);

        this.onDataSourceChangeSubscribe = this.dgs.onDataSourceChange.subscribe(() => {
            this.ps.scrollToTop();
            this.bodyStyle = this.getBodyStyle();
            this.setWheelHeight();
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.onDataSourceChangeSubscribe);

        this.selectRowSubscribe = this.dfs.selectRow$.subscribe((row: SelectedRow) => {
            if (row) {
                this.currentRowId = row.id;
            }
            this.dg.selectChanged.emit(row);
            this.cd.detectChanges();
            this.app.tick();
        });
        this.subscriptions.push(this.selectRowSubscribe);

        this.unselectRowSubscribe = this.dfs.unSelectRow$.subscribe((prevRow: SelectedRow) => {
            this.currentRowId = undefined;
            this.dg.unSelect.emit(prevRow);
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.unselectRowSubscribe);

        this.selectAllSubscribe = this.dfs.selectAll$.subscribe((rows: SelectedRow[]) => {
            this.dg.selectAll.emit(rows);
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.selectAllSubscribe);

        this.checkRowSubscribe = this.dfs.checkRow$.subscribe((row: SelectedRow) => {
            this.dg.checked.emit(row);
            // this.dgs.onCheckedRowsCountChange();
            this.checkedRowsChanged();
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.checkRowSubscribe);

        this.clearSelectionsSubscribe =  this.dfs.clearSelections$.subscribe(() => {
            this.currentRowId = undefined;
            if (this.dg.checkOnSelect) {
                // this.dgs.onCheckedRowsCountChange();
                this.checkedRowsChanged();
            }
            this.dg.unSelectAll.emit();
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.clearSelectionsSubscribe);

        this.uncheckRowSubscribe = this.dfs.unCheckRow$.subscribe((prevRow: SelectedRow) => {
            this.dg.unChecked.emit(prevRow);
            // this.dgs.onCheckedRowsCountChange();
            this.checkedRowsChanged();
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.uncheckRowSubscribe);

        this.checkAllSubscribe = this.dfs.checkAll$.subscribe((rows: SelectedRow[]) => {
            this.dg.checkAll.emit(rows);
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.checkAllSubscribe);

        this.clearCheckedsSubscribe =  this.dfs.clearCheckeds$.subscribe((rows: SelectedRow[]) => {
            if (this.dg.selectOnCheck) {
                this.currentRowId = undefined;
            }
            this.dg.unCheckAll.emit(rows);
            // this.dgs.onCheckedRowsCountChange();
            this.checkedRowsChanged();
            this.cd.detectChanges();
        });
        this.subscriptions.push(this.clearCheckedsSubscribe);

    }

    private checkedRowsChanged() {
        this.dgs.onCheckedRowsCountChange();
        const checkedRows = this.dg.checkeds;
        this.dg.checkedChange.emit(checkedRows);
    }

    /** 允许数据折行时，计算行号的行高 */
    updateRowHeight(list: any) {
        this.wheelHeight = list.reduce((r, c) => r + c , 0);
        if (this.fixedLeftEl) {
            const trdoms = this.fixedLeftEl.nativeElement.querySelectorAll('.fixed-left-row');
            const trdoms2 = this.fixedLeftEl.nativeElement.querySelectorAll('.fixed-right-row');
            trdoms.forEach( (tr, i) => {
                const _h = list[i] + 'px';
                tr.style.height = _h;
                if (trdoms2 && trdoms2.length) {
                    trdoms2[i].style.height = _h;
                }
            });
        }
        this.cd.detectChanges();
    }

    private updateColumnSize(cg: ColumnGroup) {
        this.columnsGroup = cg;
        this.leftFixedWidth = this.columnsGroup.leftFixedWidth;
        this.rightFixedWidth = this.columnsGroup.rightFixedWidth;
        this.colsWidth = this.columnsGroup.normalWidth;
    }

    private setWheelHeight() {
        if (this.dg.nowrap) {
            const rh = this.dg.rowHeight;
            this.wheelHeight = this.dg.pagination ?
                                    this.dg.pageSize * rh :
                                    (this.dg.total || this.dg.data.length) * rh;
            this.wheelHeight = this.wheelHeight - this.footerHeight;
        }
    }

    private getBodyStyle() {
        return {
            width: `${this.width}px`,
            height: `${this.height - this.footerHeight}px`
        };
    }

    onScrollToX($event: any) {
        const x = $event.target.scrollLeft;
        this.scrollLeft = x;
        this.fixedRightScrollLeft = this.scrollLeft + this.width - this.rightFixedWidth;
        if (this.fixedRightScrollLeft === this.maxScrollLeft || this.fixedRightScrollLeft > this.maxScrollLeft) {
            this.fixedRightScrollLeft = this.maxScrollLeft;
            this.showRightShadow = false;
        } else {
            this.showRightShadow = true;
        }

        this.cd.detectChanges();
        this.dgs.onScrollMove(x, SCROLL_X_ACTION);
    }

    onScrollToY($event: any) {
        if (this.dg.isRowEditing()) {
            this.dg.endRowEdit();
        }

        if (this.dg.isCellEditing()) {
            this.dg.endCellEdit();
        }

        const y = $event.target.scrollTop;
        this.scrollYMove(y);
        this.dg.scrollY.emit(y);
        this.dgs.onScrollMove(y, SCROLL_Y_ACTION);
    }

    onPsXReachStart($event: any) {
        const x = $event.target.scrollLeft;
        this.dgs.onScrollMove(x, SCROLL_X_REACH_START_ACTION);
    }

    onPsXReachEnd($event: any) {
        this.showRightShadow = false;
    }

    isChecked(rowData: any) {
        if (rowData) {
            return this.dfs.isRowChecked(rowData[this.dg.idField]);
        } else {
            return false;
        }
    }

    isSelected(rowData: any) {
        return this.dfs.isRowSelected(rowData[this.dg.idField]);
    }

    private scrollYMove(y: number, isUp: boolean = false) {
        this.dfs.setScrollTop(y);
        this.scrollTop = y;
        if (!this.dg.virtualized) {
            return;
        }

        if (!this.dg.groupRows) {
            this.dfs.updateVirthualRows(this.scrollTop);
        }

        // const virthualState = this.dfs.getVirthualRows(this.scrollTop);
        // this.startRowIndex = virthualState.startIndex;
        // this.data = virthualState.virtualRows;
        // this.topHideHeight = virthualState.topHideHeight;
        // // this.bottomHideHeight = virthualState.bottomHideHeight;
        // this.cd.detectChanges();

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

        if (top < 0 && bottom > containerBottom) {
            return false;
        }
        return true;
    }

    private getVirtualRowPosition(): { top: number, bottom: number, containerBottom: number } {
        const headerHeight = this.top;
        const bodyRect = this.dg.getBoundingClientRect(this.el);
        const datatableRect = this.dg.getBoundingClientRect(this.tableRowsCmp.tableEl);
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
            this.dg.fetchData(prevPager, pi.pageSize).subscribe((r: DataResult) => {
                this.dg.loading = false;
                const { items, pageIndex, pageSize, total } = { ...r };
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
            this.dg.fetchData(nextPager, pi.pageSize).subscribe((r: DataResult) => {
                this.dg.closeLoading();
                const { items, pageIndex, pageSize, total } = { ...r };
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
        const top = this.scrollTop;
        const index = Math.floor(top / rowHeight);
        const nextPage = Math.floor(index / _pageSize) + 1;

        this.dg.showLoading();
        this.dg.fetchData(nextPage, _pageSize).subscribe((res: DataResult) => {
            this.dg.closeLoading();
            const { items, pageIndex, pageSize, total } = { ...res };
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
                if (_bottom < this.height) {
                    this.deltaTopHeight = -this.deltaTopHeight;
                }
            }
            this.scrollTop = this.scrollTop + this.deltaTopHeight;
            this.ps.scrollToTop(this.scrollTop);
        }
    }

    toggleGroupRow(row, open = true) {
        row.expanded = open;
        this.ps.update();
    }

}
