/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 07:47:12
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-12 17:41:34
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import {
    Component, OnInit, Input, ViewChild, Renderer2,
    ElementRef, OnDestroy, ChangeDetectorRef,
    OnChanges, SimpleChanges, ChangeDetectionStrategy, NgZone
} from '@angular/core';

import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { ScrollbarDirective } from '../../scrollbar/scrollbar.directive';
import { ColumnGroup } from '../../types';
import { SelectedRow, DataResult } from '../../services/state';
import { SCROLL_X_ACTION, SCROLL_Y_ACTION, SCROLL_X_REACH_START_ACTION } from '../../types/constant';
import { DatagridService } from '../../services/datagrid.service';
import { DatagridComponent } from '../../datagrid.component';

@Component({
    selector: 'datagrid-body',
    templateUrl: './body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridBodyComponent implements OnInit, OnDestroy, OnChanges {

    psConfig = { swipeEasing: true, minScrollbarLength: 15, handlers: ['click-rail', 'drag-thumb', 'wheel', 'touch'] };
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
    maxScrollLeft = 0;
    showRightShadow = false;

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

    private scrollTimer: any = null;

    gridsize$ = this.dfs.gridSize$;
    selectedRow$ = this.dfs.selectRow$;
    unSelectRow$ = this.dfs.unSelectRow$;

    currentRowId = undefined;

    private _hoverRowIndex = -1;
    get hoverRowIndex(): number {
        return this._hoverRowIndex;
    }
    set hoverRowIndex(rowIdx: number) {
        this._hoverRowIndex = rowIdx;
        this.cd.detectChanges();
    }

    constructor(
        private cd: ChangeDetectorRef, private el: ElementRef,
        private dfs: DatagridFacadeService, public dg: DatagridComponent,
        private render: Renderer2, private dgs: DatagridService, private zone: NgZone) {
    }

    ngOnInit(): void {
        this.listenSubjects();
    }

    private listenSubjects() {
        const initSubscrition = this.gridsize$.subscribe(state => {
            if (state) {
                this.top = this.dg.realHeaderHeight;
                const pagerHeight = state.pagerHeight;
                const footerHeight = this.dg.showFooter ? this.dg.footerHeight * this.dg.footerData.length : 0;
                this.height = state.height - this.top - pagerHeight - footerHeight;
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

                this.cd.detectChanges();
                this.ps.update();
            }
        });
        this.dg.subscriptions.push(initSubscrition);

        this.dg.subscriptions.push(
            this.dfs.columnResize$.subscribe((cg: ColumnGroup) => {
                this.updateColumnSize(cg);
                this.cd.detectChanges();
            })
        );

        this.dg.subscriptions.push(
            this.dgs.onDataSourceChange.subscribe(() => {
                this.ps.scrollToTop();
            })
        );

        this.dg.subscriptions.push(
            this.selectedRow$.subscribe((row: SelectedRow) => {
                if (row) {
                    this.currentRowId = row.id;
                    this.dg.selectedRow = row;
                }
                this.dg.selectChanged.emit(row);
                this.cd.detectChanges();
            })
        );
        this.dg.subscriptions.push(
            this.unSelectRow$.subscribe((prevRow: SelectedRow) => {
                this.currentRowId = undefined;
                this.dg.selectedRow = null;
                this.dg.unSelect.emit(prevRow);
                this.cd.detectChanges();
            })
        );
        this.dg.subscriptions.push(
            this.dfs.selectAll$.subscribe((rows: SelectedRow[]) => {
                this.dg.selectAll.emit(rows);
                this.cd.detectChanges();
            })
        );

        this.dg.subscriptions.push(
            this.dfs.checkRow$.subscribe((row: SelectedRow) => {
                this.dg.checked.emit(row);
                this.dgs.onCheckedRowsCountChange();
                this.cd.detectChanges();
            })
        );

        this.dg.subscriptions.push(
            this.dfs.clearSelections$.subscribe(() => {
                this.currentRowId = undefined;
                this.dg.selectedRow = null;

                if (this.dg.checkOnSelect) {
                    this.dgs.onCheckedRowsCountChange();
                }
                this.dg.unSelectAll.emit();
                this.cd.detectChanges();
            })
        );
        this.dg.subscriptions.push(
            this.dfs.unCheckRow$.subscribe((prevRow: SelectedRow) => {
                this.dg.unChecked.emit(prevRow);
                this.dgs.onCheckedRowsCountChange();
                this.cd.detectChanges();
            })
        );

        this.dg.subscriptions.push(
            this.dfs.checkAll$.subscribe((rows: SelectedRow[]) => {
                this.dg.checkAll.emit(rows);
                this.cd.detectChanges();
            })
        );

        this.dg.subscriptions.push(
            this.dfs.clearCheckeds$.subscribe((rows: SelectedRow[]) => {
                if (this.dg.selectOnCheck) {
                    this.currentRowId = undefined;
                    this.dg.selectedRow = null;
                }
                this.dg.unCheckAll.emit(rows);
                this.dgs.onCheckedRowsCountChange();
                this.cd.detectChanges();
            })
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.setWheelHeight();
            this.ps.update();
            this.cd.detectChanges();
        }
    }

    ngOnDestroy() {
    }

    updateRowHeight(list: number[]) {
        this.wheelHeight = list.reduce((r, c) => r + c , 0);
        if (this.fixedLeftEl) {
            const trdoms = this.fixedLeftEl.nativeElement.querySelectorAll('.fixed-left-row');
            trdoms.forEach( (tr, i) => tr.style.height = list[i] + 'px' );
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
            this.wheelHeight = this.dg.pagination ?
            this.dg.pageSize * this.rowHeight : this.dg.total * this.rowHeight;
        }
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

}
