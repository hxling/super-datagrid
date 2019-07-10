import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'datagrid-loading',
    template: `
    <div style="width: 100%;height: 100%;position: absolute;top: 0;background: rgba(231, 240, 255, 0.45);z-index: 9;">
        <div style="width: 60px;height: 60px;position: relative;top: 50%;margin-top: -30px;left: 50%;margin-left: -30px;">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <circle cx="50" cy="50" fill="none" r="30" stroke="#2c7dff" stroke-width="10"></circle>
                <circle cx="50" cy="50" fill="none" r="30" stroke="#d0eaff" stroke-width="10" stroke-linecap="square"
                  transform="rotate(178.821 50 50)">
                    <animateTransform attributeName="transform" type="rotate"
                        calcMode="linear" values="0 50 50;180 50 50;720 50 50" keyTimes="0;0.5;1" dur="1.6s" begin="0s"
                        repeatCount="indefinite"></animateTransform>
                    <animate attributeName="stroke-dasharray" calcMode="linear"
                        values="9.42477796076938 179.0707812546182;150.79644737231007 37.6991118430775;9.42477796076938 179.0707812546182"
                        keyTimes="0;0.5;1" dur="1.6" begin="0s" repeatCount="indefinite"></animate>
                </circle>
            </svg>
        </div>
    </div>
    `
})
export class DataGridLoadingComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
