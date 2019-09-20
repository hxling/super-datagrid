import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const loading_style_spinner = `
<svg class="lds-spinner" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="rotate(0 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(30 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(60 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(90 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(120 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(150 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(180 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(210 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(240 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(270 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(300 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
  </rect>
</g><g transform="rotate(330 50 50)">
  <rect x="47" y="25" rx="4.7" ry="2.5" width="6" height="10" fill="#1b335f">
    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
  </rect>
</g></svg>
`;

const loading_style_ring =
`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <circle cx="50" cy="50" fill="none" r="30" stroke="#2c7dff" stroke-width="10"></circle>
  <circle cx="50" cy="50" fill="none" r="30" stroke="#d0eaff" stroke-width="10" stroke-linecap="square" transform="rotate(178.821 50 50)">
      <animateTransform attributeName="transform" type="rotate"
          calcMode="linear" values="0 50 50;180 50 50;720 50 50" keyTimes="0;0.5;1" dur="1.6s" begin="0s"
          repeatCount="indefinite"></animateTransform>
      <animate attributeName="stroke-dasharray" calcMode="linear"
          values="9.42477796076938 179.0707812546182;150.79644737231007 37.6991118430775;9.42477796076938 179.0707812546182"
          keyTimes="0;0.5;1" dur="1.6" begin="0s" repeatCount="indefinite"></animate>
  </circle>
</svg>`;

@Component({
    selector: 'datagrid-loading',
    template: `
    <div style="width:100%;height:100%;position:absolute;top:0;left: 0;background:rgba(255,255,255,0);z-index: 9;pointer-events: unset;">
        <div style="width: 50px;height: 50px;position: relative;top: 50%;margin-top: -25px;left: 50%;margin-left: -25px;"
        [innerHTML]="loading" >
        </div>
    </div>
    `
})
export class DataGridLoadingComponent implements OnInit {

    @Input() loading: any;

    constructor(private domSanitizer: DomSanitizer) { }

    ngOnInit(): void {
        if (this.loading) {
            this.loading = this.domSanitizer.bypassSecurityTrustHtml(this.loading);
        } else {
            this.loading = this.domSanitizer.bypassSecurityTrustHtml(loading_style_ring);
        }
    }


}
