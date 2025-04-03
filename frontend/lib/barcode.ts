/**
 * 条码扫描工具函数
 */

// 定义带有cancel方法的防抖函数类型
export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}

// 防抖函数：在指定时间内只执行一次
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): DebouncedFunction<T> {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (this: any, ...args: Parameters<T>): void {
        const later = () => {
            timeout = null;
            func.apply(this, args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    } as DebouncedFunction<T>;

    // 添加取消方法
    debounced.cancel = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}

/**
 * 处理条码扫描输入
 * @param input - 输入的条码字符串
 * @returns - 处理后的条码字符串
 */
export function processBarcode(input: string): string {
    // 移除空白字符
    return input.trim();
}

/**
 * 验证条码格式
 * @param barcode - 条码字符串
 * @returns - 是否是有效的条码
 */
export function validateBarcode(barcode: string): boolean {
    // 这里可以根据实际需求添加条码验证逻辑
    // 简单示例：条码不为空且长度大于0
    return barcode.length > 0;
}