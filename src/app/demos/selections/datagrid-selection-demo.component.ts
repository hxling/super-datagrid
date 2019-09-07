/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-09-06 16:04:06
 * @Company: Inspur
 * @Version: v0.0.1
 */
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DemoDataService } from '../demo-data.service';
import { DATAGRID_REST_SERVICEE, DatagridComponent } from '@farris/ui-datagrid';
import { of } from 'rxjs';

@Component({
    selector: 'grid-selection',
    templateUrl: './datagrid-selection-demo.component.html',
    providers: [
        DemoDataService,
        {provide: DATAGRID_REST_SERVICEE, useClass: DemoDataService}
    ]
})
export class DatagridSelectionDemoComponent implements OnInit {
    items;
    total = 0;
    pageSize = 100;
    pageindex = 1;

    @ViewChild('box') box: ElementRef;

    useRowHover = true;
    showBorder = false;
    keepSelect = true;
    showRowNumber = true;
    useStripe = true;
    wrap = false;
    fitColumns = true;
    disabledSelect = false;

    remoteSort = true;
    multiSort = false;
    // 多选

    _useMultiSelect = false;
    get useMultiSelect() {
        return this._useMultiSelect;
    }
    set useMultiSelect(v) {
        this._useMultiSelect = v;
        this.showAllCheckbox = v;
        this.showCheckbox = v;
        this.checkonselect = v;
        this.selectoncheck = v;
        this.onlySelectSelf = v;
    }

    onlySelectSelf = false;
    showAllCheckbox = false;
    checkonselect = false;
    selectoncheck = false;
    showCheckbox = false;


    columns = [
        { field: 'id', width: 100, title: 'ID' },
        { field: 'name', width: 130, title: '姓名' , sortable: true},
        { field: 'sex', width: 70, title: '性别'},
        { field: 'birthday', width: 120, title: '出生日期'},
        { field: 'maray', width: 70, title: '婚否', sortable: true},
        { field: 'addr', width: 170, title: '地址'},
        { field: 'company', width: 100, title: '公司'},
        { field: 'nianxin', width: 70, title: '年薪', sortable: true, order: 'asc'},
        { field: 'zhiwei', width: 100, title: '职位'}
    ];

    btnText = '锁定分页';

    @ViewChild('dg') dg: DatagridComponent;

    constructor(private dds: DemoDataService) {}

    ngOnInit(): void {
        this.onresize();
    }

    @HostListener('window:resize')
    onresize() {
        const header = document.querySelector('.navbar-dark') as any;
        const headerHeight = header.offsetHeight;
        this.box.nativeElement.style.height = (window.innerHeight - headerHeight) + 'px';
    }

    getSelectRows() {
        console.log('所有选中的行',  this.dg.selections);
    }

    getCurrentRow() {
        console.log('当前行', this.dg.selectedRow);
    }

    getCheckRows() {
        console.log('钩选行', this.dg.checkeds);
    }

    cancelCurrentRow() {
        if (this.dg.selectedRow) {
            this.dg.unSelectRow(this.dg.selectedRow.id);
        } else {
            console.warn('没有可取消选中的行！！！');
        }
    }
    cancelSelectAll() {
        if (this.dg.selections && this.dg.selections.length) {
            this.dg.clearSelections();
        } else {
            console.warn('没有选中的行，取消个屁呀！');
        }
    }

    cancelAllCheckeds() {
        if (this.dg.checkeds && this.dg.checkeds.length) {
            this.dg.clearCheckeds();
        } else {
            console.warn('没有选中的行，取消个屁呀！');
        }
    }

    selectRow(id) {
        this.dg.selectRow(id);
    }

    checkedRow(id) {
        this.dg.checkRow(id);
    }

    unCheckedRow(id) {
        this.dg.unCheckRow(id);
    }

    selectedAll() {
        this.dg.selectAllRows();
    }

    checkedAll() {
        this.dg.checkAllRows();
    }

    //

    changePageindex(i) {
        this.dg.setPageIndex(i);
    }

    lockPagination() {
        this.dg.lockPagination = !this.dg.lockPagination;
        this.btnText = this.dg.lockPagination ? '启用分页' : '锁定分页';
    }

    // Events
    selectChanged($event) {
        console.log('当前选中的', $event);
        console.log('Datagrid selectedRow:', this.dg.selectedRow);
    }

    unSelect($event) {
        console.log('取消选中的行：', $event);
    }

    checked($event) {
        console.log('钩选的行：', $event);
    }

    unChecked($event) {
        console.log('取消钩选的行：', $event);
    }

    checkAll($event) {
        console.log('全部钩选', $event);
    }

    unCheckAll($event) {
        console.log('全部取消钩选', $event);
    }

    selectAll($event) {
        console.log('全选', $event);
    }

    unSelectAll($event) {
        console.log('取消全选', $event);
    }

    // Before Event
    onBeforeSelect(rowIndex, rowData) {
        if (rowIndex === 5) {
            return of(false);
        }
        console.log('Before Select', rowIndex, rowData);
        return of(true);
    }

    onBeforeUnselect(rowIndex, rowData) {
        console.log('Before Unselect', rowIndex, rowData);
        return of(true);
    }

    onBeforeCheck(rowIndex, rowData) {
        console.log('Before Check', rowIndex, rowData);
        return of(true);
    }

    onBeforeUncheck(rowIndex, rowData) {
        console.log('Before Uncheck', rowIndex, rowData);
        return of(true);
    }
}
