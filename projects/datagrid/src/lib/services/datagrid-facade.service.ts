/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-20 11:49:09
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, merge, Subject } from 'rxjs';
import { map, distinctUntilChanged, filter, switchMap, auditTime } from 'rxjs/operators';
import { DataColumn, ColumnGroup } from '../types';
import { FarrisDatagridState, initDataGridState, DataResult, CellInfo, VirtualizedState, SelectedRow } from './state';
import { VirtualizedLoaderService } from './virtualized-loader.service';
// import { orderBy } from 'lodash-es';

@Injectable()
export class DatagridFacadeService {
    protected _state: FarrisDatagridState;
    public virtualizedService: VirtualizedLoaderService;

    store = new BehaviorSubject<FarrisDatagridState>(this._state);

    virtualRowSubject = new Subject<any>();
    gridSizeSubject = new Subject<any>();
    errorSubject = new Subject();
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
    private selectCellSubject = new Subject();

    error$ = this.errorSubject.asObservable();
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
    currentCell$ = this.selectCellSubject.asObservable();


    readonly state$ = this.store.asObservable().pipe(
        filter( (state: any) => state)
    );

    readonly columnGroup$ = this.gridSizeSubject.asObservable().pipe(
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

        this.gridSizeSubject.next(this._state);
        this.updateVirthualRows(0);
    }

    loadData(data: any) {
        this.updateState({ data }, false);
        this.updateVirthualRows(this._state.virtual.scrollTop || 0);
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

    private _isRowSelected(id: any) {
        if (!id || !this._state.currentRow) {
            return false;
        } else {
            return this._state.currentRow.id.toString() === id.toString();
        }
    }

    isRowSelected(id: any) {
        if (!this.isMultiSelect()) {
           return this._isRowSelected(id);
        } else {
            const selections = this._state.selections;

            if (this._canCancelSelectWhenMulti()) {
                return this._isRowSelected(id);
            }

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

    isCheckAll() {
        return  this._state.checkedRows.length === this._state.data.length;
    }

    getCurrentRow() {
        return this._state.currentRow || undefined;
    }

    getSelections() {
        return this._state.selections || [];
    }

    getCheckeds() {
        return this._state.checkedRows || [];
    }

    checkRecord(id: any, checked = true) {
        if (id) {
            const row = this.findRow(id);
            if (row) {
                const {index: rowIndex, data: rowData} = {...row};
                if (checked) {
                    this.checkRow(rowIndex, rowData);
                } else {
                    this.unCheckRow(rowIndex, rowData);
                }
            } else {
                this.errorSubject.next(`未找到ID为${id}的数据。`);
            }
        } else {
            this.errorSubject.next(`参数id 不能为空。`);
        }
    }

    checkRow(rowIndex: number, rowData: any) {
        const id = this.primaryId(rowData);
        const checkeds = this._state.checkedRows || [];
        if (id && !this.isRowChecked(id)) {
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

        if (this._state.selectOnCheck && !this._state.onlySelectSelf) {
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

    findRow(id): {index: number, data: any} {
        if (this._state.data && this._state.data.length) {
            let index = -1;
            const data = this._state.data.find( (n, i) => {
                const r = this.primaryId(n) === id;
                if (r) {
                    index = i;
                }
                return r;
            });

            return {index, data};
        }
        return null;
    }

    findRowIndex(id) {
        if (this._state.data && this._state.data.length) {
            return this._state.data.findIndex(n => this.primaryId(n) === id);
        }
        return -1;
    }

    selectRecord(id: any, select = true) {
        if (id) {
            const row = this.findRow(id);
            if (row) {
                const {index: rowIndex, data: rowData} = {...row};
                if (select) {
                    this.selectRow(rowIndex, rowData);
                } else {
                    this.unSelectRow(rowIndex, rowData);
                }
            } else {
                this.errorSubject.next(`未找到ID为${id}的数据。`);
            }
        } else {
            this.errorSubject.next(`参数id 不能为空。`);
        }
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
                    this.updateState({ currentRow: srow, selections: [srow] }, false);
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

            if (this._canCancelSelectWhenMulti()) {
                this.updateState({ currentRow: null });
            }

            if (this._state.checkOnSelect) {
                this.unCheckRow(rowIndex, rowData);
            }
        }
    }

    private _canCancelSelectWhenMulti() {
        return !this._state.keepSelect && this._state.onlySelectSelf;
    }

    private _clearSelections() {
        this._state.currentRow = null;
        this._state.selections = [];
    }

    private _clearCheckeds() {
        this._state.checkedRows = [];
    }

    clearSelections() {
        const rows = this._state.selections;
        this._clearSelections();
        if (this._state.checkOnSelect) {
            this._clearCheckeds();
        }
        this.clearSelectionSubject.next(rows);
    }

    clearCheckeds() {
        const rows = this.getCheckeds();
        this._clearCheckeds();
        if (this._state.selectOnCheck) {
           this._clearSelections();
        }
        this.clearCheckedsSubject.next(rows);
    }

    clearAll() {
        this._clearCheckeds();
        this._clearSelections();
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
            this.updateState({currentCell}, false);
            this.selectRow(rowIndex, rowData);
            this.selectCellSubject.next(currentCell);
        }
    }

    cancelSelectCell() {
        if (this._state.currentCell) {
            this.updateState({currentCell: null}, false);
            this.selectCellSubject.next(null);
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
                this.updateState({ currentCell: cei }, false);
                this.selectCellSubject.next(cei);
            }
        }
    }

    endEditCell() {
        if (this._state.currentCell && this._state.currentCell.isEditing) {
            const cei = { ...this._state.currentCell, isEditing: false };
            this.updateState({ currentCell: cei }, false);
            this.selectCellSubject.next(cei);
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
        const columns = this._state.flatColumns;
        if (columns && columns.length) {
            const leftFixedCols = this.getFixedCols('left');
            const rightFixedCols = this.getFixedCols('right');
            const normalCols = this.getFixedCols();

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

    resizeColumns(restitute = false) {
        const colgroup = this._state.columnsGroup;
        this.initColumnsWidth(colgroup, restitute);
        if (this._state.fitColumns) {
            this.setFitColumnsWidth(colgroup, restitute);
        }
        this.updateState({ columnsGroup:  {...colgroup} }, false);
        this.gridSizeSubject.next(this._state);
    }

    getColumn(fieldName: string) {
        return this._state.flatColumns.find(n => n.field === fieldName);
    }

    private setFitColumnsWidth(colgroup: ColumnGroup, restitute = false) {
        if (!colgroup) {
            return;
        }
        colgroup.normalWidth = this._state.width - colgroup.leftFixedWidth;
        const minWidth = colgroup.normalColumns.reduce((totalWidth, col) => {
            if (!restitute) {
                return totalWidth += col.width;
            } else {
                return totalWidth += col.originalWidth;
            }
        }, 0);

        colgroup.normalColumns.forEach( col => {
            if (!restitute) {
                col.width = Math.floor( col.width / minWidth * colgroup.normalWidth );
            } else {
                col.width = Math.floor( col.originalWidth / minWidth * colgroup.normalWidth );
            }
        });

        colgroup.totalWidth = colgroup.leftFixedWidth + colgroup.rightFixedWidth + colgroup.normalWidth;
    }

    private getFixedCols(direction: 'left' | 'right' | '' = '') {
        let cols = [];
        if (!direction) {
            cols = this._state.flatColumns.filter(col => !col.fixed);
        } else {
            cols = this._state.flatColumns.filter(col => col.fixed === direction);
        }


        return cols.sort((a, b) => {
            if (a.index > b.index) {
                return 1;
            } else if (a.index < b.index) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    private initColumnsWidth(colgroup: ColumnGroup,  restitute = false) {
        let offset = 0;
        offset = this._state.showLineNumber ? offset + this._state.lineNumberWidth : offset;

        offset = this._state.showCheckbox ? offset + this._state.checkboxColumnWidth : offset;

        const leftColsWidth = colgroup.leftFixed.reduce((r, c) => {
            c.left = r;
            if (!restitute) {
                return r + c.width;
            } else {
                return r + c.originalWidth;
            }
        }, offset);

        colgroup.leftFixedWidth = leftColsWidth;
        colgroup.rightFixedWidth = 0;
        if (colgroup.rightFixed && colgroup.rightFixed.length) {
            colgroup.rightFixedWidth = colgroup.rightFixed.reduce((r, c) => {
                if (!restitute) {
                    return r + c.width;
                } else {
                    return r + c.originalWidth;
                }
            }, 0);
        }

        if (this._state.columns && this._state.columns.length) {
            const i =  0;
            const minWidth = colgroup.normalColumns.reduce((totalWidth, col) => {
                col.left = totalWidth;
                if (!restitute) {
                    return totalWidth += col.width;
                } else {
                    return totalWidth + col.originalWidth;
                }
            }, i);

            colgroup.normalWidth = minWidth;
        }

        colgroup.totalWidth = leftColsWidth + colgroup.rightFixedWidth + colgroup.normalWidth;
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


    private compare(a, b) {
        return a === b ? 0 : (a > b ? 1 : -1);
    }

    setSortInfo(sortName, sortOrder) {
        const fields = sortName.split(',');
        const orders = sortOrder.split(',');
        if (!this._state.multiSort) {
            const colgroup = this._state.columnsGroup;

            const updateFieldOrder = (cols: DataColumn[]) => {
                if (!cols || !cols.length) {
                    return;
                }
                cols.forEach( col => {
                    col.order = undefined;
                    const i = fields.findIndex(f => f === col.field);
                    if (i >= 0) {
                        col.order = orders[i];
                    }
                });
            };

            updateFieldOrder(colgroup.normalColumns);
            updateFieldOrder(colgroup.leftFixed);
            updateFieldOrder(colgroup.rightFixed);
        }

        this.updateState({sortName, sortOrder}, false);
    }

    private _sort(r1, r2) {
        let r = 0;
        const sortFields = this._state.sortName.split(',');
        const orders = this._state.sortOrder.split(',');

        for (let i = 0; i < sortFields.length; i++) {
            const sn = sortFields[i];
            const so = orders[i];

            const col = this.getColumn(sn);

            const orderby = col.sorter  ||  this.compare;
            r = orderby(r1[sn], r2[sn]) * (so === 'asc' ? 1 : -1);
            if (r !== 0) {
                return r;
            }
        }
        return r;
    }

    clientSort() {
        const sortedData = this._state.data.sort(this._sort.bind(this));
        // const sortedData = orderBy(this._state.data, this._state.sortName.split(','), this._state.sortOrder.split(','));
        this.loadData(sortedData);
    }


}
