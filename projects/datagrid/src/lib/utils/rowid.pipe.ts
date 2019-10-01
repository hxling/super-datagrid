import { Pipe, PipeTransform } from '@angular/core';
import { DatagridFacadeService } from '../services';

@Pipe({name: 'rowDataId'})
export class RowDataIdPipe implements PipeTransform {

    constructor(private dfs: DatagridFacadeService) {}

    transform(rowData: any): any {
        if (rowData) {
            return 'row-' + this.dfs.primaryId(rowData);
        }
        return null;
    }
}
