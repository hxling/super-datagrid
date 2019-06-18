import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ColumnGroup } from '../../types';
import { DatagridService } from '../../services/datagrid.service';
import { SCROLL_X_ACTION } from '../../types/constant';

@Component({
    selector: 'datagrid-header',
    templateUrl: './header.component.html'
})
export class DatagridHeaderComponent implements OnInit {
    @Input() height = 36;
    @Input() columnGroup: ColumnGroup;

    @ViewChild('headerContainer') headerContainer: ElementRef;
    constructor(  private dgSer: DatagridService, private render2: Renderer2) {
        this.dgSer.scorll$.subscribe((d: any) => {
            if (d.type === SCROLL_X_ACTION) {
                this.render2.setStyle(this.headerContainer.nativeElement,  'transform', `translate3d(-${d.x}px, 0px, 0px)` );
                // if (this.fixedLeft) {
                //     this.render2.addClass(this.fixedLeft.nativeElement, FIXED_LEFT_SHADOW_CLS);
                // }
            }

            // if (d.type === SCROLL_X_REACH_START_ACTION) {
            //     if (this.fixedLeft) {
            //         this.render2.removeClass(this.fixedLeft.nativeElement, FIXED_LEFT_SHADOW_CLS);
            //     }
            // }
        });
    }

    ngOnInit(): void { }
}
