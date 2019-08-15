/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-15 09:57:16
 * @Company: Inspur
 * @Version: v0.0.1
 */
import { TemplateRef } from '@angular/core';
import { ColumnFormatter } from '@farris/ui-common/column';

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
    halign?: 'left' | 'center' | 'right';
    /** 文本对齐方式 */
    align?: 'left' | 'center' | 'right';
    formatter?: (value, rowData, rowIndex) => any | ColumnFormatter;
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
    showtips?: boolean;
    /** True to allow the column can be sorted. */
    sortable?: boolean;
    order?: 'asc' | 'desc';
    sorter?: (r1: any, r2: any) => 0 | 1 | -1;
    /** True to allow the column can be resized. */
    resizable?: boolean;
    rowspan?: number;
    colspan?: number;
    index?: number;
}

export interface GridEditor {
    type: string;
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
