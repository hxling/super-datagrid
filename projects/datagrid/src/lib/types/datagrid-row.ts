/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-21 09:25:26
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-21 09:26:40
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
export interface DatagridRow {
    [name: string]: any;
    rowIndex: number;
    rowData: any;
    cells?: any;
}
