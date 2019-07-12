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
        // const res = this.getRows(0);
        const scroTop = this.state.virtual.scrollTop;
        const res = this.getRows(scroTop);
        res.topHideHeight = scroTop; // this.state.virtual.rowIndex * rowHeight;
        if (res.bottomHideHeight !== 0) {
            res.bottomHideHeight = this.state.total * rowHeight - res.virtualRows.length * rowHeight - res.topHideHeight;
        }
        return res;
    }

    getRows(scrollTop: number) {
        const minTop =  Math.abs(scrollTop);
        const rowHeight = this.getRowHeight();
        const maxTop = minTop + this.getTableHeight();
        // this.state.virtual.topHideHeight
        let top = (this.state.virtualizedLoadType === 'client') ? 0 : this.state.virtual.rowIndex * rowHeight ;
        // let top = 0;

        const rows = [];
        let topHideHeight = 0;
        let bottomHideHeight = 0;

        const data: any[] = this.state.data;
        const total = this.state.total;
        // console.log(total);

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
        if (this.state.virtualizedLoadType === 'remote') {
            topHideHeight = this.state.virtual.rowIndex * rowHeight  + topHideHeight;
            bottomHideHeight = total * rowHeight - rows.length * rowHeight - topHideHeight;
        }

        // const idfield = this.state.idField;
        // if (rows.length) {
        //     this.state.virtual.rowIndex = this.state.virtual.rowIndex + data.findIndex( (n, index) => n[idfield] === rows[0][idfield]);
        // }

        return {
            virtualRows: [...rows],
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
