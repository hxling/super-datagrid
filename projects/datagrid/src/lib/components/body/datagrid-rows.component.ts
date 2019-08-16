import { SimpleChanges, ChangeDetectorRef } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-16 18:31:38
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Injector, Inject, forwardRef, OnChanges } from '@angular/core';
import { DataColumn } from '../../types';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyComponent } from './datagrid-body.component';


@Component({
    selector: 'datagrid-rows',
    templateUrl: './datagrid-rows.component.html',
})
export class DatagridRowsComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() startRowIndex: number;
    @Input() data: any;
    @Input() columns: DataColumn[];
    @ViewChild('tableEl') tableEl: ElementRef;

    constructor(
        private cd: ChangeDetectorRef,
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent,
        @Inject(forwardRef(() => DatagridBodyComponent)) public dgb: DatagridBodyComponent,
        public el: ElementRef, private injector: Injector) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data !== undefined && !changes.data.isFirstChange()) {
            this.cd.markForCheck();
            this.cd.detectChanges();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (!this.dg.nowrap) {
                const trheights = this.getTrDomHeight();
                this.dgb.updateRowHeight(trheights);
                // this.dgb.rowHeightList = trheights;
            }
        });
    }

    private getTrDomHeight() {
        const trDoms = this.el.nativeElement.querySelectorAll('.f-datagrid-body-row');
        const arr = [];
        trDoms.forEach(tr => arr.push(tr.offsetHeight ));
        return arr;
    }
}
