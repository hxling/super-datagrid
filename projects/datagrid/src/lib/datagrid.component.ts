import { Component, OnInit, Input, ViewEncapsulation,
    ContentChildren, QueryList, Output, EventEmitter, Renderer2, OnDestroy, OnChanges,
    SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Injector, HostBinding, ViewChildren, AfterContentInit } from '@angular/core';
import { DataColumn } from './types/data-column';
import { DatagridFacadeService } from './services/datagrid-facade.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatagridColumnDirective } from './components/columns';
import { DataResult } from './services/state';
import { RestService, REST_SERVICEE } from './services/rest.service';
import { DatagridService } from './services/datagrid.service';
import { of } from 'rxjs';
import { GRID_EDITORS } from './types';

@Component({
    selector: 'farris-datagrid',
    template: `
    <div class="f-datagrid" [class.f-datagrid-bordered]="showBorder"
    [class.f-datagrid-strip]="striped" [ngStyle]="{'width': width + 'px', 'height': height + 'px' }">
        <datagrid-header #header [columnGroup]="colGroup$ | async" [height]="headerHeight"></datagrid-header>
        <datagrid-body [data]="ds.rows | paginate: pagerOpts" [topHideHeight]="ds.top" [bottomHideHeight]="ds.bottom"></datagrid-body>
        <datagrid-pager *ngIf="pagination" [id]="pagerOpts.id" (pageChange)="onPageChange($event)"></datagrid-pager>
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

    @HostBinding('style.position') dgCls = 'relative';

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
    @Input() fit = false;
    /** 如果为真，则自动展开/收缩列的大小以适合网格宽度并防止水平滚动。 */
    @Input() fitColumns = false;
    /** 显示表头 */
    @Input() showHeader = true;
    /** 可拖动列设置列宽 */
    @Input() resizeColumn = true;
    /** 显示行号 */
    @Input() showRowNumber = false;
    /** 行号宽度 */
    @Input() rowNumberWidth = 36;
    /** 鼠标滑过效果开关，默认开启 */
    @Input() rowHover = true;

    /** 分页信息 */
    @Input() pagination = true;
    /** 当前页码 */
    @Input() pageIndex = 1;
    /** 每页记录数 */
    @Input() pageSize = 20;
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

    /** 虚拟加载 */
    @Input() virtualized = true;
    /** 虚拟加载数据的方式： client(客户端)、remote(远程) */
    @Input() virtualizedAsyncLoad = false;

    @Input() rowStyler: () => void;
    /** 编辑方式： row(整行编辑)、cell(单元格编辑)；默认为 row */
    @Input() editMode: 'row'| 'cell' = 'row';
    /** 编辑状态 */
    @Input() editable = false;

    @Output() beginEdit = new EventEmitter();
    @Output() endEdit = new EventEmitter();

    @Output() scrollY = new EventEmitter();
    @Output() pageChanged = new EventEmitter();

    @ContentChildren(DatagridColumnDirective) dgColumns: QueryList<DatagridColumnDirective>;

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
    ds = {
        rows: [],
        top : 0,
        bottom : 0
    };

    pagerOpts: any = { };
    restService: RestService;
    editors: any[];
    constructor(private dfs: DatagridFacadeService,
                private dgs: DatagridService,
                private cd: ChangeDetectorRef,
                private inject: Injector,
                protected domSanitizer: DomSanitizer, private render2: Renderer2) {

        this.restService = this.inject.get<RestService>(REST_SERVICEE, null);

        this.data$.subscribe( (dataSource: any) => {
            this.ds = {...dataSource};
            this.cd.detectChanges();
        });

        this.editors = this.inject.get<any[]>(GRID_EDITORS, []);

        console.log(this.editors);
    }

    ngOnInit() {
        this.pagerOpts = {
            id:  this.id ? this.id + '-pager' :  'farris-datagrid-pager_' + new Date().getTime(),
            itemsPerPage: this.pagination ? this.pageSize : this.total,
            currentPage: this.pageIndex,
            totalItems: this.total
        };

        if (!this.pagination) {
            this.pagerHeight = 0;
        }

    }

    ngAfterContentInit() {
        console.log('afterContentInit');
        if (this.dgColumns && this.dgColumns.length) {
            this.columns = this.dgColumns.map(dgc => {
                return {...dgc};
            });
        }

        this.initState();
        this.registerDocumentEvent();
        this.loadData();
    }

    private loadData() {
        if (!this.data || !this.data.length) {
            this.fetchData().subscribe((res: DataResult) => {
                if (res) {
                    const { items, pageIndex, pageSize, total } = {...res};
                    this.total = total;
                    this.dfs.setPagination(pageIndex, pageSize, total);
                    this.dfs.loadData(items);
                }
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
    }

    onPageChange(pageIndex: number) {
        this.pageIndex = pageIndex;
        this.pagerOpts.currentPage = pageIndex;
        this.pageChanged.emit(pageIndex);
    }

    fetchData(_pageIndex = 1) {
        if (this.restService) {
            return this.restService.getData(this.url, { pageIndex: _pageIndex, pageSize: this.pageSize });
        }
        return of(undefined);
    }

    private initState() {
        this.dfs.initState({...this});
    }

    private registerDocumentEvent() {
        this.docuemntEvents = this.render2.listen(document, 'click', () => {
            this.dfs.endEditCell();
        });
    }

    showLoading() {
        this.loading = true;
        this.cd.detectChanges();
    }

    closeLoading() {
        this.loading = false;
        this.cd.detectChanges();
    }

}
