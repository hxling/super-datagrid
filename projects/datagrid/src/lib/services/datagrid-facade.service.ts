import { FarrisDatagridState, initDataGridState, EditInfo } from './state';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataColumn, ColumnGroup } from '../types';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class DatagridFacadeService {
    protected _state: FarrisDatagridState;
    readonly store  = new BehaviorSubject<FarrisDatagridState>(this._state);
    readonly state$ = this.store.asObservable();

    readonly columnGroup$ = this.state$.pipe(
        map((state: FarrisDatagridState) => state.columnsGroup),
        distinctUntilChanged()
    );

    readonly data$ = this.state$.pipe(
        map( (state: FarrisDatagridState) => state.data || []),
        distinctUntilChanged()
    );

    readonly currentEdit$ = this.state$.pipe(
        map ((state: FarrisDatagridState) => state.currentEditInfo),
        distinctUntilChanged()
    );

    constructor() {
        this._state = initDataGridState
    }

    initState(state: any) {
        this.updateState(state);
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

    editCell(editInfo: EditInfo) {
        if (this._state.currentEditInfo) {
            if(this._state.currentEditInfo.rowIndex !== editInfo.rowIndex || this._state.currentEditInfo.field !== editInfo.field) {
                this.updateState({currentEditInfo: editInfo});
            }
        } else {
            this.updateState({currentEditInfo: editInfo});
        }
    }

    endEditCell() {
        if (this._state.currentEditInfo) {
            if (this._state.currentEditInfo.isEditing) {
                const cei = {...this._state.currentEditInfo, isEditing: false};
                this.updateState({currentEditInfo: cei});
            } else {
                this._state.currentEditInfo = null;
            }
        }
    }
    
    protected updateState(state: any) {
        const newState = {...this._state, ...state};

        this.store.next(this._state = newState);
    }


    private getFixedCols(direction: 'left' | 'right' = 'left') {
        return this._state.columns.filter(col => col.fixed === direction);
    }

    private initColumnsWidth(colgroup: ColumnGroup) {
        let offset = 0;
        offset = this._state.showRowNumber ? offset +  this._state.rowNumberWidth : offset;

        offset = ( this._state.multiSelect &&  this._state.showCheckbox) ?
            offset + 36  : offset;

        const leftColsWidth = colgroup.leftFixed.reduce((r, c) => {
            c.left = r;
            return r + c.width;
        }, offset);

        colgroup.leftFixedWidth = leftColsWidth;

        if ( this._state.columns &&  this._state.columns.length) {
            const minWidth = colgroup.normalColumns.reduce((totalWidth, col) => {
                col.left = totalWidth;
                return totalWidth += col.width;
            }, leftColsWidth);

            colgroup.minWidth = minWidth;
        }
    }

}
