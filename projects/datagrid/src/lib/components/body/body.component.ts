import { Component, OnInit, Input, ViewChild, Renderer2 } from '@angular/core';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';
import { PerfectScrollbarDirective } from '../../perfect-scrollbar/perfect-scrollbar.directive';
import { ColumnGroup } from '../../types';
import { SCROLL_X_ACTION, SCROLL_Y_ACTION, SCROLL_X_REACH_START_ACTION } from '../../types/constant';
import { DatagridService } from '../../services/datagrid.service';
import { DatagridComponent } from '../../datagrid.component';

@Component({
    selector: 'datagrid-body',
    templateUrl: './body.component.html'
})
export class DatagridBodyComponent implements OnInit {

    psConfig = {swipeEasing: true};
    psConfigLeft = {suppressScrollX: true, suppressScrollY: false};

    top: number;
    height: number;
    width: number;
    colsWidth: number;
    leftFixedColsWidth: number;
    rightFixedColsWidth: number;
    columnsGroup: ColumnGroup;
    rowHeight: number;
    bodyStyle: any;

    @Input() data: any;

    @ViewChild('ps') ps?: PerfectScrollbarDirective;

    constructor(private dfs: DatagridFacadeService, public datagrid: DatagridComponent,
        private render: Renderer2, private dgSer: DatagridService) {

            // console.log(this.datagrid);
       
    }

    ngOnInit(): void {
        this.dfs.state$.subscribe(state => {
            if (state) {
                this.top = state.headerHeight;
                this.height = state.height - this.top;
                this.width = state.width;
                this.rowHeight = state.rowHeight;
                this.columnsGroup = state.columnsGroup;
                this.colsWidth = state.columnsGroup.minWidth;
                this.leftFixedColsWidth = state.columnsGroup.leftFixedWidth;
    
                this.bodyStyle = this.getBodyStyle();
            }
        });
    }

    trackByRows = (index: number, row: any) => {
        return row[this.datagrid.idField];
    }

    private getBodyStyle() {
        return {
            width: `${this.width}px`,
            height: `${this.height}px`,
        };
    }

    onLeftScrollToY($event: any) {
        const y = $event.target.scrollTop;
        this.ps.scrollToY(y);
    }

    onScrollToX($event: any) {
        const x = $event.target.scrollLeft;
        // this.render.addClass(this.fixedLeftElref.nativeElement, FIXED_LEFT_SHADOW_CLS);
        this.dgSer.onScrollMove(x, SCROLL_X_ACTION);
    }

    onScrollToY($event: any) {
        const y = $event.target.scrollTop;
        // this.psFixedLeft.scrollToY(y);
        this.dgSer.onScrollMove(y, SCROLL_Y_ACTION);
    }

    onPsXReachStart($event: any) {
        const x = $event.target.scrollLeft;
        // this.render.removeClass(this.fixedLeftElref.nativeElement, FIXED_LEFT_SHADOW_CLS);
        this.dgSer.onScrollMove(x, SCROLL_X_REACH_START_ACTION);
    }
}
