import { Component, OnInit, ChangeDetectorRef, ElementRef, Injector, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyComponent } from './datagrid-body.component';
import { ROW_INDEX_FIELD, IS_GROUP_ROW_FIELD, GROUP_ROW_FIELD, IS_GROUP_FOOTER_ROW_FIELD } from '../../services/state';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';

@Component({
    selector: 'fixed-left-rows',
    templateUrl: 'fixed-left-rows.component.html'
})

export class FixedLeftRowsComponent implements OnInit {

    @Input() columns = [];

    @Output() toggle = new EventEmitter();

    /** 启用分组时，数据源中自动设置行索引字段 */
    groupRowIndex = ROW_INDEX_FIELD;
    isGroupRow = IS_GROUP_ROW_FIELD;
    groupRow = GROUP_ROW_FIELD;
    isGroupFooter = IS_GROUP_FOOTER_ROW_FIELD;

    constructor(
        private cd: ChangeDetectorRef,
        public dg: DatagridComponent,
        public dgb: DatagridBodyComponent,
        public dfs: DatagridFacadeService,
        public el: ElementRef, private injector: Injector, private ngZone: NgZone) { }

    ngOnInit() { }

    toggleGroupRow(row, open) {
        row.expanded = open;
        this.toggle.emit();
    }

}
