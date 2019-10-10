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

    displayRowsCount() {
        return Math.floor(this.getTableHeight() / this.getRowHeight());
    }

    reload() {
        const rowHeight = this.getRowHeight();
        const scroTop = this.state.virtual.scrollTop;
        const res = this.getRows(scroTop);

        res.topHideHeight = scroTop;
        if (res.bottomHideHeight !== 0) {
            res.bottomHideHeight = this.state.total * rowHeight - res.virtualRows.length * rowHeight - res.topHideHeight;
        }
        return res;
    }

    private binarySearch<T>(nodes: T[], condition: (item: T) => boolean, firstIndex = 0) {
        let left = firstIndex;
        let right = nodes.length - 1;

        while (left !== right) {
            const mid = Math.floor((left + right) / 2);

            if (condition(nodes[mid])) {
                right = mid;
            } else {
                if (left === mid) {
                    left = right;
                } else {
                    left = mid;
                }
            }
        }

        return left;
    }

    getRows(scrollTop: number) {
        const minTop =  Math.abs(scrollTop);
        const rowHeight = this.getRowHeight();
        const maxTop = minTop + this.getTableHeight();

        let top = (!this.state.virtualizedAsyncLoad) ? 0 : this.state.virtual.rowIndex * rowHeight ;

        const rows = [];
        let topHideHeight = 0;
        let bottomHideHeight = 0;

        const data: any[] = this.state.data;
        const total = this.state.total;

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

        if (this.state.virtualizedAsyncLoad) {
            topHideHeight = this.state.virtual.rowIndex * rowHeight  + topHideHeight;
            bottomHideHeight = total * rowHeight - rows.length * rowHeight - topHideHeight;
        }

        let startIndex = this.state.virtual.rowIndex;
        if (data && data.length && rows && rows.length) {
            startIndex = this.state.virtual.rowIndex + data.findIndex(r => r[this.state.idField] === rows[0][this.state.idField]);
        }
        return {
            startIndex,
            virtualRows: rows,
            topHideHeight,
            bottomHideHeight
        };
    }

    getRowsCount(scrollTop, itemsCount, firstRowIndex) {
        const rowHeight = this.getRowHeight();
        const total = this.state.total;
        const maxTop = scrollTop + this.getTableBodyHeight();
        let top = firstRowIndex * rowHeight;
        let rowsLength = 0;
        let topHideHeight = 0;
        let bottomHideHeight = 0;

        for (let i = 0; i < itemsCount; i++ ) {
            top += rowHeight;
            if (top + rowHeight < scrollTop) {
                topHideHeight += rowHeight;
                continue;
            } else {
                if (top > maxTop) {
                    continue;
                }
            }

            rowsLength++;
        }

        bottomHideHeight = total * rowHeight - rowsLength * rowHeight - topHideHeight;
        return {rowsLength, top: topHideHeight, bottom: bottomHideHeight};
    }
}
