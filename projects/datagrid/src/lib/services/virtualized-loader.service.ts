import { DatagridComponent } from '../datagrid.component';

export class VirtualizedLoaderService {
    constructor(private dg: DatagridComponent) {}

    getTableHeight() {
        return this.dg.height;
    }
    getTableHeaderHeight() {
        // return this.dg.headerCmp.height;
        return 36;
    }
    getTableBodyHeight() {
        return this.dg.height - this.getTableHeaderHeight();
    }
    getTableWidth() {
        return this.dg.width;
    }

    getRowHeight() {
        return this.dg.rowHeight;
    }

    getRows(scrollTop: number) {
        const minTop = scrollTop;
        const maxTop = minTop + this.getTableHeight();

        let top = 0;
        const rows = [];
        let topHideHeight = 0;
        let bottomHideHeight = 0;

        const data = this.dg.data;
        const rowHeight = this.getRowHeight();

        console.time('循环所有节点');
        for (let i = 0; i < data.length; i++) {
            const n = data[i];
            if ( !n.visible) {
                continue;
            }
            top += rowHeight;
            if (top + rowHeight < minTop) {
                topHideHeight += rowHeight;
                continue;
            } else {
                if (top > maxTop) {
                    bottomHideHeight += rowHeight;
                    continue;
                }
            }

            rows.push(n);
        }
        console.timeEnd('循环所有节点');

        return {
            data: rows,
            topHideHeight,
            bottomHideHeight
        };
    }
}
