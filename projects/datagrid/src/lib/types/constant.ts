

export interface RowEventParam  {
    index: number;
    data: any;
    mouseenter: boolean;
}


export const SCROLL_Y_ACTION = 'psScrollY';
export const SCROLL_X_ACTION = 'psScrollX';
export const SCROLL_UP_ACTION = 'psScrollUp';
export const SCROLL_DOWN_ACTION = 'psScrollDown';
export const SCROLL_LEFT_ACTION = 'psScrollLeft';
export const SCROLL_RIGHT_ACTION = 'psScrollRight';
export const SCROLL_Y_REACH_END_ACTION = 'psYReachEnd';
export const SCROLL_Y_REACH_START_ACTION = 'psYReachStart';
export const SCROLL_X_REACH_END_ACTION = 'psXReachEnd';
export const SCROLL_X_REACH_START_ACTION = 'psXReachStart';

/** 左侧固定列阴影样式名称 */
export const FIXED_LEFT_SHADOW_CLS = 'xui-table-fixed-left-shadow';

export const ROW_HOVER_CLS = 'xui-table-row-hover';

export const ROW_SELECTED_CLS = 'xui-table-row-selected';
