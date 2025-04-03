// 扫描记录类型
export interface Scan {
    id: number;
    barcode: string;
    scanned_at: string;
    notes?: string;
}

// 创建扫描记录的请求类型
export interface ScanCreateRequest {
    barcode: string;
    notes?: string;
}

// 创建扫描记录的响应类型
export interface ScanCreateResponse {
    scan: Scan;
    is_duplicate: boolean;
    message: string;
}

// 日期或字符串类型
export type DateOrString = Date | string | null | undefined;

// 扫描记录查询参数类型
export interface ScanQueryParams {
    barcode?: string;
    start_date?: DateOrString;
    end_date?: DateOrString;
    skip?: number;
    limit?: number;
}

// 扫描记录响应类型
export interface ScanResponse {
    scans: Scan[];
    total: number;
}

// API错误类型
export interface ApiError extends Error {
    status?: number;
    info?: {
        message: string;
        [key: string]: any;
    };
}