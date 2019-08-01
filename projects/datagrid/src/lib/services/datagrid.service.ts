import { CellInfo } from './state';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { RowEventParam, RowHoverEventParam } from '../types/event-params';

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

    public scorll$ = this.scorllSubject.asObservable();
    public scrollX$ = this.scrollX.asObservable();
    public rowHover$ = this.rowHoverSubject.asObservable();
    public rowClick$ = this.rowSelectSubject.asObservable();
    public onDataSourceChange = this.dataSourceChangedSubject.asObservable();
    public cellEdit$ = this.editCellSubject.asObservable();
    public endCellEdit$ = this.endCellEdit.asObservable();

    constructor() { }

    onScrollMove(x: number, action: ScrollAction) {
        this.scorllSubject.next({ x, type: action });
    }

    onScrollX(x: number) {
        this.scrollX.next(x);
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
}
