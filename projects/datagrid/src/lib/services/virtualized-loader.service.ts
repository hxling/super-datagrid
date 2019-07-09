import { FarrisDatagridState } from './state';

export class VirtualizedLoaderService {
    state: Partial<FarrisDatagridState>;

    getTableHeight() {
        return this.state.height;
    }
    getTableHeaderHeight() {
        return this.state.headerHeight;
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

    reload() {
        const rowHeight = this.getRowHeight();
        const res = this.getRows(0);
        res.topHideHeight = this.state.virtual.rowIndex * rowHeight;
        res.bottomHideHeight = this.state.total * rowHeight - res.virtualRows.length * rowHeight - res.topHideHeight;
        return res;
    }

    getRows(scrollTop: number) {
        const minTop =  Math.abs(scrollTop);
        const maxTop = minTop + this.getTableHeight() + 100;
        // this.state.virtual.topHideHeight
        let top = 0;

        const rows = [];
        let topHideHeight = 0;
        let bottomHideHeight = 0;

        const data = this.state.data;
        const total = this.state.total;
        // console.log(total);
        const rowHeight = this.getRowHeight();

        this.state.virtual.rowIndex = (this.state.pageIndex - 1) * this.state.pageSize;


        // console.time('循环所有节点');
        for (const n of data) {
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
        // // console.timeEnd('循环所有节点');
        if (!this.state.pagination) {
            bottomHideHeight = total * rowHeight - rows.length * rowHeight - topHideHeight;
        }


        return {
            virtualRows: rows,
            topHideHeight,
            bottomHideHeight
        };
    }
}
