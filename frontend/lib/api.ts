import {
    Scan,
    ScanCreateRequest,
    ScanCreateResponse,
    ScanQueryParams,
    ScanResponse,
    ApiError
} from './types';

/**
 * 基础API请求函数
 * @param url - API端点
 * @param options - 请求选项
 * @returns - 请求响应
 */
// 从环境变量中获取API基础URL
// 根据环境选择正确的URL
// 在服务器端（Docker容器内），使用服务名称
// 在客户端（浏览器），使用localhost或域名
const API_BASE_URL = typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000' // 服务器端
    : (process.env.NEXT_PUBLIC_API_URL?.replace('http://backend:', 'http://localhost:') || 'http://localhost:8000'); // 客户端

export async function fetchAPI<T>(url: string, options: RequestInit = {}): Promise<T> {
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const mergedOptions: RequestInit = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        } as HeadersInit,
    };

    // 构建完整的API URL
    const fullUrl = `${API_BASE_URL}${url}`;

    const response = await fetch(fullUrl, mergedOptions);

    // 如果响应不成功，抛出错误
    if (!response.ok) {
        const error = new Error('API请求失败') as ApiError;
        error.status = response.status;
        try {
            error.info = await response.json();
        } catch (e) {
            error.info = { message: '无法解析错误响应' };
        }
        throw error;
    }

    // 检查内容类型，如果是JSON则解析
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response as unknown as T;
}

/**
 * 创建新的扫描记录
 * @param data - 扫描数据
 * @returns - 请求响应
 */
export async function createScan(data: ScanCreateRequest): Promise<ScanCreateResponse> {
    return fetchAPI<ScanCreateResponse>('/api/scans', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * 处理查询参数
 * @param params - 查询参数
 * @returns - 处理后的查询参数
 */
function processQueryParams(params: ScanQueryParams): Record<string, string> {
    const processedParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (value instanceof Date) {
                // 将日期转换为ISO格式的日期字符串（不包含时间）
                processedParams[key] = value.toISOString().split('T')[0];
            } else {
                processedParams[key] = String(value);
            }
        }
    });

    return processedParams;
}

/**
 * 获取扫描记录列表
 * @param params - 查询参数
 * @returns - 请求响应
 */
export async function getScans(params: ScanQueryParams = {}): Promise<ScanResponse> {
    const processedParams = processQueryParams(params);
    const queryParams = new URLSearchParams(processedParams);
    const queryString = queryParams.toString();
    const url = `/api/scans${queryString ? `?${queryString}` : ''}`;

    return fetchAPI<ScanResponse>(url);
}

/**
 * 获取导出URL
 * @param params - 查询参数
 * @returns - 导出URL
 */
export function getExportUrl(params: ScanQueryParams = {}): string {
    const { skip, limit, ...exportParams } = params; // 移除分页参数
    const processedParams = processQueryParams(exportParams);
    const queryParams = new URLSearchParams(processedParams);
    const queryString = queryParams.toString();
    return `/api/scans/export${queryString ? `?${queryString}` : ''}`;
}

/**
 * 清空所有扫描记录
 * @returns - 请求响应
 */
export async function clearScans(): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>('/api/scans', {
        method: 'DELETE',
    });
}