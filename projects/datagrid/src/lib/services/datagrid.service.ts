import { EventEmitter } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-11 17:47:38
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { CellInfo } from './state';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { RowEventParam, RowHoverEventParam } from '../types/event-params';
import { filter, map, debounceTime } from 'rxjs/operators';

export type ScrollAction =
    | 'psScrollY'
    | 'psScrollX'
    | 'psScrollUp'
    | 'psScrollDown'
    | 'psScrollLeft'
    | 'psScrollRight'
    | 'psYReachEnd'
    | 'psYReachStart'
    | 'psXReachEnd'
    | 'psXReachStart';

@Injectable()
export class DatagridService {
    private scorllSubject = new Subject();
    private scrollX = new BehaviorSubject(0);

    private rowHoverSubject = new Subject<RowHoverEventParam>();
    private rowSelectSubject = new Subject<Partial<RowHoverEventParam>>();

    private dataSourceChangedSubject = new Subject();
    /** 编辑单元格 */
    private editCellSubject = new Subject();
    /** 选中单元格 */
    private selectCellSubject = new Subject();
    /** 结束单元编辑 */
    private endCellEdit = new Subject();
    private changeCheckedRows = new Subject();
    /** 结束行编辑 */
    // private endRowEdit = new BehaviorSubject(true);

    public scorll$ = this.scorllSubject.asObservable();
    public scrollX$ = this.scorll$.pipe(
        filter( (p: any) => p.type === 'psScrollX'),
        map( t => t.x),
        debounceTime(50)
    );
    public scrollY$ = this.scorll$.pipe(
        filter( (p: any) => p.type === 'psScrollY'),
        map( t => t.x),
        debounceTime(50)
    );
    public rowHover$ = this.rowHoverSubject.asObservable();
    public rowClick$ = this.rowSelectSubject.asObservable();
    public onDataSourceChange = this.dataSourceChangedSubject.asObservable();
    public cellEdit$ = this.editCellSubject.asObservable();
    public endCellEdit$ = this.endCellEdit.asObservable();
    public checkedRowsTotalChanged$ = this.changeCheckedRows.asObservable();

    public showGridHeader = new EventEmitter();
    // 取消全选
    public uncheckAll = new EventEmitter();
    // 全部选中
    public checkAll = new EventEmitter();

    public columnResized = new EventEmitter();

    public rowHeightChanged = new EventEmitter();

    // public endRowEdit$ = this.endRowEdit.asObservable();

    constructor() { }

    onScrollMove(x: number, action: ScrollAction) {
        this.scorllSubject.next({ x, type: action });
    }

    dataSourceChanged() {
        this.dataSourceChangedSubject.next();
    }

    onRowHover(rowIndex: number, rowData: any, mouseEnter: boolean) {
        this.rowHoverSubject.next({ index: rowIndex, data: rowData, mouseenter: mouseEnter });
    }

    onRowClick(rowIndex: number, rowData: any) {
        this.rowSelectSubject.next({ index: rowIndex, data: rowData });
    }

    onCellEdit(tdElement: any) {
        this.editCellSubject.next(tdElement);
    }

    onEndCellEdit(cell: CellInfo) {
        this.endCellEdit.next(cell);
    }

    onSelectCell(cell: CellInfo) {
        this.selectCellSubject.next(cell);
    }

    onCheckedRowsCountChange() {
        this.changeCheckedRows.next();
    }

    onRowHeightChange(rowHeight: number) {
        this.rowHeightChanged.emit(rowHeight);
    }
}
