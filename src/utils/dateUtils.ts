/**
 * 将日期字符串或Date对象格式化为 'YYYY-MM-DD' 格式
 * @param date - 要格式化的日期（字符串或Date对象）
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * 获取当前日期的字符串，格式为 'YYYY-MM-DD'
   * @returns 当前日期的字符串
   */
  export function getCurrentDate(): string {
    return formatDate(new Date());
  }
  
  /**
   * 将 'YYYY-MM-DD' 格式的日期字符串转换为 Date 对象
   * @param dateString - 'YYYY-MM-DD' 格式的日期字符串
   * @returns 转换后的 Date 对象
   */
  export function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  /**
   * 检查给定的日期字符串是否为有效的 'YYYY-MM-DD' 格式
   * @param dateString - 要检查的日期字符串
   * @returns 是否为有效的日期格式
   */
  export function isValidDateString(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }