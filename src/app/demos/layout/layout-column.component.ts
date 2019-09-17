import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
    selector: 'layout-columns',
    template: `
    <div #box class="d-flex flex-row" style="width: 100%; height: 100%;border:0px solid #ae00e6">
        <div class="west" [style.minWidth.px]="westWidth">
            <ng-content select="[region=west]"></ng-content>
        </div>
        <div region="center" class="center flex-fill">
            <ng-content></ng-content>
        </div>
    </div>
    `,
})
export class LayoutColumnComponent implements OnInit {
    @Input() westWidth = 80;
    @Input() southHeight = 80;
    @ViewChild('box') box: ElementRef;
    centerHeight: number;
    constructor() { }

    ngOnInit(): void {
        this.onresize();
    }

    @HostListener('window:resize')
    onresize() {
        const header = document.querySelector('.navbar-dark') as any;
        const headerHeight = header.offsetHeight;
        // this.box.nativeElement.style.height = (window.innerHeight - headerHeight) + 'px';
        // this.centerHeight = window.innerHeight - headerHeight - this.northHeight;
    }
}
