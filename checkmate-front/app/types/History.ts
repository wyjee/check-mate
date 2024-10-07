export interface IHistory {
    id: number;
    text: string;
    diff: [number, string][];
    created_at: string;
};

export interface IPagination {
    count: number;
    next: string | null;
    previous: string | null;
}

export interface IPaginationProps {
    page: number;
    pages: number;
    setPage: (idx: number)=>void;
    count: number;
}