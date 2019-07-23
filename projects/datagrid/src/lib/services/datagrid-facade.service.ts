import { VirtualizedLoaderService } from './virtualized-loader.service';
import { FarrisDatagridState, initDataGridState, DataResult, CellInfo, VirtualizedState } from './state';
import { BehaviorSubject, Observable, of, merge, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataColumn, ColumnGroup } from '../types';
import { map, distinctUntilChanged, filter, switchMap, auditTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DatagridFacadeService {
    protected _state: FarrisDatagridState;
    public virtualizedService: VirtualizedLoaderService;

    store = new BehaviorSubject<FarrisDatagridState>(this._state);

    virtualRowSubject = new Subject<any>();
    gridSizeSubject = new Subject<any>();

    readonly state$ = this.store.asObservable().pipe(
        filter( (state: any) => state)
    );

    readonly columnGroup$ = this.store.asObservable().pipe(
        filter( (state: any) => state),
        map((state: FarrisDatagridState) => state.columnsGroup),
        distinctUntilChanged()
    );

    gridSize$ = this.gridSizeSubject.asObservable().pipe(
        filter( (state: any) => state),
        map((state: FarrisDatagridState) => {
            const { headerHeight, pagerHeight, width, columnsGroup, height, rowHeight } = {...state};
            return { headerHeight, pagerHeight, width, columnsGroup, height, rowHeight };
        }),
        distinctUntilChanged()
    );

    readonly data$ = this.virtualRowSubject.asObservable().pipe(
        filter(vs => vs),
        map((vs: VirtualizedState) => {
            return {
                index: vs.startIndex || 0,
                rows: vs.virtualRows,
                top: vs.topHideHeight,
                bottom: vs.bottomHideHeight
            };
        })
    );

    readonly currentRow$ = this.store.asObservable().pipe(
        filter( (state: any) => state),
        map((state: FarrisDatagridState) => state.currentRow),
        distinctUntilChanged()
    );

    readonly currentCell$ = this.store.asObservable().pipe(
        filter( (state: any) => state),
        map(state => state.currentCell),
        distinctUntilChanged()
    );

    constructor(private http: HttpClient) {
        this._state = initDataGridState;
        this.virtualizedService = new VirtualizedLoaderService();
    }

    updateVirthualRows(scrolltop: number) {
        let virtual = {rowIndex: 0, virtualRows: this._state.data, topHideHeight: 0, bottomHideHeight: 0 };
        if (this._state.virtual && this._state.virtualized) {
            this.virtualizedService.state = this._state;
            virtual = { ...this._state.virtual, ...this.virtualizedService.getRows(scrolltop) };
        }

        this.updateState({virtual});
        this.virtualRowSubject.next(virtual);
    }

    getDeltaTopHeight(scrolTop, firstIndex) {
        const {rowsLength: viewRowsCount, top, bottom} = this.virtualizedService.getRowsCount(scrolTop, this._state.pageSize, firstIndex);
        const gridContainerRowsCount = this.virtualizedService.displayRowsCount();
        let deltaTopHeight = 0;
        if (viewRowsCount < gridContainerRowsCount) {
            deltaTopHeight = (gridContainerRowsCount - viewRowsCount) * this._state.rowHeight - this._state.headerHeight;
        }

        return deltaTopHeight;
    }

    getData() {
        return this._state.data || [];
    }

    getState() {
        return this._state;
    }

    getVirtualState() {
        return this._state.virtual;
    }


    getPageInfo() {
        const { pageIndex, pageSize } = {...this._state};
        return { pageIndex, pageSize };

    }

    initState(state: Partial<FarrisDatagridState>) {
        this.updateState(state, false);
        this.initColumns();

        this.updateVirthualRows(0);
        this.gridSizeSubject.next(this._state);
    }

    loadData(data: any) {
        this.updateState({ data }, false);
        this.updateVirthualRows(this._state.virtual.scrollTop);
    }

    loadDataForVirtual(data: any) {
        this.updateState({ data }, false);
        this.virtualizedService.state = this._state;
        const virtual = { ...this._state.virtual, ...this.virtualizedService.reload() };
        console.log(virtual);
        this.virtualRowSubject.next(virtual);
        this.updateState({virtual});
    }

    fetchData(url: string): Observable<DataResult> {
        return this.http.get(url).pipe(
            map( r => r as DataResult )
        );
    }

    setTotal(total: number) {
        this.updateState( {total}, false );
    }

    setPagination(pageIndex: number, pageSize: number, total: number) {
        this.updateState( { pageIndex, pageSize, total }, false);
    }

    setScrollTop(scrollTop: number) {
        const virtual = { ...this._state.virtual, scrollTop};
        this.updateState({virtual}, false);
    }

    initColumns() {
        const columns = this._state.columns;
        if (columns && columns.length) {

            const leftFixedCols = this.getFixedCols();
            const rightFixedCols = this.getFixedCols('right');
            const normalCols = columns.filter(col => !col.fixed);

            const colgroup = {
                leftFixed: leftFixedCols,
                rightFixed: rightFixedCols,
                normalColumns: normalCols
            };

            this.initColumnsWidth(colgroup);

            this.updateState({ columnsGroup: colgroup }, false);
        }
    }

    selectRow(rowIndex: number, rowData: any) {
        const id = this.primaryId(rowData);
        this.updateState({ currentRow: { id, data: rowData, index: rowIndex } });
    }

    setCurrentCell(rowIndex: number, rowData: any, field: string ) {
        if (!this.isCellSelected({rowIndex, field})) {
            const currentCell = {...this._state.currentCell, rowIndex, rowData, field, rowId: this.primaryId(rowData) };
            this.updateState({currentCell});
        }
    }

    cancelSelectCell() {
        if (this._state.currentCell) {
            this.updateState({currentCell: null});
        }
    }

    primaryId(data: any) {
        return data[this._state.idField];
    }

    editCell() {
        if (this._state.currentCell) {
            if (!this._state.currentCell.isEditing) {
                const cei = { ...this._state.currentCell, isEditing: true };
                this.updateState({ currentCell: cei });
            }
        }
    }

    endEditCell() {
        if (this._state.currentCell) {
            const cei = { ...this._state.currentCell, isEditing: false };
            this.updateState({ currentCell: cei });
        }
    }

    getCurrentCellInfo() {
        return this._state.currentCell;
    }

    isCellSelected(cellInfo: CellInfo) {
        const cc = this.getCurrentCellInfo();
        if (!cc) {
            return false;
        } else {
            return cc.rowIndex === cellInfo.rowIndex && cc.field === cellInfo.field;
        }
    }

    protected updateState(state: Partial<FarrisDatagridState>, emit = true) {
        const newState = { ...this._state, ...state };
        this._state = newState;
        if (emit) {
            this.store.next(this._state);
        }
    }


    private getFixedCols(direction: 'left' | 'right' = 'left') {
        return this._state.columns.filter(col => col.fixed === direction);
    }

    private initColumnsWidth(colgroup: ColumnGroup) {
        let offset = 0;
        offset = this._state.showLineNumber ? offset + this._state.lineNumberWidth : offset;

        offset = (this._state.multiSelect && this._state.showCheckbox) ?
            offset + 36 : offset;

        const leftColsWidth = colgroup.leftFixed.reduce((r, c) => {
            c.left = r;
            return r + c.width;
        }, offset);

        colgroup.leftFixedWidth = leftColsWidth;

        if (this._state.columns && this._state.columns.length) {
            const minWidth = colgroup.normalColumns.reduce((totalWidth, col) => {
                col.left = totalWidth;
                return totalWidth += col.width;
            }, leftColsWidth);

            colgroup.minWidth = minWidth;
        }
    }
}
