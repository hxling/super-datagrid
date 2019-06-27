export interface RowEventParam  {
    id?: string;
    index: number;
    data: any;
    mouseenter?: boolean;
}

export type RowHoverEventParam = Partial<RowEventParam>;

export type RowClickEventParam = Partial<RowEventParam>;
