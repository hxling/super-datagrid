import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollbarComponent } from './scrollbar.component';
import { ScrollbarDirective } from './scrollbar.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [ScrollbarComponent, ScrollbarDirective],
    exports: [CommonModule, ScrollbarComponent, ScrollbarDirective]
})
export class ScrollbarModule {
}
