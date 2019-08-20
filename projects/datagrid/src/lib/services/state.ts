/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 07:47:12
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-20 14:25:55
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { ColumnGroup, DataColumn } from './../types';

export interface Action {
    type: string;
    payload?: any;
}

export interface FarrisDatagridState {
    [key: string]: any;
    width?: number;
    height?: number;
    rowHeight?: number;
    idField?: string;
    data?: any;
    headerHeight?: number;
    pageIndex?: number;
    pageSize?: number;
    pagerHeight?: number;
    pagination?: boolean;
    columns: Array<DataColumn> | Array<DataColumn>[];
    flatColumns?: Array<DataColumn>;
    fitColumns: boolean;
    showLineNumber?: boolean;
    showCheckbox?: boolean;
    checkboxColumnWidth: number;
    multiSelect?: boolean;
    /** 当启用多选时，点击行选中，只允许且只有一行被选中。 */
    onlySelectSelf: boolean;
    selectOnCheck: boolean;
    checkOnSelect: boolean;
    selections?: SelectedRow[];
    checkedRows?: SelectedRow[];
    currentRow?: SelectedRow;
    currentCell?: CellInfo;
    columnsGroup: ColumnGroup;
    virtualized?: boolean;
    /** 是否启用异步虚拟加载数据: false - 客户端内存中取数；true - 远端服务器加载数据, 默认值为 false */
    virtualizedAsyncLoad?: boolean;
    virtual?: VirtualizedState;
    sortName?: string;
    sortOrder?: string;
    multiSort?: boolean;
    remoteSort?: boolean;
}

export interface VirtualizedState {
    /** 虚拟加载且不显示分页条时，记录加载新记录时的索引值 */
    rowIndex: number;
    /** 数据显示的索引值 */
    startIndex?: number;
    scrollTop?: number;
    virtualRows?: any;
    topHideHeight?: number;
    bottomHideHeight?: number;
}

export interface SelectedRow {
    index: number;
    id: any;
    data: any;
    dr?: any;
    editors?: any[];
}

export const initDataGridState: FarrisDatagridState = {
    idField: 'id',
    showLineNumber: false,
    selections: [],
    checkedRows: [],
    currentRow: null,
    columnsGroup: null,
    columns: [],
    fitColumns: false,
    onlySelectSelf: true,
    selectOnCheck: true,
    checkOnSelect: true,
    pageIndex: 1,
    pageSize: 20,
    pagerHeight: 40,
    checkboxColumnWidth: 36,
    pagination: false,
    virtual: {
        rowIndex: 0,
        scrollTop: 0,
        topHideHeight: 0,
        bottomHideHeight: 0
    },
    sortName: undefined,
    sortOrder: undefined,
    multiSort: false,
    remoteSort: true
};

export interface CellInfo {
    isEditing?: boolean;
    rowData?: any;
    rowId?: any;
    rowIndex?: number;
    field?: string;
    cellRef?: any;
}

export interface DataResult {
    footer?: any[];
    items: any[];
    total?: number;
    pageIndex?: number;
    pageSize?: number;
}

