/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-18 17:14:50
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, merge, Subject } from 'rxjs';
import { map, distinctUntilChanged, filter, switchMap, auditTime, debounceTime } from 'rxjs/operators';
import { DataColumn, ColumnGroup, CalculationType } from '../types';
import { FarrisDatagridState, initDataGridState, DataResult, CellInfo, VirtualizedState, SelectedRow,
        RowDataChanges, ROW_INDEX_FIELD, IS_GROUP_ROW_FIELD, GROUP_ROW_FIELD, IS_GROUP_FOOTER_ROW_FIELD } from './state';
import { VirtualizedLoaderService } from './virtualized-loader.service';
import { DatagridRow } from '../types/datagrid-row';
import { cloneDeep, groupBy, sumBy, maxBy, minBy, meanBy } from 'lodash-es';
import { Utils } from '../utils/utils';

@Injectable()
export class DatagridFacadeService {
    protected _state: FarrisDatagridState;
    public virtualizedService: VirtualizedLoaderService;

    store = new BehaviorSubject<FarrisDatagridState>(this._state);

    virtualRowSubject = new BehaviorSubject<any>(null);
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
        switchMap((vs: VirtualizedState) => {
            return of({
                index: vs.startIndex || 0,
                rows: vs.virtualRows,
                top: vs.topHideHeight,
                bottom: vs.bottomHideHeight
            });
        })
    );

    constructor(private http: HttpClient) {
        this._state = initDataGridState;
        this.virtualizedService = new VirtualizedLoaderService();
    }

    updateVirthualRows(scrolltop: number) {
        // console.time('计算虚拟加载');
        const virtual = this.getVirthualRows(scrolltop);
        this.updateState({virtual}, false);
        this.virtualRowSubject.next(virtual);
        // console.timeEnd('计算虚拟加载');
    }

    getVirthualRows(scrolltop): VirtualizedState {
        if (scrolltop === undefined) {
            scrolltop = 0;
        }

        let data = [];
        let virtual = {rowIndex: 0, virtualRows: data, topHideHeight: 0, bottomHideHeight: 0 };

        if (this._state.autoHeight) {
            virtual.virtualRows = this._state.data;
            return virtual;
        }

        if (this._state.flatColumns && this._state.flatColumns.length) {
            data = this._state.data;

            if (!this._state.groupRows) {
                if (this._state.virtual && this._state.virtualized) {
                    this.virtualizedService.state = this._state;
                    const rows = this.virtualizedService.getRows(scrolltop);
                    virtual = { ...this._state.virtual, ...rows };
                } else {
                    virtual.virtualRows = data;
                }
            } else {
                // 行分组数据处理
                const groupRows = this.groupRows(data);
                virtual.virtualRows = groupRows;
            }
        }
        return virtual;
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

        this._state.originalData = cloneDeep(this._state.data);
        this.initColumns();

        this.gridSizeSubject.next(this._state);
        this.updateVirthualRows(0);
    }

    loadData(data: any) {
        this.updateState({ data }, false);
        this.updateVirthualRows(this._state.virtual.scrollTop || 0);
    }
    /** 复原指定行的数据 */
    resetRow(rowId: any) {
        const origData = this._state.originalData;
        if (origData) {
            const origRowData = origData.find(r => this.primaryId(r) === rowId);
            this.getCurrentRow().data = cloneDeep(origRowData);
            this.updateRow(origRowData);
        }
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
        // 如果数据源变了，需要重新计算
        const data = this._state.data;
        if (this._state.selections && this._state.selections.length) {
            if (!data || !data.length) {
                this._state.selections = [];
            } else {
                this._state.selections = this._state.selections.filter(n => {
                    return data.findIndex(d => this.primaryId(d) === n.id) > -1;
                });
            }
        }
        return this._state.selections || [];
    }

    getCheckeds() {
        // 如果数据源变了，需要重新计算
        const data = this._state.data;
        if (this._state.checkedRows && this._state.checkedRows.length) {
            if (!data || !data.length) {
                this._state.checkedRows = [];
            } else {
                this._state.checkedRows = this._state.checkedRows.filter(n => {
                    return data.findIndex(d => this.primaryId(d) === n.id) > -1;
                });
            }
        }
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
        if (!this._state.multiSelect) {
            this._clearCheckeds();
        }


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
                const r = this.primaryId(n) == id;
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

                if (this._state.showCheckbox && this._state.checkOnSelect) {
                    this._state.checkedRows = [ srow ];
                    this.checkRowSubject.next(srow);
                }

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

    setCurrentCell(dr: DatagridRow, field: string, cellElement?: any ) {
        const { rowIndex, rowData } = {...dr};
        if (!this.isCellSelected({rowIndex, field})) {
            const currentCell = {...this._state.currentCell, rowIndex, rowData, field, rowId: this.primaryId(rowData), cellElement };
            this.updateState({currentCell}, false);
            this.selectRow(rowIndex, rowData);
            this._state.currentRow.dr = dr;
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

    updateRow(row: any) {
        const id = this.primaryId(row);
        Object.assign(this.findRow(id), row);
    }

    isCellSelected(cellInfo: CellInfo) {
        const cc = this.getCurrentCell();
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

    resize(newSize?: {width: number, height: number, [key: string]: any}) {
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

    private resetColumnsSize() {
        if (this._state.fitColumns) {
            this.setFitColumnsWidth(this._state.columnsGroup);
        }
        this.gridSizeSubject.next(this._state);
    }

    updateColumns(columns) {
        this._state.columns = columns;
        this.initColumns();
        this.resizeColumns(true);
    }


    initColumns() {
        const columns = this._state.flatColumns;
        if (columns && columns.length) {
            const leftFixedCols = this.getFixedCols('left');
            const rightFixedCols = this.getFixedCols('right');
            const normalCols = this.getFixedCols();

            columns.forEach(c => {
                if (!c.originalWidth) {
                    c.originalWidth = c.width;
                }
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
        this.loadData(sortedData);
    }


    //#region 变更集

    private hasRowChanges(rowid: any) {
        const _changes = this._state.changes;
        if (!_changes) {
            return false;
        }
        return _changes[rowid];
    }

    appendChanges(changes: RowDataChanges) {
        if (!changes) {
            return;
        }
        const id = changes[this._state.idField];
        if (!id) {
            return;
        }
        const _id = '' + id;
        if (!this.hasRowChanges(_id)) {
            this._state.changes = this._state.changes || {};
            this._state.changes[_id] = changes;
        } else {
            this._state.changes[_id] = Object.assign(this._state.changes[_id], changes);
        }
    }

    acceptChanges() {
        const changes = this._state.changes;
        if (changes) {
            const keys = Object.keys(changes);
            keys.forEach(id => {
                this.updateRow(changes[id]);
            });
            this._state.originalData = cloneDeep(this._state.data);
        }
    }
    rejectChanges(rowid = null) {
        const changes = this._state.changes;
        if (changes) {
            if (!rowid) {
                this._state.data = cloneDeep(this._state.originalData);
                this._state.changes = null;
            } else {
                const rowChanges =  this._state.changes['' + rowid];
                if (rowChanges) {
                    const orgiRow = this._state.originalData.find(r => this.primaryId(r) === rowid);
                    this._state.data.forEach(r => {
                        if (this.primaryId(r) === rowid) {
                            r = cloneDeep(orgiRow);
                        }
                    });
                }
            }

            this.refresh();
        }
    }

    getChanges() {
        return this._state.changes;
    }

    refresh() {
        this.loadData(this._state.data);
    }

    //#endregion

    /**
     * 构造合计行
     * @param data 数据集合
     */
    getFooterData(data) {
        if (this._state.showFooter) {
            const columns = this._state.flatColumns;
            const footerRow = {};

            columns.forEach(col => {
                if (col.footer && col.footer.options) {
                    const options = col.footer.options;
                    const text = options.text;
                    const typ = options.calculationType as CalculationType;

                    if (typ !== undefined) {
                        const val = this.calculation(data, typ, col.field);
                        footerRow[col.field] = val;
                    } else {
                        footerRow[col.field] = text || '';
                    }
                } else {
                    footerRow[col.field] = '';
                }
            });

            return [footerRow];
        }
        return [];
    }


    /**
     * 将普通数组转换为带有分组信息的数据
     * @param data 原始数据
     */
    private groupRows(data: any[]) {
        if (data && data.length) {
            const groupField = this._state.groupField;

            const groupData = groupBy(data, groupField);
            const keys = Object.keys(groupData);
            let result = [];
            let rowIndex = 0;
            const columns = this._state.flatColumns;
            keys.forEach((k, i) => {
                const groupItem = {
                    [IS_GROUP_ROW_FIELD]: true, value: k, colspan: columns.length,
                    expanded: true, total: groupData[k].length
                };

                if (i > 0) {
                    if (!this._state.groupFooter) {
                        rowIndex = result[result.length - 1][ROW_INDEX_FIELD] + 1;
                    } else {
                        rowIndex = result[result.length - 2][ROW_INDEX_FIELD] + 1;
                    }
                }
                result.push(groupItem);

                result = result.concat(groupData[k].map((n, j) => {
                    n[ROW_INDEX_FIELD] = rowIndex + j;
                    n[GROUP_ROW_FIELD] = groupItem;
                    return n;
                }));

                if (this._state.groupFooter) {
                    const groupFooterRow = {
                        [IS_GROUP_FOOTER_ROW_FIELD]: true,
                        [GROUP_ROW_FIELD]: groupItem
                    };

                    columns.forEach(col => {
                        if (col.groupFooter && col.groupFooter.options) {
                            const options = col.groupFooter.options;
                            const text = options.text;
                            const typ = options.calculationType as CalculationType;

                            if (typ !== undefined) {
                                const val = this.calculation(groupData[k], typ, col.field);
                                groupFooterRow[col.field] = val;
                            } else {
                                groupFooterRow[col.field] = text || '';
                            }
                        } else {
                            groupFooterRow[col.field] = '';
                        }
                    });

                    result.push(groupFooterRow);
                }
            });

            return result;
        }

        return [];
    }

    private calculation(data: any, typ: CalculationType, field: string) {
        let val: any = '';
        switch (typ) {
            case CalculationType.sum:
                val = sumBy(data, (o) => Utils.getValue(field, o));
                break;
            case CalculationType.max:
                const maxObj = maxBy(data, (o) => Utils.getValue(field, o));
                val = Utils.getValue(field, maxObj);
                break;
            case CalculationType.min:
                const minObj = minBy(data, (o) => Utils.getValue(field, o));
                val = Utils.getValue(field, minObj);
                break;
            case CalculationType.average:
                val = meanBy(data, (o) => Utils.getValue(field, o));
                break;
            case CalculationType.count:
                val = data.length;
                break;
        }
        return val;
    }

}
