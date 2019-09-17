import { DatagridComponent } from './../../datagrid.component';
/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 15:01:21
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-31 09:57:01
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, Input, ElementRef, Renderer2, ViewChild, OnDestroy, Injector, Inject, forwardRef } from '@angular/core';
import { DatagridService } from '../../services/datagrid.service';
import { SCROLL_X_ACTION } from '../../types/constant';
import { Subscription } from 'rxjs';

@Component({
    selector: 'datagrid-footer',
    templateUrl: './datagrid-footer.component.html'
})
export class DatagridFooterComponent implements OnInit, OnDestroy {
    private _footerData = [];
    @Input() get data() {
        return this._footerData;
    }
    set data(val: any[]) {
        this._footerData = val;
        this.height = val.length * 36;
    }

    @Input() width: number;
    @Input() columns: any[];
    @Input() columnsGroup: any;
    @ViewChild('footerContainer') footerContainer: ElementRef;


    height: number;
    scrollXSubscription: Subscription;

    private dgs: DatagridService;
    constructor(
        private render: Renderer2, private injector: Injector,
        @Inject(forwardRef(() => DatagridComponent)) public dg: DatagridComponent
    ) {
        this.dg = this.injector.get(DatagridComponent);
        this.dgs = this.injector.get(DatagridService);

        this.scrollXSubscription = this.dgs.scorll$.subscribe((d: any) => {
            if (d.type === SCROLL_X_ACTION) {
                this.render.setStyle(this.footerContainer.nativeElement,  'transform', `translate3d(-${d.x}px, 0px, 0px)` );
            }
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        if (this.scrollXSubscription) {
            this.scrollXSubscription.unsubscribe();
            this.scrollXSubscription = null;
        }
    }
}
