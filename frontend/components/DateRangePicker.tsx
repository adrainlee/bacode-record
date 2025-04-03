import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import zhCN from 'date-fns/locale/zh-CN';
import { format } from 'date-fns';

// 注册中文语言
registerLocale('zh-CN', zhCN);

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex-1">
        <label htmlFor="start-date" className="label">开始日期</label>
        <DatePicker
          id="start-date"
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          locale="zh-CN"
          className="input"
          placeholderText="选择开始日期"
          isClearable
        />
      </div>
      <div className="flex-1">
        <label htmlFor="end-date" className="label">结束日期</label>
        <DatePicker
          id="end-date"
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          locale="zh-CN"
          className="input"
          placeholderText="选择结束日期"
          isClearable
        />
      </div>
    </div>
  );
};

// 快捷选择按钮组件
interface DateRangeButtonsProps {
  onSelectToday: () => void;
  onSelectYesterday: () => void;
  onSelectLastWeek: () => void;
  onSelectLastMonth: () => void;
}

export const DateRangeButtons: React.FC<DateRangeButtonsProps> = ({
  onSelectToday,
  onSelectYesterday,
  onSelectLastWeek,
  onSelectLastMonth,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <button
        type="button"
        onClick={onSelectToday}
        className="px-3 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        今天
      </button>
      <button
        type="button"
        onClick={onSelectYesterday}
        className="px-3 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        昨天
      </button>
      <button
        type="button"
        onClick={onSelectLastWeek}
        className="px-3 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        最近一周
      </button>
      <button
        type="button"
        onClick={onSelectLastMonth}
        className="px-3 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        最近一个月
      </button>
    </div>
  );
};

export default DateRangePicker;