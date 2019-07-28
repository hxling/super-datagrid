import { Component, OnInit } from '@angular/core';
import { DemoDataService } from '../demo-data.service';

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

    constructor(private dds: DemoDataService) {}

    ngOnInit() {

        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名'},
            { field: 'sex', width: 70, title: '性别' },
            { field: 'nianxin', width: 70, title: '年薪', styler: this.cellStyler },
            { field: 'birthday', width: 120, title: '出生日期'},
            { field: 'maray', width: 70, title: '婚否'},
            { field: 'addr', width: 170, title: '地址' },
            { field: 'company', width: 100, title: '公司' },
            { field: 'zhiwei', width: 100, title: '职位' }
        ];

        this.total = 1000;
        this.items = this.dds.createData(1000);
    }

    rowStyle = (rowData) => {
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

    cellStyler = (val, data, index) => {
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
}
