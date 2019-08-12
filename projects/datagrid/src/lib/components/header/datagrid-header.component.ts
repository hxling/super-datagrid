/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-06 07:43:53
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-12 09:46:35
 * @QQ: 1055818239
 * @Version: v0.0.1
 */

import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { DataColumn } from './../../types/data-column';
import { ColumnGroup } from '../../types/data-column';
import { DatagridService } from '../../services/datagrid.service';
import { SCROLL_X_ACTION, FIXED_LEFT_SHADOW_CLS, SCROLL_X_REACH_START_ACTION, FIXED_RIGHT_SHADOW_CLS } from '../../types/constant';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridHeaderCheckboxComponent } from '../checkbox/datagrid-header-checkbox.component';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';

@Component({
    selector: 'datagrid-header',
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DatagridHeaderComponent implements OnInit, AfterViewInit {
    @Input() height = 36;
    @Input() columnsGroup: ColumnGroup;

    @ViewChild('header') header: ElementRef;
    @ViewChild('headerContainer') headerColumnsTable: ElementRef;
    @ViewChild('fixedLeft') fixedLeft: ElementRef;

    private _chkall: DatagridHeaderCheckboxComponent;
    @ViewChild('chkAll') set chkAll(v) {
        this._chkall = v;
    }

    private fixedRight: ElementRef;
    @ViewChild('fixedRight') set fr(val) {
        this.fixedRight = val;
        if (val && this.columnsGroup) {
            const left = this.dg.width - this.columnsGroup.rightFixedWidth;
            this.render2.setStyle(this.fixedRight.nativeElement,  'transform', `translate3d(${ left }px, 0px, 0px)` );
            if (left !== this.columnsGroup.normalWidth + this.columnsGroup.leftFixedWidth) {
                this.render2.addClass(this.fixedRight.nativeElement, FIXED_RIGHT_SHADOW_CLS);
            }
        }
    }

    constructor( private dgs: DatagridService, private dfs: DatagridFacadeService,
                 private render2: Renderer2, public dg: DatagridComponent) {
        this.dgs.scorll$.subscribe((d: any) => {
            if (d.type === SCROLL_X_ACTION) {
                this.render2.setStyle(this.headerColumnsTable.nativeElement,  'transform', `translate3d(-${d.x}px, 0px, 0px)` );
                if (this.fixedLeft) {
                    this.render2.addClass(this.fixedLeft.nativeElement, FIXED_LEFT_SHADOW_CLS);
                }

                if (this.fixedRight) {
                    if (d.x + this.dg.width - this.columnsGroup.rightFixedWidth ===
                            this.columnsGroup.normalWidth + this.columnsGroup.leftFixedWidth) {
                        this.render2.removeClass(this.fixedRight.nativeElement, FIXED_RIGHT_SHADOW_CLS);
                    } else {
                        this.render2.addClass(this.fixedRight.nativeElement, FIXED_RIGHT_SHADOW_CLS);
                    }
                }
            }

            if (d.type === SCROLL_X_REACH_START_ACTION) {
                if (this.fixedLeft) {
                    this.render2.removeClass(this.fixedLeft.nativeElement, FIXED_LEFT_SHADOW_CLS);
                }
            }
        });
    }

    ngOnInit(): void {
        this.dgs.checkedRowsTotalChanged$.subscribe(() => {
            if (this._chkall) {
                if (this.dfs.isCheckAll() || !this.dfs.getCheckeds().length) {
                    this._chkall.chk.nativeElement.indeterminate = false;
                } else {
                    this._chkall.chk.nativeElement.indeterminate = true;
                }
            }
        });
    }

    // setHeight() {
    //     const offsetHeight =  Math.max(this.headerColumnsTable.nativeElement.offsetHeight, this.dg.headerHeight);
    //     if (this.height < offsetHeight) {
    //         this.height = offsetHeight;
    //         this.header.nativeElement.style.height = this.height + 'px';
    //     }
    // }

    ngAfterViewInit() {
        // this.setHeight();
    }

    onSortColumnClick(e: MouseEvent, col: DataColumn) {
        if (!col.sortable) {
            return;
        }
        const sortName = this.dg.sortName;
        const sortOrder = this.dg.sortOrder;
        let sortFields = [];
        let sortOrders = [];
        if (sortName) {
            sortFields = sortName.split(',');
            sortOrders = sortOrder.split(',');
        }

        const colOrder = col.order || 'asc';
        let newOrder = colOrder;
        const i = sortFields.findIndex(n => n === col.field);
        if (i >= 0) {
            const _order = sortOrders[i] === 'asc' ? 'desc' : 'asc';
            newOrder = _order;
            if (this.dg.multiSort && newOrder === 'asc') {
                newOrder = undefined;
                sortFields.splice(i, 1);
                sortOrders.splice(i, 1);
            } else {
                sortOrders[i] = _order;
            }

        } else {
            if (this.dg.multiSort) {
                sortFields.push(col.field);
                sortOrders.push(colOrder);
            } else {
                sortFields = [col.field];
                sortOrders = [colOrder];
            }
        }

        col.order = newOrder;

        this.dg.sortName = sortFields.join(',');
        this.dg.sortOrder = sortOrders.join(',');
        this.dfs.setSortInfo(this.dg.sortName, this.dg.sortOrder);

        this.dg.beforeSortColumn(this.dg.sortName, this.dg.sortOrder).subscribe(() => {
            if (this.dg.remoteSort) {
                this.dg.reload();
            } else {
                this.dfs.clientSort();
            }

            this.dg.columnSorted.emit(col);
        });

    }
}
