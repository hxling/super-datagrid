/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-15 20:15:24
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { EditorTypes} from '@farris/ui-datagrid-editors';
import { Utils } from '../utils';

@Component({
    selector: 'cell-editor',
    templateUrl: './cell-editor.component.html',
    providers: [
        DemoDataService
    ]
})
export class CellEditorComponent implements OnInit {
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;

    constructor(private dds: DemoDataService) {}

    ngOnInit() {
        const enumData = Utils.enumData();
        const enumOpts = { valueField: 'value', textField: 'label', data: enumData };
        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名', editor: { type: EditorTypes.TEXTBOX, options: {}}},
            { field: 'sex', width: 70, title: '性别', editor: {type: 'input-group'} },
            { field: 'birthday', width: 120, title: '出生日期', editor: { type: EditorTypes.DATEPICKER, options: {}},
            formatter: { type: 'datetime', options: { format: 'YYYY-MM-DD' }}
        },
            { field: 'maray', width: 70, title: '婚否', editor: { type: EditorTypes.CHECKBOX, options: {}},
            formatter: { type: 'boolean', options: { trueText: '已婚', falseText: '未婚' }}
        },
            { field: 'addr', width: 170, title: '地址', editor: { type: EditorTypes.TEXTAREA, options: {}} },
            { field: 'company', width: 160, title: '公司' , editor: { type: EditorTypes.LOOKUP,  options: {
                idField: 'id'
            }}},
            { field: 'nianxin', width: 100, title: '年薪' , editor: { type: EditorTypes.TEXTBOX, options: {}},
            formatter: { type: 'number', options: { prefix: '￥', suffix: '元', precision: 2 } }
        },
            { field: 'zhiwei', width: 140, title: '职位' , editor: { type: EditorTypes.SELECT, options: enumOpts},
            formatter: {type: 'enum', options: enumOpts}
        }
        ];

        this.total = 100;
        this.items = this.dds.createData(100);
    }
}
