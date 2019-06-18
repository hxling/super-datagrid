import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RowEventParam } from '../types/constant';

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
    private rowHoverSubject = new Subject<RowEventParam>();
    private rowSelectSubject = new Subject<Partial<RowEventParam>>();
  
    public scorll$ = this.scorllSubject.asObservable();
    public rowHover$ = this.rowHoverSubject.asObservable();
    public rowClick$ = this.rowSelectSubject.asObservable();
  
    constructor() { }
  
    onScrollMove(x: number, action: ScrollAction) {
      this.scorllSubject.next({x, type: action});
    }
  
    onRowHover(rowIndex: number, rowData: any, mouseEnter: boolean) {
      this.rowHoverSubject.next({ index: rowIndex, data: rowData, mouseenter: mouseEnter });
    }
  
    onRowClick(rowIndex: number, rowData: any) {
      this.rowSelectSubject.next({index: rowIndex, data: rowData});
    }
}
