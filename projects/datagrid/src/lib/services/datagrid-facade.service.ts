import { VirtualizedLoaderService } from './virtualized-loader.service';
import { FarrisDatagridState, initDataGridState, EditInfo, DataResult } from './state';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataColumn, ColumnGroup } from '../types';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DatagridFacadeService {
    protected _state: FarrisDatagridState;
    public virtualizedService: VirtualizedLoaderService;
    readonly store = new BehaviorSubject<FarrisDatagridState>(this._state);
    readonly state$ = this.store.asObservable().pipe(
        filter( (state: any) => state)
    );

    readonly columnGroup$ = this.state$.pipe(
        map((state: FarrisDatagridState) => state.columnsGroup),
        distinctUntilChanged()
    );

    readonly data$ = this.state$.pipe(
        map((state: FarrisDatagridState) => {
            if (state.virtual && state.virtualized) {
                return {
                    rows: state.virtual.virtualRows,
                    top: state.virtual.topHideHeight || 0,
                    bottom: state.virtual.bottomHideHeight || 0
                };
            } else {
                return { rows: state.data || [] , top: 0, bottom: 0};
            }
        }),
        distinctUntilChanged()
    );

    readonly currentEdit$ = this.state$.pipe(
        map((state: FarrisDatagridState) => state.currentEditInfo),
        distinctUntilChanged()
    );

    readonly currentRow$ = this.state$.pipe(
        map((state: FarrisDatagridState) => state.currentRow),
        distinctUntilChanged()
    );

    readonly currentCell$ = this.state$.pipe(
        map(state => state.currentCell),
        distinctUntilChanged()
    );

    constructor(private http: HttpClient) {
        this._state = initDataGridState;
        this.virtualizedService = new VirtualizedLoaderService();
    }

    updateVirthualRows(scrolltop: number) {
        this.virtualizedService.state = this._state;
        const virtual = { ...this._state.virtual, ...this.virtualizedService.getRows(scrolltop) };
        this.updateState({virtual});
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

    setCurrentCell(rowIndex: number, rowId: any, field: string ) {
        const currentCell = {rowIndex, rowId, field };
        this.updateState({currentCell});
    }

    cancalSelectCell() {
        this.updateState({currentCell: null});
    }

    primaryId(data: any) {
        return data[this._state.idField];
    }

    editCell(editInfo: EditInfo) {
        if (this._state.currentEditInfo) {
            if (this._state.currentEditInfo.rowIndex !== editInfo.rowIndex || this._state.currentEditInfo.field !== editInfo.field) {
                this.updateState({ currentEditInfo: editInfo });
            }
        } else {
            this.updateState({ currentEditInfo: editInfo });
        }
    }

    endEditCell() {
        if (this._state.currentEditInfo) {
            if (this._state.currentEditInfo.isEditing) {
                const cei = { ...this._state.currentEditInfo, isEditing: false };
                this.updateState({ currentEditInfo: cei });
            } else {
                this._state.currentEditInfo = null;
            }
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
        offset = this._state.showRowNumber ? offset + this._state.rowNumberWidth : offset;

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
