import { HttpClient, HttpParams } from '@angular/common/http';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-27 11:12:05
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { EditorTypes} from '@farris/ui-datagrid-editors';
import { Utils } from '../utils';
import { DatagridComponent } from '@farris/ui-datagrid';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
    editMode = 'cell';
    pageSize = 200;
    pageIndex = 1;
    @ViewChild('box') box: ElementRef;
    @ViewChild('dg') dg: DatagridComponent;
    constructor(private dds: DemoDataService, private http: HttpClient) {}

    ngOnInit() {
        this.onresize();
        const enumData = Utils.enumData();
        const enumOpts = { valueField: 'value', textField: 'label', data: enumData };
        this.columns = [
            { field: 'id', width: 100, title: 'ID', fixed: 'left' },
            { field: 'name', width: 130, title: '姓名', editor: { type: EditorTypes.TEXTBOX, options: {}}},
            { field: 'sex', width: 70, title: '性别', editor: {type: 'input-group'} },
            { field: 'birthday', width: 120, title: '出生日期', editor: {
                    type: EditorTypes.DATEPICKER, options: {}
                },
                formatter: { type: 'datetime', options: { format: 'YYYY-MM-DD' }}
            },
            { field: 'maray', width: 70, title: '婚否', editor: { type: EditorTypes.CHECKBOX, options: {}},
                formatter: { type: 'boolean', options: { trueText: '已婚', falseText: '未婚' }}
            },
            { field: 'city', width: 100, title: '所在城市', editor: {
                type: EditorTypes.LOOKUP,
                options: {
                    uri: '/assets/data/bigdata-city.json',
                    loader: this.loadLookupTreeData,
                    idField: 'id',
                    singleSelect: true,
                    textField: 'name.dfName',
                    valueField: 'id',
                    title: '城市区域',
                    pagination: false,
                    displayType: 'TREELIST'
                }
            }},
            { field: 'addr', width: 170, title: '地址', editor: {
                    type: EditorTypes.TEXTAREA,
                    options: {},
                    validators: [
                        {type: 'required', messager: '该字段不能为空！'},
                        {type: 'minLength', value: 10 , messager: '字符不得小于10个！'},
                        {type: 'maxLength', value: 11 , messager: '字符不得大于11个！'},
                    ]
                }
            },
            { field: 'company', width: 160, title: '公司' ,
                editor: {
                    type: EditorTypes.LOOKUP,
                    options: {
                        uri: '/assets/data/products.json',
                        loader: this.loadLookupData,
                        idField: 'Code',
                        singleSelect: true,
                        textField: 'Name',
                        valueField: 'Code',
                        title: '人员选择',
                        pagination: true,
                        displayType: 'LIST'
                    },
                    validators: [
                        { type: 'required', messager: '必填' },
                        // { type: 'min', value: 0, messager: '最小值不能小于0'},
                        // { type: 'max', value: 10, messager: '最大值不能小于10'},
                        // { type: 'minLength', value: 10, messager: '最小值不能小于0'},
                        // { type: 'maxLength', value: 100, messager: '最小值不能小于0'}
                    ]
            }
        },
        { field: 'nianxin', width: 100, title: '年薪' , editor: { type: EditorTypes.NUMBERBOX, options: {}},
            formatter: { type: 'number', options: { prefix: '￥', suffix: '元', precision: 2 } }
        },
        { field: 'zhiwei', width: 140, title: '职位' , editor: { type: EditorTypes.SELECT, options: enumOpts},
            formatter: {type: 'enum', options: enumOpts}
        }];

        this.total = 50;
        this.items = this.dds.createData(50);

    }

    @HostListener('window:resize')
    onresize() {
        const header = document.querySelector('.navbar-dark') as any;
        const headerHeight = header.offsetHeight;
        this.box.nativeElement.style.height = (window.innerHeight - headerHeight) + 'px';
    }

    loadLookupTreeData = (url: string) => {
        return this.http.get(url).pipe(
            switchMap( (d: any) => {
                const start = new Date().getMilliseconds();
                const treeResult = this.makeTree(d);
                const end =  new Date().getMilliseconds();
                console.log(`start:${start}, end: ${end}; count: ${ end - start }`);
                const r = {
                    displayType: 'TREELIST',
                    columns: [
                        {  field: 'name.dfName', title: '名称', width: 200  },
                        {  field: 'code.dfCode', title: '编号', width: 100  },
                        // {  field: 'fullName', title: '全称', width: 200  },
                        {  field: 'countryOrRegion.countryOrRegion.countryOrRegion_Name.dfName', title: '国家', width: 200  }
                        // {  field: 'countryOrRegion.countryOrRegion.countryOrRegion', title: '国家ID', width: 200  }
                    ],
                    items: d,
                    treeInfo: {
                        layerType: 'pathcode',
                        loadDataType: 'all',
                        pathField: 'path',
                        layerField: 'layer',
                        dataField: 'treeInfo',
                        isDetailField: 'isDetail'
                    }
                };
                return of(r);
            })
        );
    }


    private makeTree(data) {
        const r = data.filter(t => t.treeInfo.layer === 1).map(t => {
            return {
                data: t,
                children: [],
                expanded: false
            };
        });

        r.forEach(e => {
            const childs = data.filter( c =>  c.treeInfo.path.substr(0, 4) === e.data.treeInfo.path );
            e.children = this.makeTreeChildren(childs, e.data.treeInfo);
        });

        return r;
    }

    private makeTreeChildren(childs, treeInfo) {
        const pLayer = treeInfo.layer + 1;
        const pPathLen = treeInfo.layer * 4;
        return childs.filter( c => c.treeInfo.layer === pLayer && c.treeInfo.path.substr(0, pPathLen) === treeInfo.path).map( d => {
            return {
                data: d,
                children: this.makeTreeChildren(childs, d.treeInfo),
                expanded: false
            };
        });
    }

    loadLookupData = (url: string, params?: any) => {
        let httpParams = new HttpParams();
        if (params) {
            if (params.pagination) {
                httpParams = httpParams.set('pageIndex', params.pagination.pageIndex.toString());
                httpParams = httpParams.set('pageSize', params.pagination.pageSize.toString());
            }

            if (params.condition) {
                httpParams = httpParams.set('condition', JSON.stringify(params.condition));
            }

            if (params.search) {
                httpParams = httpParams.set('search', JSON.stringify(params.search));
            }
        }

        return this.http.get(url, {
            params: httpParams
        }).pipe(
            debounceTime(2000),
            map((data: any) => {
                if (params) {
                    let perPage = 20, start = 0, end = perPage + start;
                    if (params.pagination) {
                        perPage = params.pagination.pageSize;
                        start = (params.pagination.pageIndex - 1) * perPage;
                        end = start + perPage;

                        data['pageInfo'] = params.pagination;
                    }

                    if (params.search && params.search.value) {
                        data.items = (data.items as any).filter(item => {
                            if (item[params.search.field] && item[params.search.field].indexOf(params.search.value) > -1) {
                                return item;
                            }
                        });
                    }
                    data.total = data.items.length;
                    data.items = data.items.slice(start, end);
                }
                return data;
            })
        );
    }

    beforeEdit = (index, rowdata, col) => {
        console.log('Before Edit', rowdata, col);
        return of(true);
    }

    beginEdit(res) {
        console.log('Begin Edit', res);
    }

    afterEdit = (index, rowdata, col) => {
        console.log('After Edit', rowdata);
        return of(true);
    }

    endEdit(res) {
        console.log('End Edit', res);
    }

    // edit cell
    editCell($event: MouseEvent, rowId, field) {
        this.dg.editCell(rowId, 'name');
        $event.stopPropagation();
    }

    editRow() {
        this.dg.editRow();
    }

    getChanges() {
        const changes =  this.dg.getChanges();
        console.log('变更集', changes);
    }

    acceptChanges() {
        this.dg.acceptChanges();
    }

    rejectChanges() {
        this.dg.rejectChanges();
    }

    cancelEdit($event: MouseEvent) {
        this.dg.cancelEdit(this.dg.selectedRow.id);
        $event.stopPropagation();
        return false;

    }

    cancelEdited($event: MouseEvent) {
        console.log('取消编辑');
    }
}
