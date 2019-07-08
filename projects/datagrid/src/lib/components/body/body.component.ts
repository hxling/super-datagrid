import { Component, OnInit, Input, ViewChild, Renderer2,
    ElementRef, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef,
    OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { PerfectScrollbarDirective } from '../../perfect-scrollbar/perfect-scrollbar.directive';
import { ColumnGroup } from '../../types';
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

        this.dgs.onDataSourceChange.subscribe(() => {
            this.ps.scrollToTop();
        });

        this.listenRowHoverEvent();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            // console.log(changes.data);
        }
    }

    ngOnDestroy() {
        this.rowHoverSubscription.unsubscribe();
        this.rowHoverSubscription = null;
    }

    trackByRows = (index: number, row: any) => {
        return row[this.datagrid.idField];
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

    onScrollToY($event: any) {
        const y = $event.target.scrollTop;
        this.scrollTop = y;
        if (this.psFixedLeft) {
            this.psFixedLeft.scrollToY(y);
        }
        if (this.datagrid.virtualized && !this.datagrid.pagination) {
            this.dfs.setScrollTop(y);
            this.scrolling();
        } else {
            this.dfs.updateVirthualRows(this.scrollTop);
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

    private scrolling() {

        this.dfs.updateVirthualRows(this.scrollTop);

        const headerHeight = this.top;
        if (!this.topDiv || !this.bottomDiv) {return; }
        const bodyRect = this.getBoundingClientRect(this.el);
        const topDivRect = this.getBoundingClientRect(this.topDiv);
        const bottomDivRect = this.getBoundingClientRect(this.bottomDiv);

        const topDivHeight = 0;
        const bottomDivHeight = bottomDivRect.top - bodyRect.top - headerHeight;
        const _top = Math.floor(topDivHeight);
        const _bottom = Math.floor(bottomDivHeight);

        const vs = this.dfs.getVirtualState();
        const pi = this.dfs.getPageInfo();

        if (_bottom < 0) {
            // 重新计算取数
        } else {
            if (_bottom < this.height) {
                const newPager = Math.floor(vs.rowIndex / pi.pageSize) + 2;
                this.datagrid.reaload(newPager).subscribe( (r: DataResult) => {
                    const { items, pageIndex, pageSize, total } = {...r};
                    this.dfs.setPagination(pageIndex, pageSize, total);
                    const newData = this.datagrid.data.concat(items);
                    this.dfs.loadData(newData);
                });
                // loadData
            } else {
                this.dfs.updateVirthualRows(this.scrollTop);
            }
        }

    }

    private getBoundingClientRect(el: ElementRef) {
        return el.nativeElement.getBoundingClientRect();
    }
}
