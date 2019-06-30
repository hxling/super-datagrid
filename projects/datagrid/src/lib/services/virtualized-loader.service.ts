import { FarrisDatagridState } from './state';

export class VirtualizedLoaderService {
    state: Partial<FarrisDatagridState>;

    getTableHeight() {
        return this.state.height;
    }
    getTableHeaderHeight() {
        // return this.dg.headerCmp.height;
        return 36;
    }
    getTableBodyHeight() {
        return this.getTableHeight() - this.getTableHeaderHeight();
    }
    getTableWidth() {
        return this.state.width;
    }

    getRowHeight() {
        return this.state.rowHeight;
    }

    getRows(scrollTop: number) {
        const minTop = scrollTop;
        const maxTop = minTop + this.getTableHeight();

        let top = 0;
        const rows = [];
        let topHideHeight = 0;
        let bottomHideHeight = 0;

        const data = this.state.data;
        const rowHeight = this.getRowHeight();

        console.time('循环所有节点');
        for (const n of data) {
            // if ( !n.visible) {
            //     continue;
            // }
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
            virtualRows: rows,
            topHideHeight,
            bottomHideHeight
        };
    }
}
