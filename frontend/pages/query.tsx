import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ScanTable from '../components/ScanTable';
import DateRangePicker, { DateRangeButtons } from '../components/DateRangePicker';
import Pagination from '../components/Pagination';
import Modal from 'react-modal';
import { getScans, getExportUrl, clearScans } from '../lib/api';
import { Scan, ScanQueryParams } from '../lib/types';
import { formatDate } from '../lib/date';
import { toast } from 'react-toastify';
import { FaSearch, FaFileExcel, FaTrash } from 'react-icons/fa';

// 设置Modal的根元素
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const QueryPage: React.FC = () => {
  // 状态
  const [scans, setScans] = useState<Scan[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [clearing, setClearing] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [barcode, setBarcode] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 生成查询参数，包括日期格式化
  const getQueryParams = useCallback((includePagination: boolean = true): ScanQueryParams => {
    const params: ScanQueryParams = {
      barcode: barcode || undefined,
      start_date: startDate ? formatDate(startDate) : undefined,
      end_date: endDate ? formatDate(endDate) : undefined,
    };

    if (includePagination) {
      params.skip = (currentPage - 1) * pageSize;
      params.limit = pageSize;
    }

    return params;
  }, [barcode, startDate, endDate, currentPage, pageSize]);

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getScans(getQueryParams(true));
      setScans(response.scans);
      setTotalItems(response.total);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败，请重试');
      setScans([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [getQueryParams]);

  // 当查询参数变化时重新加载数据
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 处理查询
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // 重置到第一页
    loadData();
  };

  // 处理导出
  const handleExport = async () => {
    if (exporting) return;
    
    setExporting(true);
    try {
      const exportUrl = getExportUrl(getQueryParams(false));

      // 使用fetch检查响应
      const response = await fetch(exportUrl);
      if (!response.ok) {
        throw new Error(`导出失败: ${response.statusText}`);
      }

      // 获取blob数据
      const blob = await response.blob();
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 从Content-Disposition获取文件名，如果没有则使用默认文件名
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `barcode_scans_${formatDate(new Date())}.xlsx`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('导出成功！');
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  // 处理清空记录
  const handleClear = async () => {
    if (clearing) return;
    
    setClearing(true);
    try {
      await clearScans();
      toast.success('记录已清空');
      loadData(); // 重新加载数据（现在应该是空的）
      setShowClearConfirm(false);
    } catch (error) {
      console.error('清空记录失败:', error);
      toast.error('清空记录失败，请重试');
    } finally {
      setClearing(false);
    }
  };

  // 日期快捷选择
  const handleSelectToday = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  };

  const handleSelectYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setStartDate(yesterday);
    setEndDate(yesterday);
  };

  const handleSelectLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    setStartDate(lastWeek);
    setEndDate(today);
  };

  const handleSelectLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    setStartDate(lastMonth);
    setEndDate(today);
  };

  return (
    <Layout title="记录查询 - 条码扫描管理系统">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">记录查询</h1>
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 flex items-center"
            disabled={clearing || loading || scans.length === 0}
          >
            <FaTrash className="mr-2" />
            {clearing ? '清空中...' : '清空记录'}
          </button>
        </div>
        
        {/* 查询表单 */}
        <div className="card mb-6">
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label htmlFor="barcode" className="label">条码</label>
              <input
                id="barcode"
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="input"
                placeholder="输入条码进行查询"
              />
            </div>
            
            <div className="mb-4">
              <label className="label">日期范围</label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
              <DateRangeButtons
                onSelectToday={handleSelectToday}
                onSelectYesterday={handleSelectYesterday}
                onSelectLastWeek={handleSelectLastWeek}
                onSelectLastMonth={handleSelectLastMonth}
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={loading}
              >
                <FaSearch className="mr-2" />
                {loading ? '查询中...' : '查询'}
              </button>
              
              <button
                type="button"
                onClick={handleExport}
                className="btn btn-secondary flex items-center"
                disabled={exporting || scans.length === 0}
              >
                <FaFileExcel className="mr-2" />
                {exporting ? '导出中...' : '导出Excel'}
              </button>
            </div>
          </form>
        </div>
        
        {/* 查询结果 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">查询结果</h2>
          
          <ScanTable scans={scans} loading={loading} />
          
          {!loading && scans.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* 清空确认对话框 */}
        <Modal
          isOpen={showClearConfirm}
          onRequestClose={() => setShowClearConfirm(false)}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <div className="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">确认清空记录</h2>
            <p className="mb-6 text-gray-600">
              此操作将删除所有扫描记录，且无法恢复。是否继续？
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                disabled={clearing}
              >
                {clearing ? '清空中...' : '确认清空'}
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* 添加Modal样式 */}
      <style jsx global>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-content {
          position: relative;
          outline: none;
          padding: 20px;
          max-width: 500px;
          width: 90%;
        }
      `}</style>
    </Layout>
  );
};

export default QueryPage;