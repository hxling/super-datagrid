import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, merge, Subject } from 'rxjs';
import { map, distinctUntilChanged, filter, switchMap, auditTime } from 'rxjs/operators';
import { DataColumn, ColumnGroup } from '../types';
import { FarrisDatagridState, initDataGridState, DataResult, CellInfo, VirtualizedState, SelectedRow } from './state';
import { VirtualizedLoaderService } from './virtualized-loader.service';
import { SRCSET_ATTRS } from '@angular/core/src/sanitization/html_sanitizer';

@Injectable()
export class DatagridFacadeService {
    protected _state: FarrisDatagridState;
    public virtualizedService: VirtualizedLoaderService;

    store = new BehaviorSubject<FarrisDatagridState>(this._state);

    virtualRowSubject = new Subject<any>();
    gridSizeSubject = new Subject<any>();
    private selectRowSubject = new Subject<any>();
    private unSelectRowSubject = new Subject<any>();
    private columnResizeSubject = new Subject<any>();
    private clearSelectionSubject = new Subject();
    private checkRowSubject = new Subject<any>();
    private unCheckRowSubject = new Subject<any>();
    private clearCheckedsSubject = new Subject<any>();
    private clearAllSubject = new Subject<any>();
    private checkAllSubject = new Subject();
    private unCheckAllSubject =  new Subject();
    private selectAllSubject = new Subject();

    selectRow$ = this.selectRowSubject.asObservable();
    unSelectRow$ =  this.unSelectRowSubject.asObservable();
    columnResize$ = this.columnResizeSubject.asObservable();
    clearSelections$ = this.clearSelectionSubject.asObservable();
    checkRow$ = this.checkRowSubject.asObservable();
    unCheckRow$ = this.unCheckRowSubject.asObservable();
    clearCheckeds$ = this.clearCheckedsSubject.asObservable();
    clearAll$ = this.clearAllSubject.asObservable();
    checkAll$ = this.checkAllSubject.asObservable();
    unCheckAll$ = this.unCheckAllSubject.asObservable();
    selectAll$ = this.selectAllSubject.asObservable();


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
        switchMap( (row) => {
            if (row) {
                return of(row);
            } else {
                this.unSelectRowSubject.next(row);
                return this.unSelectRowSubject.asObservable();
            }
        }),
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

    updateProperty(property: string, value: any) {
        this.updateState({ [property]: value }, false);
    }

    setPagination(pageIndex: number, pageSize: number, total: number) {
        this.updateState( { pageIndex, pageSize, total }, false);
    }

    setScrollTop(scrollTop: number) {
        const virtual = { ...this._state.virtual, scrollTop};
        this.updateState({virtual}, false);
    }

    isMultiSelect() {
        return this._state.multiSelect;
    }

    isRowSelected(id: any) {
        if (!this.isMultiSelect()) {
            if (!id || !this._state.currentRow) {
                return false;
            } else {
                return this._state.currentRow.id.toString() === id.toString();
            }
        } else {
            const selections = this._state.selections;
            if (!selections || selections.length === 0) {
                return false;
            } else {
                return selections.findIndex(sr => sr.id === id) > -1;
            }
        }
    }

    isRowChecked(id: any) {
        const checkeds = this.getCheckeds();
        if (!id || !checkeds.length) {
            return false;
        }

        return checkeds.findIndex(sr => sr.id.toString() === id.toString()) > -1;
    }

    getSelections() {
        return this._state.selections || [];
    }

    getCheckeds() {
        return this._state.checkedRows || [];
    }

    checkRow(rowIndex: number, rowData: any) {
        const id = this.primaryId(rowData);
        const checkeds = this._state.checkedRows || [];
        if (!this.isRowChecked(id)) {
            const srow = { id, data: rowData, index: rowIndex };
            checkeds.push(srow);
            this._state.checkedRows = checkeds;
            this.checkRowSubject.next(srow);

            if (this._state.selectOnCheck) {
                this.selectRow(rowIndex, rowData);
            }
        }
    }

    unCheckRow(rowIndex: number, rowData: any) {
        const id = this.primaryId(rowData);
        let checkeds = this._state.checkedRows || [];
        if (this.isRowChecked(id)) {
            const srow = { id, data: rowData, index: rowIndex };
            checkeds = checkeds.filter(sr => sr.id !== id);
            this._state.checkedRows = checkeds;
            this.unCheckRowSubject.next(srow);

            if (this._state.selectOnCheck) {
                this.unSelectRow(rowIndex, rowData);
            }
        }
    }

    checkAll() {
        this._state.checkedRows = [];
        this._state.checkedRows = this._state.data.map( (r, i) => {
            return {
                id: this.primaryId(r),
                index: i,
                data: r
            };
        });

        if (this._state.selectOnCheck) {
            this._state.selections = [];
            this._state.selections = this._state.data.map( (r, i) => {
                return {
                    id: this.primaryId(r),
                    index: i,
                    data: r
                };
            });
        }

        this.checkAllSubject.next(this._state.checkedRows);
    }

    selectAll() {
        this._state.selections = [];
        this._state.selections = this._state.data.map( (r, i) => {
            return {
                id: this.primaryId(r),
                index: i,
                data: r
            };
        });

        if (this._state.checkOnSelect) {
            this._state.checkedRows = [];
            this._state.checkedRows = this._state.data.map( (r, i) => {
                return {
                    id: this.primaryId(r),
                    index: i,
                    data: r
                };
            });
        }

        this.selectAllSubject.next(this._state.selections);
    }

    selectRow(rowIndex: number, rowData: any) {
        const isMultiSelect = this.isMultiSelect();
        const id = this.primaryId(rowData);
        const selections = this._state.selections || [];

        if (!this.isRowSelected(id)) {
            const srow = { id, data: rowData, index: rowIndex };
            if (!isMultiSelect) {
                this.updateState({ currentRow: srow }, false);
                this.selectRowSubject.next(this._state.currentRow);
            } else {
                if (this._state.onlySelectSelf) {
                    this._clearSelections();
                    this.updateState({ currentRow: srow }, false);
                } else {
                    selections.push(srow);
                }
                this.selectRowSubject.next(srow);

                if (this._state.checkOnSelect) {
                    this.checkRow(rowIndex, rowData);
                }

            }
        }
    }

    unSelectRow(rowIndex: number, rowData: any) {
        const id = this.primaryId(rowData);
        const isMultiSelect = this.isMultiSelect();
        const selections = this._state.selections || [];
        const srow = {id, index: rowIndex, data: rowData};
        if (!isMultiSelect) {
            if (this._state.currentRow) {
                this.updateState({ currentRow: null });
                this.unSelectRowSubject.next(srow);
            }
        } else {
            this._state.selections = selections.filter(sr => sr.id !== id);
            this.unSelectRowSubject.next(srow);

            if (this._state.checkOnSelect) {
                this.unCheckRow(rowIndex, rowData);
            }
        }
    }

    private _clearSelections() {
        this._state.currentRow = null;
        this._state.selections = [];
    }

    clearSelections() {
        this._clearSelections();
        if (this._state.checkOnSelect) {
            this._state.checkedRows = [];
        }
        this.clearSelectionSubject.next();
    }

    clearCheckeds() {
        this._state.checkedRows = [];
        if (this._state.selectOnCheck) {
            this._state.currentRow = null;
            this._state.selections = [];
        }
        this.clearCheckedsSubject.next();
    }

    clearAll() {
        this._state.currentRow = null;
        this._state.selections = [];
        this._state.checkedRows = [];
        this.clearAllSubject.next();
    }

    setMultiSelect(flag: boolean) {
        this._state.multiSelect = flag;
    }

    setCheckOnSelect(flag: boolean) {
        this._state.checkOnSelect = flag;
    }

    setSelectOnCheck(flag: boolean) {
        this._state.selectOnCheck = flag;
    }

    setCurrentCell(rowIndex: number, rowData: any, field: string, cellRef?: any ) {
        if (!this.isCellSelected({rowIndex, field})) {
            const currentCell = {...this._state.currentCell, rowIndex, rowData, field, rowId: this.primaryId(rowData), cellRef };
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

    getCurrentCell() {
        return this._state.currentCell;
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
        if (this._state.currentCell && this._state.currentCell.isEditing) {
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

    resize(newSize?: {width: number, height: number}) {
        if (newSize) {
            this.updateState(newSize, false);
        }

        this.resetColumnsSize();

        this.updateVirthualRows(this._state.virtual.scrollTop);
    }

    fitColumns(fit) {
        this.updateState({fitColumns: fit}, false);
        this.setFitColumnsWidth(this._state.columnsGroup);
        this.gridSizeSubject.next(this._state);
    }

    resetColumnsSize() {
        if (this._state.fitColumns) {
            this.setFitColumnsWidth(this._state.columnsGroup);
        }
        this.gridSizeSubject.next(this._state);
    }

    initColumns() {
        const columns = this._state.columns;
        if (columns && columns.length) {

            const leftFixedCols = this.getFixedCols();
            const rightFixedCols = this.getFixedCols('right');
            const normalCols = columns.filter(col => !col.fixed);

            columns.forEach(c => {
                c.originalWidth = c.width;
            });

            const colgroup = {
                leftFixed: leftFixedCols,
                rightFixed: rightFixedCols,
                normalColumns: normalCols
            };

            this.initColumnsWidth(colgroup);

            if (this._state.fitColumns) {
                this.setFitColumnsWidth(colgroup);
            }

            this.updateState({ columnsGroup: colgroup }, false);
        }
    }

    getColumnIndex(field: string, fixed: 'right'| '' | 'left' = '') {
        const colgroup = this._state.columnsGroup;
        if (!fixed) {
            return colgroup.normalColumns.findIndex(n => n.field === field);
        } else {
            if (fixed === 'left') {
                return colgroup.leftFixed.findIndex(n => n.field === field);
            } else if (fixed === 'right') {
                return colgroup.rightFixed.findIndex(n => n.field === field);
            }
        }
    }

    showCheckbox(isShow = true) {
        const colgroup = this._state.columnsGroup;
        this.updateState({showCheckbox: isShow}, false);
        if (isShow) {
            colgroup.leftFixedWidth = colgroup.leftFixedWidth + this._state.checkboxColumnWidth;
        } else {
            colgroup.leftFixedWidth = colgroup.leftFixedWidth - this._state.checkboxColumnWidth;
        }

        this.columnResizeSubject.next(colgroup);
    }

    hideCheckbox() {
        this.showCheckbox(false);
    }

    showLineNumber(isShow = true) {
        const colgroup = this._state.columnsGroup;
        this.updateState({showLineNumber: isShow}, false);
        if (isShow) {
            colgroup.leftFixedWidth = colgroup.leftFixedWidth + this._state.lineNumberWidth;
        } else {
            colgroup.leftFixedWidth = colgroup.leftFixedWidth - this._state.lineNumberWidth;
        }

        this.columnResizeSubject.next(colgroup);
    }

    hideLineNumber() {
        this.showLineNumber(false);
    }

    private setFitColumnsWidth(colgroup: ColumnGroup) {
        if (!colgroup) {
            return;
        }
        colgroup.normalWidth = this._state.width - colgroup.leftFixedWidth;
        const minWidth = colgroup.normalColumns.reduce((totalWidth, col) => {
            return totalWidth += col.originalWidth;
        }, 0);

        colgroup.normalColumns.forEach( col => {
            col.width = Math.floor( col.originalWidth / minWidth * colgroup.normalWidth );
        });

        colgroup.totalWidth = colgroup.leftFixedWidth + colgroup.rightFixedWidth + colgroup.normalWidth;
    }

    private getFixedCols(direction: 'left' | 'right' = 'left') {
        return this._state.columns.filter(col => col.fixed === direction);
    }

    private initColumnsWidth(colgroup: ColumnGroup) {
        let offset = 0;
        offset = this._state.showLineNumber ? offset + this._state.lineNumberWidth : offset;

        offset = this._state.showCheckbox ? offset + this._state.checkboxColumnWidth : offset;

        const leftColsWidth = colgroup.leftFixed.reduce((r, c) => {
            c.left = r;
            return r + c.width;
        }, offset);

        colgroup.leftFixedWidth = leftColsWidth;
        colgroup.rightFixedWidth = 0;
        if (colgroup.rightFixed && colgroup.rightFixed.length) {
            colgroup.rightFixedWidth = colgroup.rightFixed.reduce((r, c) => {
                return r + c.width;
            }, 0);
        }

        if (this._state.columns && this._state.columns.length) {
            const i =  0;
            const minWidth = colgroup.normalColumns.reduce((totalWidth, col) => {
                col.left = totalWidth;
                return totalWidth += col.width;
            }, i);

            colgroup.normalWidth = minWidth;
        }

        colgroup.totalWidth = leftColsWidth + colgroup.rightFixedWidth + colgroup.normalWidth;
    }
}
