import { ChangeDetectorRef, NgZone } from '@angular/core';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:07
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-09-29 16:33:49
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Injector, Inject, forwardRef } from '@angular/core';
import { DataColumn } from '../../types';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridBodyComponent } from './datagrid-body.component';
import ResizeObserver from 'resize-observer-polyfill';


@Component({
    selector: 'datagrid-rows',
    templateUrl: './datagrid-rows.component.html',
})
export class DatagridRowsComponent implements OnInit, AfterViewInit {

    @Input() startRowIndex: number;
    @Input() data: any;
    @Input() columns: DataColumn[];
    @ViewChild('tableEl') tableEl: ElementRef;


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
                if (!this.dg.nowrap) {
                    const trheights = this.getTrDomHeight();
                    this.dgb.updateRowHeight(trheights);
                }
            });
        });
    }

    private getTrDomHeight() {
        const trDoms = this.el.nativeElement.querySelectorAll('.f-datagrid-body-row');
        const arr = [];
        trDoms.forEach(tr => arr.push(tr.offsetHeight ));
        return arr;
    }
}
