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

    @ViewChildren(DatagridBodyFixedRowComponent) fixedRowsRef: QueryList<DatagridBodyFixedRowComponent>;
    @ViewChildren(DatagridBodyRowComponent) rowsRef: QueryList<DatagridBodyRowComponent>;

    private rowHoverSubscription: Subscription;

    constructor(
        private cd: ChangeDetectorRef,
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
        if (this.datagrid.virtualized) {
            this.dfs.updateVirthualRows(y);
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
}
