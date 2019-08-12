/*
 * @Author: 疯狂秀才(Lucas Huang)
 * @Date: 2019-08-12 07:47:12
 * @LastEditors: 疯狂秀才(Lucas Huang)
 * @LastEditTime: 2019-08-12 14:56:41
 * @QQ: 1055818239
 * @Version: v0.0.1
 */
import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';

@Component({
    selector: 'layout-row',
    template: `
    <div #box class="d-flex flex-column">
        <div class="north" [style.height.px]="northHeight">
            <ng-content select="[region=north]"></ng-content>
        </div>
        <div region="center" class="center flex-fill">
            <ng-content select="[region=center]"></ng-content>
        </div>
        <div region="south" class="south" [style.height.px]="southHeight">
            <ng-content select="[region=south]"></ng-content>
        </div>
    </div>
    `,
})
export class LayoutRowComponent implements OnInit {
    @Input() northHeight = 80;
    @Input() southHeight = 80;
    @ViewChild('box') box: ElementRef;
    constructor() { }

    ngOnInit(): void {
        this.onresize();
    }

    @HostListener('window:resize')
    onresize() {
        const header = document.querySelector('.navbar-dark') as any;
        const headerHeight = header.offsetHeight;
        this.box.nativeElement.style.height = (window.innerHeight - headerHeight) + 'px';
    }
}
