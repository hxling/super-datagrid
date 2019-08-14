/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-14 17:37:21
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { EditorTypes} from '@farris/ui-datagrid-editors';

@Component({
    selector: 'cell-editor',
    templateUrl: './cell-editor.component.html',
    providers: [
        DemoDataService
    ]
})
export class CellEditorComponent implements OnInit {
    showLoading = false;
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;

    constructor(private dds: DemoDataService) {}

    ngOnInit() {

        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名', editor: { type: EditorTypes.TEXTBOX, options: {}}},
            { field: 'sex', width: 70, title: '性别', editor: {type: 'input-group'} },
            { field: 'birthday', width: 120, title: '出生日期', editor: { type: EditorTypes.DATEPICKER, options: {}}},
            { field: 'maray', width: 70, title: '婚否', editor: { type: EditorTypes.CHECKBOX, options: {}}},
            { field: 'addr', width: 170, title: '地址', editor: { type: EditorTypes.TEXTAREA, options: {}} },
            { field: 'company', width: 100, title: '公司' , editor: { type: EditorTypes.TEXTBOX,  options: {}}},
            { field: 'nianxin', width: 70, title: '年薪' , editor: { type: EditorTypes.TEXTBOX, options: {}}},
            { field: 'zhiwei', width: 100, title: '职位' , editor: { type: EditorTypes.TEXTBOX, options: {}}}
        ];

        this.total = 100;
        this.items = this.dds.createData(100);
    }
}
