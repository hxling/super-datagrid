import { ChangeDetectorRef, NgZone } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-10-09 18:09:34
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Injector, Inject, forwardRef } from '@angular/core';
import { DataColumn } from '../../types';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyComponent } from './datagrid-body.component';
import ResizeObserver from 'resize-observer-polyfill';
import { IS_GROUP_ROW_FIELD, GROUP_ROW_FIELD, IS_GROUP_FOOTER_ROW_FIELD } from '../../services/state';

@Component({
    selector: 'datagrid-rows',
    templateUrl: './datagrid-rows.component.html',
})
export class DatagridRowsComponent implements OnInit, AfterViewInit {

    @Input() startRowIndex: number;
    @Input() data: any;
    @Input() columns: DataColumn[];
    @ViewChild('tableEl') tableEl: ElementRef;


    isGroupRow = IS_GROUP_ROW_FIELD;
    groupRow = GROUP_ROW_FIELD;
    isGroupFooter = IS_GROUP_FOOTER_ROW_FIELD;

    private ro: ResizeObserver = null;

    constructor(
        private cd: ChangeDetectorRef,
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent,
        @Inject(forwardRef(() => DatagridBodyComponent)) public dgb: DatagridBodyComponent,
        public el: ElementRef, private injector: Injector, private ngZone: NgZone) {

            this.dgb.dgs.columnResized.subscribe( () => {
                if (!this.dg.nowrap) {
                    const trheights = this.getTrDomHeight();
                    this.dgb.updateRowHeight(trheights);
                }
            });

    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.ngZone.runOutsideAngular( () => {
            setTimeout(() => {
                const trheights = this.getTrDomHeight();
                if (!this.dg.nowrap) {
                    this.dgb.updateRowHeight(trheights);
                }
            });
        });
    }

    trackByField(index, item) {
        return item.field;
    }

    private getTrDomHeight() {
        const trDoms = this.el.nativeElement.querySelectorAll('.f-datagrid-body-row');
        const arr = [];
        trDoms.forEach(tr => {
            this.data['__position__'] = tr.offsetHeight;
            arr.push(tr.offsetHeight );
        });
        return arr;
    }
}
