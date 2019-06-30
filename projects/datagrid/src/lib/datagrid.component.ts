import { DatagridHeaderComponent } from './components/header/header.component';
import { DatagridService } from './services/datagrid.service';
import { Component, OnInit, HostBinding, Input, ViewEncapsulation, ContentChildren, QueryList, Output, EventEmitter, Renderer2, OnDestroy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DataColumn, ColumnGroup } from './types/data-column';
import { DatagridFacadeService } from './services/datagrid-facade.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatagridColumnDirective } from './components/columns';
import { SCROLL_Y_ACTION } from './types/constant';

@Component({
    selector: 'farris-datagrid',
    template: `
    <div class="f-datagrid"
    [class.f-datagrid-bordered]="showBorder"
    [class.f-datagrid-strip]="striped"
    [ngStyle]="{'width': width + 'px', 'height': height + 'px' }">
        <datagrid-header #header [columnGroup]="colGroup$ | async" [height]="headerHeight"></datagrid-header>
        <datagrid-body [data]="state.rows"
        [topHideHeight]="state.top" [bottomHideHeight]="state.bottom"></datagrid-body>
    </div>
    `,
    providers: [
        DatagridFacadeService,
        DatagridService
    ],
    styleUrls: [
        "./scss/index.scss"
    ],
    encapsulation: ViewEncapsulation.None
})
export class DatagridComponent implements OnInit, OnDestroy, OnChanges {
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

    @Input() rowStyler: () => void;

    @Output() beginEdit = new EventEmitter();
    @Output() endEdit = new EventEmitter();

    @ContentChildren(DatagridColumnDirective) dgColumns: QueryList<DatagridColumnDirective>;

    colGroup$ = this.dfs.columnGroup$;
    data$ = this.dfs.data$;

    docuemntEvents: any;
    state = {
        rows: [],
        top : 0,
        bottom : 0
    };

    constructor(private dfs: DatagridFacadeService,
                private dgs: DatagridService,
                protected domSanitizer: DomSanitizer, private render2: Renderer2) {
        this.data$.subscribe(data => {
            if(data) {
                this.state = {...data};
                console.log(data);
            }
        });
    }

    ngOnInit() {
        this.initState();

        this.registerDocumentEvent();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.isFirstChange()) {
            this.dfs.loadData(changes.data.currentValue);
        }
    }

    ngOnDestroy() {
        this.docuemntEvents();
    }

    private initState() {
        // const { columns, idField, multiSelect, showCheckbox, showRowNumber } = {...this};
        this.dfs.initState({...this});
        this.dfs.initColumns();
    }

    private registerDocumentEvent() {
        this.docuemntEvents = this.render2.listen(document, 'click', () => {
            this.dfs.endEditCell();
        });
    }

}
