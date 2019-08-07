import { HttpClient } from '@angular/common/http';
import { DataResult } from './state';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export const DATAGRID_REST_SERVICEE = new InjectionToken<RestService>('DataGrid Request Data Service.');

export abstract class RestService {
    abstract getData(url: string, param?: any): Observable<DataResult>;
}

export class DefaultRestService implements RestService {
    constructor(private http: HttpClient) {}
    getData(url: string, param?: any): Observable<DataResult> {
        return this.http.get<DataResult>(url, { params: param });
    }
}
