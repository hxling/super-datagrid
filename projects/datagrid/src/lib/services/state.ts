import { PaginationInfo } from './../types/data-column';
import { ColumnGroup, DataColumn } from './../types';

export interface FarrisDatagridState {
    [key: string]: any;
    idField: string;
    data?: any;
    pagerInfo?: PaginationInfo;
    columns: DataColumn[];
    showRowNumber?: boolean;
    showCheckbox?: boolean;
    multiSelect?: boolean;
    selections: SelectedRow[];
    currentRow: SelectedRow;
    columnsGroup: ColumnGroup;
    currentEditInfo?: EditInfo;
    virtualized?: boolean;
    virtual?: VirtualizedState;
}

export interface VirtualizedState {
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
    virtual: {
        topHideHeight: 0,
        bottomHideHeight: 0
    }
};

export interface EditInfo {
    isEditing: boolean;
    rowData: any;
    rowIndex: number;
    field: string;
    cellRef: any;
}
