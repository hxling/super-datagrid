import { ColumnGroup, DataColumn } from './../types';

export interface FarrisDatagridState {
    [key: string]: any,
    idField: string;
    columns: DataColumn[],
    showRowNumber?: boolean;
    showCheckbox?: boolean;
    multiSelect?: boolean;
    selections: SelectedRow[];
    currentRow: SelectedRow;
    columnsGroup: ColumnGroup;
    currentEditInfo?: EditInfo
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
    columns: []
};

export interface EditInfo {
    isEditing: boolean;
    rowData: any;
    rowIndex: number;
    field: string;
    cellRef: any;
}
