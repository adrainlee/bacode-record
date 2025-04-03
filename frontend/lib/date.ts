import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期
 * @param date - 日期字符串或Date对象
 * @param formatStr - 格式化字符串
 * @returns - 格式化后的日期字符串
 */
export function formatDate(date: string | Date | null | undefined, formatStr: string = 'yyyy-MM-dd'): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: zhCN });
}

/**
 * 格式化日期时间
 * @param date - 日期字符串或Date对象
 * @returns - 格式化后的日期时间字符串
 */
export function formatDateTime(date: string | Date | null | undefined): string {
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * 获取今天的日期字符串
 * @returns - 今天的日期字符串 (YYYY-MM-DD)
 */
export function getTodayString(): string {
    return formatDate(new Date());
}

/**
 * 获取昨天的日期字符串
 * @returns - 昨天的日期字符串 (YYYY-MM-DD)
 */
export function getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday);
}

/**
 * 获取一周前的日期字符串
 * @returns - 一周前的日期字符串 (YYYY-MM-DD)
 */
export function getOneWeekAgoString(): string {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return formatDate(oneWeekAgo);
}

/**
 * 获取一个月前的日期字符串
 * @returns - 一个月前的日期字符串 (YYYY-MM-DD)
 */
export function getOneMonthAgoString(): string {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return formatDate(oneMonthAgo);
}