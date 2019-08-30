/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-07-29 08:14:22
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-16 18:26:53
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { DatagridComponent } from '@farris/ui-datagrid';

@Component({
    selector: 'datagrid-show-row-number',
    templateUrl: './show-row-number.component.html',
    providers: [
        DemoDataService
    ]
})
export class ShowLineNumberComponent implements OnInit {
    showLoading = false;
    columns = [];
    items = [];
    total = 0;
    pageSize = 200;
    pageIndex = 1;


    @ViewChild('dg') dg: DatagridComponent;

   
    @ViewChild('nameCellTemplate') nameCellTemplate: TemplateRef<any>;
    constructor(private dds: DemoDataService) {}

    ngOnInit() {
        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名', align: 'left', template: this.nameCellTemplate},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'nianxin', width: 70, title: '年薪', styler:  this.datagrid1NianxinCellStyle},
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司' },
            { field: 'zhiwei', width: 100, title: '职位' }
        ];
        this.total = 1000;
        this.items = this.dds.createData(1000);

        console.log(this.dg);
    }

    datagrid1RowStyle = (rowData) => {
        if (rowData.id === 5) {
            return {
                style: {
                    color: 'blue',
                    background: '#f8ad4f'
                }
            };
        } else {
            return {
                cls: 'custom-row-style'
            };
        }
    }

    datagrid1NianxinCellStyle = (val, data, index) => {
        if (val) {
            if ( val > 50000) {
                return {
                    style:  {
                        background: 'green',
                        color: 'white'
                    }
                };
            } else {
                return {
                    style: {
                        color: 'blue',
                        fontWeight: 'bold'
                    }
                };
            }
        }

        return undefined;
    }

    getselectedRow() {
        return this.dg.selectedRow;
    }

}
