import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ColumnGroup } from '../../types/data-column';
import { DatagridService } from '../../services/datagrid.service';
import { SCROLL_X_ACTION, FIXED_LEFT_SHADOW_CLS, SCROLL_X_REACH_START_ACTION, FIXED_RIGHT_SHADOW_CLS } from '../../types/constant';
import { DatagridComponent } from '../../datagrid.component';
import { DatagridHeaderCheckboxComponent } from '../checkbox/datagrid-header-checkbox.component';
import { DatagridFacadeService } from '../../services/datagrid-facade.service';

@Component({
    selector: 'datagrid-header',
    templateUrl: './header.component.html'
})
export class DatagridHeaderComponent implements OnInit, AfterViewInit {
    @Input() height = 36;
    @Input() columnsGroup: ColumnGroup;

    @ViewChild('header') header: ElementRef;
    @ViewChild('headerContainer') headerContainer: ElementRef;
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
                this.render2.setStyle(this.headerContainer.nativeElement,  'transform', `translate3d(-${d.x}px, 0px, 0px)` );
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

    private setHeight() {
        const offsetHeight = this.header.nativeElement.offsetHeight;
        if (this.height < offsetHeight) {
            this.height = offsetHeight;
        }
    }

    ngAfterViewInit() {
        this.setHeight();
    }

}
