import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ColumnGroup } from '../../types';
import { DatagridService } from '../../services/datagrid.service';
import { SCROLL_X_ACTION, FIXED_LEFT_SHADOW_CLS, SCROLL_X_REACH_START_ACTION, FIXED_RIGHT_SHADOW_CLS } from '../../types/constant';
import { DatagridComponent } from '../../datagrid.component';

@Component({
    selector: 'datagrid-header',
    templateUrl: './header.component.html'
})
export class DatagridHeaderComponent implements OnInit, AfterViewInit {
    @Input() height = 36;
    @Input() columnsGroup: ColumnGroup;

    @ViewChild('headerContainer') headerContainer: ElementRef;
    @ViewChild('fixedLeft') fixedLeft: ElementRef;
    @ViewChild('fixedRight') fixedRight: ElementRef;

    constructor(  private dgSer: DatagridService, private render2: Renderer2, public dg: DatagridComponent) {
        this.dgSer.scorll$.subscribe((d: any) => {
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

    }

    ngAfterViewInit() {
        if (this.fixedRight) {
            const left = this.dg.width - this.columnsGroup.rightFixedWidth;
            this.render2.setStyle(this.fixedRight.nativeElement,  'transform', `translate3d(${ left }px, 0px, 0px)` );
            if (left !== this.columnsGroup.normalWidth + this.columnsGroup.leftFixedWidth) {
                this.render2.addClass(this.fixedRight.nativeElement, FIXED_RIGHT_SHADOW_CLS);
            }
        }
    }

}
