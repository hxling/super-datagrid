import { PaginationInfo } from './../types/data-column';
import { ColumnGroup, DataColumn } from './../types';

export interface FarrisDatagridState {
    [key: string]: any;
    idField: string;
    data?: any;
    pageIndex?: number;
    pageSize?: number;
    pagerHeight?: number;
    pagination?: boolean;
    columns: DataColumn[];
    showRowNumber?: boolean;
    showCheckbox?: boolean;
    multiSelect?: boolean;
    selections: SelectedRow[];
    currentRow: SelectedRow;
    currentCell?: any;
    columnsGroup: ColumnGroup;
    currentEditInfo?: EditInfo;
    virtualized?: boolean;
    /** 是否启用异步虚拟加载数据: false - 客户端内存中取数；true - 远端服务器加载数据, 默认值为 false */
    virtualizedAsyncLoad?: boolean;
    virtual?: VirtualizedState;
}

export interface VirtualizedState {
    /** 虚拟加载且不显示分页条时，记录加载新记录时的索引值 */
    rowIndex: number;
    scrollTop?: number;
    virtualRows?: any;
    topHideHeight?: number;
    bottomHideHeight?: number;
}

export interface SelectedRow {
    index: number;
    id: any;
    data: any;
}

export const initDataGridState: FarrisDatagridState = {
    idField: 'id',
    showRowNumber: false,
    selections: [],
    currentRow: null,
    columnsGroup: null,
    columns: [],
    pageIndex: 1,
    pageSize: 20,
    pagerHeight: 40,
    pagination: false,
    virtual: {
        rowIndex: 0,
        scrollTop: 0,
        topHideHeight: 0,
        bottomHideHeight: 0
    }
};

export interface EditInfo {
    isEditing: boolean;
    rowData?: any;
    rowIndex: number;
    field: string;
    cellRef?: any;
}

export interface DataResult {
    items: any[];
    total?: number;
    pageIndex?: number;
    pageSize?: number;
}

