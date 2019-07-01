import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    dataSource = [];
    enabelVirthualRows = true;
    title = 'farris-datagrid';

    @ViewChild('name') textbox: TemplateRef<any>;
    @ViewChild('sex') sexEditor: TemplateRef<any>;
    @ViewChild('birthday') birthdayEditor: TemplateRef<any>;
    @ViewChild('maray') marayEditor: TemplateRef<any>;

    columns = [];

    ngOnInit() {

        this.columns = [
            { field: 'id', width: 100, title: 'ID' },
            { field: 'name', width: 130, title: '姓名', editor: this.textbox },
            { field: 'sex', width: 70, title: '性别' , editor: this.sexEditor},
            { field: 'birthday', width: 120, title: '出生日期', editor: this.birthdayEditor },
            { field: 'maray', width: 70, title: '婚否', editor: this.marayEditor },
            { field: 'addr', width: 170, title: '地址', editor: this.textbox  },
            { field: 'company', width: 100, title: '公司', editor: this.textbox  },
            { field: 'nianxin', width: 70, title: '年薪', editor: this.textbox  },
            { field: 'zhiwei', width: 100, title: '职位', editor: this.textbox  }
        ];

        this.dataSource = this.initData(50);
    }

    changeDataItems(n =  20) {
        this.dataSource = this.initData(n);
    }

    private initData(len: number) {
        const arr = [];
        for (let i = 0; i < len; i++) {
            const k = i + 1;
            arr.push({
                id: k,
                name: '姓名' + k,
                sex: '男',
                birthday: (2000 + i) + '-01-01',
                maray: true,
                addr: `天齐大道${7000 + i}号`,
                company: `inspur`,
                nianxin: Math.round(Math.random() * 10000) * 12,
                zhiwei: 'CEO&CPU'
            });
        }
        return arr;
    }


    onBeginEdit(e: any) {
        console.log('进入编辑', e);
    }

    onEndEdit(e: any) {
        console.log('停止编辑', e);
    }
}
