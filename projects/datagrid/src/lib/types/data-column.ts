import { TemplateRef } from '@angular/core';
export interface DataColumn {
    field: string;
    title: string;
    width: number;
    /** 标题对齐方式 */
    hAlign?: 'left' | 'center' | 'right';
    /** 文本对齐方式 */
    align?: 'left' | 'center' | 'right';
    /** 是否允许拖动列宽 */
    resizable?: string;
    formatter?: (data) => void;
    styler?: (data) => void;
    left?: number;
    /** 是否固定 */
    fixed?: 'left' | 'right';
    /** 是否显示 */
    hidden?: boolean;

    editor?: TemplateRef<any>;
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
    /** 最小宽度 */
    minWidth?: number;
}
