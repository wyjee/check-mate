export interface IHistory {
    id: number;
    text: string;
    diff: [number, string][];
    created_at: string;
};