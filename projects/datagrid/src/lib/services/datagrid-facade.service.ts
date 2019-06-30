import { VirtualizedLoaderService } from './virtualized-loader.service';
import { FarrisDatagridState, initDataGridState, EditInfo } from './state';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataColumn, ColumnGroup } from '../types';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

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

    constructor() {
        this._state = initDataGridState;
        this.virtualizedService = new VirtualizedLoaderService();
    }

    updateVirthualRows(scrolltop: number) {
        this.virtualizedService.state = this._state;
        const virtual = { ...this._state.virtual, ...this.virtualizedService.getRows(scrolltop) };
        this.updateState({virtual});
    }

    initState(state: Partial<FarrisDatagridState>) {
        this.updateState(state);
        if (state.virtualized && state.data && state.data.length) {
            this.updateVirthualRows(0);
        }

    }

    loadData(data: any) {
        this.updateState({ data });
        this.updateVirthualRows(0);
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

            this.updateState({ columnsGroup: colgroup });
        }
    }

    selectRow(rowIndex: number, rowData: any) {
        const id = this.primaryId(rowData);
        this.updateState({ currentRow: { id, data: rowData, index: rowIndex } })
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

    protected updateState(state: Partial<FarrisDatagridState>) {
        const newState = { ...this._state, ...state };

        this.store.next(this._state = newState);
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
