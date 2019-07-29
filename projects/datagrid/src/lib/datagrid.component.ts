import { Component, OnInit, Input, ViewEncapsulation,
    ContentChildren, QueryList, Output, EventEmitter, Renderer2, OnDestroy, OnChanges,
    SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Injector, HostBinding,
    AfterContentInit, NgZone, ElementRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import ResizeObserver from 'resize-observer-polyfill';
import { of, Subscription } from 'rxjs';
import { DataColumn, CustomStyle } from './types/data-column';
import { DatagridFacadeService } from './services/datagrid-facade.service';
import { DatagridColumnDirective } from './components/columns/datagrid-column.directive';
import { DataResult, CellInfo, SelectedRow } from './services/state';
import { RestService, REST_SERVICEE } from './services/rest.service';
import { DatagridService } from './services/datagrid.service';
import { GRID_EDITORS, CELL_SELECTED_CLS } from './types/constant';
import { DomHandler } from './services/domhandler';

@Component({
    selector: 'farris-datagrid',
    template: `
    <div class="f-datagrid" [class.f-datagrid-bordered]="showBorder"
        [class.f-datagrid-strip]="striped" [ngStyle]="{'width': width + 'px', 'height': height + 'px' }">
        <datagrid-header #header [columnsGroup]="colGroup$ | async" [height]="headerHeight"></datagrid-header>
        <datagrid-body [columnsGroup]="colGroup$ | async" [data]="ds.rows | paginate: pagerOpts"
                [startRowIndex]="ds.index" [topHideHeight]="ds.top" [bottomHideHeight]="ds.bottom"></datagrid-body>
        <datagrid-pager *ngIf="pagination"
            [id]="pagerOpts.id" (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"></datagrid-pager>
    </div>
    <datagrid-loading *ngIf="loading"></datagrid-loading>
    `,
    providers: [
        DatagridFacadeService,
        DatagridService
    ],
    styleUrls: [
        './scss/index.scss'
    ],
    exportAs: 'datagrid',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
    @Input() auther = `Lucas Huang - QQ:1055818239`;
    @Input() version = '0.0.1';

    @HostBinding('class') hostCls = '';

    @Input() id = '';
    /** 显示边框 */
    @Input() showBorder = true;
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
    @Input() showCheckbox = true;

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

    @Output() beginEdit = new EventEmitter();
    @Output() endEdit = new EventEmitter();

    @Output() scrollY = new EventEmitter();

    @Output() pageSizeChanged = new EventEmitter();
    @Output() pageChanged = new EventEmitter();

    @Output() loadSuccess = new EventEmitter();

    @Output() selectChanged = new EventEmitter();

    @ContentChildren(DatagridColumnDirective) dgColumns?: QueryList<DatagridColumnDirective>;

    colGroup$ = this.dfs.columnGroup$;
    data$ = this.dfs.data$;

    private _loading = false;
    get loading() {
        return this._loading;
    }
    set loading(val: boolean) {
        this._loading = val;
        this.cd.detectChanges();
    }

    docuemntEvents: any;
    documentEditListener: any;
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

    private keyDownSub: Subscription = null;
    private ro: ResizeObserver | null = null;
    private subscriptions: Subscription[] = [];

    constructor(private dfs: DatagridFacadeService,
                private dgs: DatagridService,
                public cd: ChangeDetectorRef,
                public el: ElementRef,
                private inject: Injector, private zone: NgZone,
                protected domSanitizer: DomSanitizer, private render2: Renderer2) {

        this.restService = this.inject.get<RestService>(REST_SERVICEE, null);

        const dataSubscription = this.data$.subscribe( (dataSource: any) => {
            this.ds = {...dataSource};
            this.cd.detectChanges();
            this.loadSuccess.emit(this.ds.rows);
        });

        this.subscriptions.push(dataSubscription);

        const Editors = this.inject.get<any[]>(GRID_EDITORS, []);
        if (Editors.length) {
            Editors.forEach(ed => {
                this.editors[ed.name] = ed.value;
            });
        }

        this.dfs.currentCell$.subscribe( cell => {
            this.currentCell = cell;
            this.bindDocumentEditListener();
        });
    }

    ngOnInit() {
        this.pagerOpts = {
            id:  this.id ? this.id + '-pager' :  'farris-datagrid-pager_' + new Date().getTime(),
            itemsPerPage: this.pagination ? this.pageSize : this.total,
            currentPage: this.pageIndex,
            totalItems: this.total,
            pageList: this.pageList
        };

        if (!this.pagination) {
            this.pagerHeight = 0;
        }

        if (!this.columns) {
            this.columns = this.fields;
        }

        this.zone.runOutsideAngular(() => {
            this.onKeyboardDown();

            this.ro = new ResizeObserver(() => {
                this.calculateGridSize(this.fit);
            });

            this.ro.observe(this.el.nativeElement.parentElement);
        });
    }

    ngAfterContentInit() {
        if (this.dgColumns && this.dgColumns.length) {
            this.columns = this.dgColumns.map(dgc => {
                return {...dgc};
            });
        }

        this.initState();
        // this.registerDocumentEvent();
        if (!this.data || !this.data.length) {
            this.fetchData(1, this.pageSize).subscribe( res => {
                if (!res) {
                    return;
                }
                this.total = res.total;
                this.loadData(res.items);
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.dfs.loadData(changes.data.currentValue);
            this.dgs.dataSourceChanged();
        }
    }

    ngOnDestroy() {
        this.docuemntEvents();
        this.unsubscribes();

        if (this.ro) {
            this.ro.disconnect();
        }
    }

    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = (event) => {
                if (this.currentCell) {
                    DomHandler.removeClass(this.currentCell.cellRef, CELL_SELECTED_CLS);
                    this.currentCell = null;
                    this.unbindDocumentEditListener();
                }
            };
            this.docuemntEvents = this.render2.listen(document, 'click', this.documentEditListener);
        }
    }

    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            this.docuemntEvents();
            this.documentEditListener = null;
        }
    }

    private onKeyboardDown() {
        const gridBody = document.querySelector('.f-datagrid-body');
        gridBody.addEventListener('keydown', (e) => { this.onKeyDownEvent(e); }, { passive: false } );
    }

    private unsubscribes() {
        this.subscriptions.forEach(ss => {
            ss.unsubscribe();
            ss = null;
        });

        this.subscriptions = [];
    }

    private onKeyDownEvent(e: any) {
        console.log(e);
        const keyCode = e.keyCode;
        if (e.target.nodeName === 'INPUT' && ([37, 38, 39, 40].indexOf(keyCode) > -1 )) {
            return;
        }
        e.stopPropagation();
        // e.preventDefault();
        const ccell = this.currentCell;
        if (!ccell) {
            return;
        }

        switch (keyCode) {
            case 13: // ✔
                if (this.editable && this.editMode === 'cell') {
                    if (!this.currentCell || !this.currentCell.isEditing) {
                        this.dfs.endEditCell();
                        this.dfs.editCell();
                    } else {
                        this.dfs.endEditCell();
                    }
                }
                // e.returnValue = false;
                // e.preventDefault();
                break;
            case 38: // ↑
                const prevIdx = ccell.rowIndex - 1;
                if (prevIdx < 0) {
                    return;
                }
                this.dfs.setCurrentCell(prevIdx, this.data[prevIdx], ccell.field);
                break;
            case 40: // ↓
                const nextIdx = ccell.rowIndex + 1;
                if (nextIdx > this.total) {
                    return;
                }
                this.dfs.setCurrentCell(nextIdx, this.data[nextIdx], ccell.field);
                break;
            case 37: // ←
                const prevColIdx = this.columns.findIndex((col, index) => {
                    return ccell.field === col.field;
                });
                if (prevColIdx) {
                    const prevCol = this.columns[prevColIdx - 1];
                    this.dfs.setCurrentCell(ccell.rowIndex, ccell.rowData, prevCol.field);
                }
                break;
            case 39: // →
                const nextColIdx = this.columns.findIndex((col, index) => {
                    return ccell.field === col.field;
                });
                if (nextColIdx < this.columns.length - 1) {
                    const nextCol = this.columns[nextColIdx + 1];
                    this.dfs.setCurrentCell(ccell.rowIndex, ccell.rowData, nextCol.field);
                }
                break;
        }
        this.cd.markForCheck();
        this.cd.detectChanges();
    }

    loadData(data?: any) {
        this.closeLoading();
        data = data || [];
        if (this.pagination) {
            this.dfs.setPagination(this.pageIndex, this.pageSize, this.total);
        }
        this.dfs.loadData(data);
        this.dgs.dataSourceChanged();
    }

    fetchData(pageIndex, pageSize) {
        if (this.restService) {
            this.showLoading();
            return this.restService.getData(this.url, { pageIndex, pageSize });
        }
        return of(undefined);
    }

    onPageChange(pageIndex: number) {
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

    reload() {
        this.fetchData(1, this.pageSize).subscribe(res => {
            if (res) {
                this.pageIndex = 1;
                this.total = res.total;
                this.loadData(res.items);
            }
        });
    }

    private initState() {
        this.data = this.data || [];
        this.dfs.initState({...this, fitColumns: this.fitColumns, fit: this.fit});
    }

    // private registerDocumentEvent() {
    //     this.docuemntEvents = this.render2.listen(document, 'click', () => {
    //         this.dfs.endEditCell();
    //         this.dfs.cancelSelectCell();
    //     });
    // }

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

    selectRow(row: SelectedRow) {
        if (row && (!this.selectedRow || this.selectedRow.id !== row.id)) {
            this.selectedRow = row;
            this.selectChanged.emit(row);
        }
    }

    private replacePX2Empty(strNum: string) {
        if (strNum) {
            return Number.parseInt(strNum.replace('px', ''), 10);
        }
        return 0;
    }
}
