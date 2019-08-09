/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-09 14:02:10
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { Component, OnInit, Input, ViewEncapsulation,
    ContentChildren, QueryList, Output, EventEmitter, Renderer2, OnDestroy, OnChanges,
    SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Injector, HostBinding,
    AfterContentInit, NgZone, ElementRef, ViewChild, AfterViewInit
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import ResizeObserver from 'resize-observer-polyfill';
import { of, Subscription, Observable } from 'rxjs';
import { DataColumn, CustomStyle, MoveDirection, ColumnGroup } from './types/data-column';
import { DatagridFacadeService } from './services/datagrid-facade.service';
import { DatagridColumnDirective } from './components/columns/datagrid-column.directive';
import { DataResult, CellInfo, SelectedRow } from './services/state';
import { RestService, DATAGRID_REST_SERVICEE } from './services/rest.service';
import { DatagridService } from './services/datagrid.service';
import { GRID_EDITORS, CELL_SELECTED_CLS } from './types/constant';
import { DomHandler } from './services/domhandler';

// styleUrls: [
//     './scss/index.scss'
// ],


@Component({
    selector: 'farris-datagrid',
    template: `
    <div class="f-datagrid" [class.f-datagrid-bordered]="showBorder" [class.f-datagrid-wrap]="!nowrap"
        [class.f-datagrid-strip]="striped" [ngStyle]="{'width': width + 'px', 'height': height + 'px' }">
        <datagrid-header #header [columnsGroup]="colGroup" [height]="headerHeight"></datagrid-header>
        <datagrid-body [columnsGroup]="colGroup" [data]="ds.rows | paginate: pagerOpts"
                [startRowIndex]="ds.index" [topHideHeight]="ds.top" [bottomHideHeight]="ds.bottom"></datagrid-body>
        <datagrid-pager *ngIf="pagination" #dgPager [showPageList]="showPageList"
            [id]="pagerOpts.id" (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"></datagrid-pager>
    </div>
    <datagrid-loading *ngIf="loading"></datagrid-loading>
    `,
    providers: [
        DatagridFacadeService,
        DatagridService
    ],
    exportAs: 'datagrid',
    styles: [
        `
        .f-datagrid-wrap .f-datagrid-cell-content {
            white-space: normal;
            word-break: break-all;
            word-spacing: normal;
            height: auto;
            line-height: 24px;
        }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit, AfterViewInit {
    @Input() auther = `Lucas Huang - QQ:1055818239`;
    @Input() version = '0.0.1';

    @HostBinding('style.position') pos = 'relative';
    @HostBinding('class') hostCls = '';

    @Input() id = '';
    /** 显示边框 */
    @Input() showBorder = false;
    /** 启用斑马线  */
    @Input() striped = true;
    /** 宽度 */
    @Input() width = 800;
    /** 高度 */
    @Input() height = 400;
    /** 表头高度 */
    @Input() headerHeight = 36;
    /** 行高 */
    @Input() rowHeight = 36;
    /** 填充容器 */
    private _fit = false;
    @Input() get fit() {
        return this._fit;
    }
    set fit(val: boolean) {
        this._fit = val;
        if (this._fit) {
            this.hostCls = 'f-datagrid-full';
            this.el.nativeElement.parentElement.style.position = 'relative';
            this.calculateGridSize(val);
        } else {
            this.hostCls = '';
        }
    }
    /** 如果为真，则自动展开/收缩列的大小以适合网格宽度并防止水平滚动。 */
    private _fitColumns = false;
    @Input() get fitColumns() {
        return this._fitColumns;
    }
    set fitColumns(val: boolean) {
        this._fitColumns = val;
        this.setFitColumns(val);
    }

    @Input() disabled = false;
    @Input() lockPagination = false;

    /** 显示表头 */
    @Input() showHeader = true;
    /** 可拖动列设置列宽 */
    @Input() resizeColumn = true;
    /** 显示行号 */
    @Input() showLineNumber  = false;
    /** 行号宽度 */
    @Input() lineNumberWidth = 36;
    /** 鼠标滑过效果开关，默认开启 */
    @Input() rowHover = true;
    /** 允许编辑时，单击进入编辑状态 */
    @Input() clickToEdit = false;

    /** 分页信息 */
    @Input() pagination = true;
    /** 每页记录数 */
    @Input() pageList = [10, 20, 30, 50, 100];
    /** 当前页码 */
    @Input() pageIndex = 1;
    /** 每页记录数 */
    @Input() pageSize = 20;
    /** 分页区高度 */
    @Input() pagerHeight = 40;
    /** 显示每页记录数 */
    @Input() showPageList = false;
    /** 总记录数 */
    private _total = 0;
    get total() {
        return this._total;
    }

    @Input() set total(val: number) {
        this._total = val;
        this.pagerOpts.totalItems = val;
        this.dfs.setTotal(val);
    }

    /** 启用单击行 */
    @Input() enableClickRow = true;
    /** 启用多选 */
    @Input() multiSelect = false;
    /** 启用多选时，是否显示checkbox */
    @Input() showCheckbox = false;
    @Input() showAllCheckbox = true;
    /** 当启用多选时，点击行选中，只允许且只有一行被选中。 */
    @Input() onlySelectSelf = true;
    @Input() checkOnSelect = true;
    @Input() selectOnCheck = true;

    /**
     * 单击行选中后，在次点击不会被取消选中状态;
     */
    @Input() keepSelect = true;

    /** 空数据时，显示的提示文本 */
    @Input() emptyMessage = '暂无数据';

    /** 主键字段 */
    @Input() idField = 'id';
    /** 请求数据源的URL */
    @Input() url: string;
    /** 数据源 */
    @Input() data: any[];

    /** 数据为空时显示的信息 */
    @Input() emptyMsg = '';
    /** 列集合 */
    @Input() columns: DataColumn[];
    @Input() fields: DataColumn[];
    /** 数据折行，默认值：true,即在一行显示，不折行。 */
    @Input() nowrap = true;
    /** 虚拟加载 */
    @Input() virtualized = true;
    /** 是否启用异步加载数据 */
    @Input() virtualizedAsyncLoad = false;

    @Input() rowStyler: (rowData, rowIndex?: number) => {cls?: string, style?: any};
    /** 编辑方式： row(整行编辑)、cell(单元格编辑)；默认为 row */
    @Input() editMode: 'row'| 'cell' = 'row';
    /** 编辑状态 */
    @Input() editable = false;
    /** 编辑器高度 */
    @Input() editorHeight = 30;
    /** 启用远端排序 */
    @Input() remoteSort = true;
    /** 排序字段 */
    @Input() sortName: string;
    /** 排序方式 asc | desc */
    @Input() sortOrder: string;
    /** 允许多列排序 */
    @Input() multiSort: boolean;


    @Output() beginEdit = new EventEmitter();
    @Output() endEdit = new EventEmitter();

    @Output() scrollY = new EventEmitter();

    @Output() pageSizeChanged = new EventEmitter();
    @Output() pageChanged = new EventEmitter();

    @Output() loadSuccess = new EventEmitter();


    @Input() beforeSelect: (rowindex: number, rowdata: any) => Observable<boolean>;
    @Input() beforeUnselect: (rowindex: number, rowdata: any) => Observable<boolean>;
    @Input() beforeCheck: (rowindex: number, rowdata: any) => Observable<boolean>;
    @Input() beforeUncheck: (rowindex: number, rowdata: any) => Observable<boolean>;
    @Input() beforeSortColumn: (field: string, order: string) => Observable<boolean>;

    @Output() selectChanged = new EventEmitter();
    @Output() unSelect = new EventEmitter();
    @Output() selectAll = new EventEmitter();
    @Output() unSelectAll = new EventEmitter();

    @Output() checked = new EventEmitter();
    @Output() unChecked = new EventEmitter();
    @Output() checkAll = new EventEmitter();
    @Output() unCheckAll = new EventEmitter();

    @Output() columnSorted = new EventEmitter();


    @ContentChildren(DatagridColumnDirective) dgColumns?: QueryList<DatagridColumnDirective>;
    @ViewChild('dgPager') dgPager: any;
    @ViewChild('header') dgHeader: any;

    colGroup: ColumnGroup;
    data$ = this.dfs.data$;

    private _loading = false;
    get loading() {
        return this._loading;
    }
    set loading(val: boolean) {
        this._loading = val;
        this.cd.detectChanges();
    }

    get selections(): SelectedRow[] {
        return this.dfs.getSelections();
    }

    get checkeds() {
        return this.dfs.getCheckeds();
    }

    ds = {
        index: 0,
        rows: [],
        top : 0,
        bottom : 0
    };

    pagerOpts: any = { };
    restService: RestService;
    editors: {[key: string]: any} = {};

    selectedRow: SelectedRow;
    currentCell: CellInfo;

    clickDelay = 200;

    private ro: ResizeObserver | null = null;
    subscriptions: Subscription[] = [];

    docuemntCellClickEvents: any;
    documentCellClickHandler: any;
    documentCellKeydownEvents: any;
    documentCellKeydownHandler: any;

    constructor(private dfs: DatagridFacadeService,
                private dgs: DatagridService,
                public cd: ChangeDetectorRef,
                public el: ElementRef,
                private inject: Injector, private zone: NgZone,
                protected domSanitizer: DomSanitizer, private render2: Renderer2) {

        this.restService = this.inject.get<RestService>(DATAGRID_REST_SERVICEE, null);

        const dataSubscription = this.data$.subscribe( (dataSource: any) => {
            this.ds = {...dataSource};
            this.cd.detectChanges();
            this.loadSuccess.emit(this.ds.rows);
        });
        this.subscriptions.push(dataSubscription);

        const columnGroupSubscription = this.dfs.columnGroup$.subscribe(cg => {
            this.colGroup = cg;
        });
        this.subscriptions.push(columnGroupSubscription);

        const Editors = this.inject.get<any[]>(GRID_EDITORS, []);
        if (Editors.length) {
            Editors.forEach(ed => {
                this.editors[ed.name] = ed.value;
            });
        }

        const currentCellSubscription = this.dfs.currentCell$.subscribe( cell => {
            this.currentCell = cell;
            this.bindDocumentEditListener();
        });

        this.subscriptions.push(currentCellSubscription);
    }

    ngOnInit() {
        this.pagerOpts = {
            id:  this.id ? this.id + '-pager' :  'farris-datagrid-pager_' + new Date().getTime(),
            itemsPerPage: this.pagination ? this.pageSize : this.total,
            currentPage: this.pageIndex,
            totalItems: this.total,
            pageList: this.pageList
        };

        if (!this.columns) {
            this.columns = this.fields;
        }

        this.zone.runOutsideAngular(() => {
            this.ro = new ResizeObserver(() => {
                this.calculateGridSize(this.fit);
            });

            this.ro.observe(this.el.nativeElement.parentElement);
        });
    }

    ngAfterViewInit(): void {
        this.setHeaderHeight();
        this.setPagerHeight();

        this.initState();
        if (!this.data || !this.data.length) {
            this.fetchData(1, this.pageSize).subscribe( res => {
                if (!res) {
                    return;
                }
                this.total = res.total;
                this.loadData(res.items);
            });
        }

        this.initBeforeEvents();
    }

    ngAfterContentInit() {
        if (this.dgColumns && this.dgColumns.length) {
            this.columns = this.dgColumns.map(dgc => {
                return {...dgc};
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.dfs.loadData(changes.data.currentValue);
            this.dgs.dataSourceChanged();
        }

        if (changes.showCheckbox !== undefined && !changes.showCheckbox.isFirstChange()) {
            this.dfs.showCheckbox(changes.showCheckbox.currentValue);
        }

        if (changes.showLineNumber !== undefined && !changes.showLineNumber.isFirstChange()) {
            this.dfs.showLineNumber(changes.showLineNumber.currentValue);
        }

        if (changes.multiSelect !== undefined && !changes.multiSelect.isFirstChange()) {
            this.dfs.setMultiSelect(changes.multiSelect.currentValue);
        }

        if (changes.checkOnSelect !== undefined && !changes.checkOnSelect.isFirstChange()) {
            this.dfs.setCheckOnSelect(changes.checkOnSelect.currentValue);
        }

        if (changes.selectOnCheck !== undefined && !changes.selectOnCheck.isFirstChange()) {
            this.dfs.setSelectOnCheck(changes.selectOnCheck.currentValue);
        }

        if (changes.onlySelectSelf !== undefined && !changes.onlySelectSelf.isFirstChange()) {
            this.dfs.updateProperty('onlySelectSelf', changes.onlySelectSelf.currentValue);
        }

        if (changes.keepSelect !== undefined && !changes.keepSelect.isFirstChange()) {
            this.dfs.updateProperty('keepSelect', changes.keepSelect.currentValue);
        }

        if (changes.nowrap !== undefined && !changes.nowrap.isFirstChange()) {
            this.dfs.updateProperty('nowrap', changes.nowrap.currentValue);
        }

        if (changes.multiSort !== undefined && !changes.multiSort.isFirstChange()) {
            this.dfs.updateProperty('multiSort', changes.multiSort.currentValue);
        }

        if (changes.pageIndex !== undefined && !changes.pageIndex.isFirstChange()) {
            this.dfs.updateProperty('pageIndex', changes.pageIndex.currentValue);
            this.pagerOpts = Object.assign(this.pagerOpts, {
                currentPage: this.pageIndex
            });
        }

        if (changes.pageSize !== undefined && !changes.pageSize.isFirstChange()) {
            this.dfs.updateProperty('pageSize', changes.pageSize.currentValue);
            this.pagerOpts = Object.assign(this.pagerOpts, {
                itemsPerPage: this.pageSize
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribes();

        if (this.ro) {
            this.ro.disconnect();
        }
    }

    private initBeforeEvents() {
        if (!this.beforeSelect) {
            this.beforeSelect = () => of(true);
        }
        if (!this.beforeUnselect) {
            this.beforeUnselect = () => of(true);
        }

        if (!this.beforeCheck) {
            this.beforeCheck = () => of(true);
        }

        if (!this.beforeUncheck) {
            this.beforeUncheck = () => of(true);
        }

        if (!this.beforeSortColumn) {
            this.beforeSortColumn = () => of(true);
        }
    }

    trackByRows = (index: number, row: any) => {
        return row[this.idField];
    }

    bindDocumentEditListener() {
        this.unbindDocumentEditListener();
        if (!this.documentCellClickHandler) {
            this.documentCellClickHandler = (event) => {
                if (this.currentCell) {
                    DomHandler.removeClass(this.currentCell.cellRef, CELL_SELECTED_CLS);
                    if (this.currentCell.isEditing) {
                        this.dfs.endEditCell();
                    }
                    this.dfs.cancelSelectCell();
                    this.unbindDocumentEditListener();
                }
            };
            this.docuemntCellClickEvents = this.render2.listen(document, 'click', this.documentCellClickHandler);
        }

        if (!this.documentCellKeydownHandler) {
            this.documentCellKeydownHandler = (event) => {
                this.onKeyDownEvent(event);
            };

            this.documentCellKeydownEvents = this.render2.listen(document, 'keydown', this.documentCellKeydownHandler);
        }
    }

    unbindDocumentEditListener() {
        if (this.documentCellClickHandler) {
            this.docuemntCellClickEvents();
            this.documentCellClickHandler = null;
        }

        if (this.documentCellKeydownHandler) {
            this.documentCellKeydownEvents();
            this.documentCellKeydownHandler = null;
        }
    }

    private unsubscribes() {
        this.subscriptions.forEach(ss => {
            if (ss) {
                ss.unsubscribe();
                ss = null;
            }
        });

        this.subscriptions = [];

        if (this.docuemntCellClickEvents) {
            this.docuemntCellClickEvents();
        }
    }

    selectNextCell( dir: MoveDirection) {
        const nextTd = this.findNextCell(this.currentCell.field, dir);
        if (nextTd) {
            nextTd['click'].apply(nextTd);
            return nextTd;
        }
    }

    editCell(rowIndex: number, field: string) {
    }

    private setPagerHeight() {
        if (!this.pagination) {
            this.pagerHeight = 0;
        } else {
            if (this.pagerHeight < this.dgPager.outerHeight) {
                this.pagerHeight = this.dgPager.outerHeight;
            }
        }
    }

    private setHeaderHeight() {
        this.headerHeight = this.dgHeader.height;
    }

    private findNextCell(field: string, dir: MoveDirection) {
        let td = null;
        if (this.currentCell && this.currentCell.cellRef) {
            const cellIndex = this.dfs.getColumnIndex(field);
            const currCellEl = this.currentCell.cellRef;
            if (dir === 'up') {
                const prevTr = currCellEl.parentElement.previousElementSibling;
                if (prevTr) {
                    td = prevTr.children[cellIndex];
                }
            } else if (dir === 'down') {
                const nextTr = currCellEl.parentElement.nextElementSibling;
                if (nextTr) {
                    td = nextTr.children[cellIndex];
                }
            } else if (dir === 'left') {
                td = currCellEl.previousElementSibling;
            } else if (dir === 'right') {
                td = currCellEl.nextElementSibling;
            }
        }
        return td;
    }

    private onKeyDownEvent(e: any) {
        const keyCode = e.keyCode;
        if (this.currentCell && !this.currentCell.isEditing) {
            switch (keyCode) {
                case 13: // Enter
                    const fn = this.currentCell.cellRef['editCell'];
                    if (fn) {
                        fn.apply(this.currentCell.cellRef);
                    }
                    break;
                case 40: // ↓
                    this.selectNextCell('down');
                    break;
                case 38: // ↑
                    this.selectNextCell('up');
                    break;
                case 39: // →
                    this.selectNextCell('right');
                    break;
                case 37: // ←
                    this.selectNextCell('left');
                    break;
                case 9: // Tab
                    if (e.shiftKey) {
                        this.selectNextCell('left');
                    } else {
                        this.selectNextCell('right');
                    }
                    e.preventDefault();
                    break;
            }
        }
    }

    loadData(data?: any) {
        this.closeLoading();
        data = data || [];
        if (this.pagination) {
            this.dfs.setPagination(this.pageIndex, this.pageSize, this.total);

            this.pagerOpts = Object.assign(this.pagerOpts, {
                itemsPerPage: this.pageSize,
                currentPage: this.pageIndex,
                totalItems: this.total
            });
        }
        this.dfs.loadData(data);
        this.dgs.dataSourceChanged();
    }

    fetchData(pageIndex, pageSize) {
        if (this.restService) {
            this.showLoading();
            const params = { pageIndex, pageSize };
            if (this.sortName) {
                params['sortName'] = this.sortName;
            }
            if (this.sortOrder) {
                params['sortOrder'] = this.sortOrder;
            }

            return this.restService.getData(this.url, params);
        }
        return of(undefined);
    }


    reload() {
        this.fetchData(1, this.pageSize).subscribe(res => {
            if (res) {
                this.pageIndex = 1;
                this.total = res.total;
                this.loadData(res.items);
            }
        });
    }

    setPageIndex(pageIndex: number) {
        // console.log(this.dgPager.pagination);
        this.pageIndex = pageIndex;
        this.pagerOpts.currentPage = pageIndex;
        this.cd.detectChanges();
    }


    onPageChange(pageIndex: number) {
        if (this.lockPagination) {
            return;
        }
        this.pageIndex = pageIndex;
        this.pagerOpts.currentPage = pageIndex;

        this.fetchData(pageIndex, this.pageSize).subscribe(res => {
            if (res) {
                this.loadData(res.items);
            }
        });

        this.pageChanged.emit({pageIndex, pageSize: this.pageSize});
    }

    onPageSizeChange(pageSize: number) {
        if (this.lockPagination) {
            return;
        }
        this.pageSize = pageSize;
        this.pagerOpts.itemsPerPage = pageSize;

        this.fetchData(1, pageSize).subscribe(res => {
            if (res) {
                this.pageIndex = 1;
                this.loadData(res.items);
            }
        });

        this.pageSizeChanged.emit({pageSize, pageIndex: this.pageIndex});
    }


    private initState() {
        this.data = this.data || [];
        this.dfs.initState({...this, fitColumns: this.fitColumns, fit: this.fit});
    }

    private setFitColumns(fitColumns = true) {
        if (this.columns) {
            this.dfs.fitColumns(fitColumns);
        }
    }

    private calculateGridSize(fit = true) {
        if (fit) {
            const parent = this.el.nativeElement.parentElement;
            const cmpRect = parent.getBoundingClientRect();

            const padding = this.getElementPadding(parent);
            const border = this.getElementBorderWidth(parent);

            this.width = cmpRect.width - border.left - border.right - padding.left - padding.right;
            this.height = cmpRect.height - border.top - border.bottom - padding.top - padding.bottom;
            this.dfs.resize({width: this.width, height: this.height});
            // this.refresh();
        }
    }

    showLoading() {
        this.loading = true;
        this.cd.detectChanges();
    }

    closeLoading() {
        this.loading = false;
        this.cd.detectChanges();
    }

    renderCustomStyle(cs: CustomStyle, dom: any) {
        if (cs.cls) {
            this.render2.addClass(dom, cs.cls);
        }

        if (cs.style) {
            const cssKeys = Object.keys(cs.style);
            cssKeys.forEach(k => {
                this.render2.setStyle(dom, k, cs.style[k]);
            });
        }
    }

    refresh() {
        this.cd.detectChanges();
    }

    getBoundingClientRect(el: ElementRef) {
        return el.nativeElement.getBoundingClientRect();
    }

    getElementPadding(el: HTMLElement) {
        const style = getComputedStyle(el);
        return {
            top:  this.replacePX2Empty(style.paddingTop),
            left:  this.replacePX2Empty(style.paddingLeft),
            bottom:  this.replacePX2Empty(style.paddingBottom),
            right:  this.replacePX2Empty(style.paddingRight)
        };
    }

    getElementBorderWidth(el: HTMLElement) {
        const style = getComputedStyle(el);
        return {
            top: this.replacePX2Empty(style.borderTopWidth),
            bottom: this.replacePX2Empty(style.borderBottomWidth),
            right: this.replacePX2Empty(style.borderRightWidth),
            left: this.replacePX2Empty(style.borderLeftWidth)
        };
    }

    selectRow(id: any) {
        if (id && (!this.selectedRow || this.selectedRow.id !== id)) {
            this.dfs.selectRecord(id);
        }
    }

    unSelectRow(id: any) {
        if (id) {
            this.dfs.selectRecord(id, false);
        }
    }

    selectAllRows() {
        if (this.multiSelect) {
            this.dfs.selectAll();
        }
    }

    clearSelections() {
        this.dfs.clearSelections();
    }

    checkRow(id: any) {
        if (this.canOperateCheckbox()) {
            this.dfs.checkRecord(id);
        }
    }

    checkAllRows() {
        if (this.canOperateCheckbox()) {
            this.dfs.checkAll();
        }
    }

    unCheckRow(id: any) {
        if (this.canOperateCheckbox()) {
            this.dfs.checkRecord(id, false);
        }
    }

    clearCheckeds() {
        this.dfs.clearCheckeds();
    }

    private canOperateCheckbox() {
        return this.multiSelect && this.showCheckbox;
    }

    private replacePX2Empty(strNum: string) {
        if (strNum) {
            return Number.parseInt(strNum.replace('px', ''), 10);
        }
        return 0;
    }
}
