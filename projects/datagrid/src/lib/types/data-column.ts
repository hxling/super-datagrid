import { TemplateRef } from '@angular/core';


export interface CustomStyle {
    cls?: string;
    style?: {
        [key: string]: string;
    };
}

export type MoveDirection = 'left' | 'right' | 'up' | 'down';

export interface DataColumn {
    field: string;
    title: string;
    width: number;
    /** 记录原始定义宽度 */
    originalWidth?: number;
    /** 标题对齐方式 */
    hAlign?: 'left' | 'center' | 'right';
    /** 文本对齐方式 */
    align?: 'left' | 'center' | 'right';
    /** 是否允许拖动列宽 */
    resizable?: string;
    formatter?: (value, rowData, rowIndex) => CustomStyle;
    styler?: (value, rowData, rowIndex) => CustomStyle;
    left?: number;
    /** 是否固定 */
    fixed?: 'left' | 'right';
    /** 是否显示 */
    hidden?: boolean;

    editor?: GridEditor;
    /** 单元格自定义模板 */
    template?: TemplateRef<any>;
    /** 鼠标移动至单元格后，显示悬浮消息 */
    showtips?: false;

}

export interface GridEditor {
    type: string;
    bindField?: string;
    options?: any;
}

export interface ColumnGroup {
    /** 左侧固定列总宽度 */
    leftFixedWidth?: number;
    /** 左侧固定列集合 */
    leftFixed?: DataColumn[];
    /** 非固定列集合 */
    normalColumns?: DataColumn[];
    /** 右侧固定列宽度 */
    rightFixedWidth?: number;
    /** 右侧固定列集合 */
    rightFixed?: DataColumn[];
    /** 正常宽度 */
    normalWidth?: number;
    /** 所有列宽度之各 */
    totalWidth?: number;
}

export interface PaginationInfo {
    enable?: boolean;
    pageList?: number[];
    pageSize?: number;
    pageIndex?: number;
    total?: number;
}


export const defaultPaginationInfo: PaginationInfo = {
    enable: true,
    pageIndex: 1,
    pageSize: 10
};
