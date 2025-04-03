import React, { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { createScan } from '../lib/api';
import { debounce, processBarcode, validateBarcode } from '../lib/barcode';
import { FaBarcode } from 'react-icons/fa';

const ScanPage: React.FC = () => {
  const [barcode, setBarcode] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [recentScans, setRecentScans] = useState<Array<{ barcode: string, time: string, isDuplicate?: boolean }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 焦点管理函数
  const ensureFocus = useCallback(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 初始化焦点
  useEffect(() => {
    ensureFocus();
    return () => {
      if (focusTimerRef.current) {
        clearInterval(focusTimerRef.current);
      }
    };
  }, [ensureFocus]);

  // 设置定期检查焦点
  useEffect(() => {
    // 每100ms检查一次焦点
    focusTimerRef.current = setInterval(ensureFocus, 100);
    return () => {
      if (focusTimerRef.current) {
        clearInterval(focusTimerRef.current);
      }
    };
  }, [ensureFocus]);

  // 监听blur事件
  const handleBlur = useCallback(() => {
    // 使用setTimeout确保其他点击事件处理完成
    setTimeout(ensureFocus, 0);
  }, [ensureFocus]);

  // 提交扫描记录
  const handleSubmit = useCallback(async (barcodeToSubmit: string) => {
    if (isSubmitting) return;

    // 验证条码
    if (!validateBarcode(barcodeToSubmit)) {
      toast.error('请输入有效的条码');
      return;
    }

    setIsSubmitting(true);

    try {
      // 处理条码
      const processedBarcode = processBarcode(barcodeToSubmit);
      
      // 调用API创建扫描记录
      const response = await createScan({
        barcode: processedBarcode,
        notes: notes
      });

      // 添加到最近扫描记录
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      setRecentScans(prev => [
        {
          barcode: processedBarcode,
          time: timeString,
          isDuplicate: response.is_duplicate
        },
        ...prev.slice(0, 9) // 只保留最近10条记录
      ]);

      // 显示提示消息
      if (response.is_duplicate) {
        toast.warning(response.message);
      } else {
        toast.success(response.message);
      }
      
      // 清空输入
      setBarcode('');
      
      // 确保输入框保持焦点
      ensureFocus();
    } catch (error) {
      console.error('扫描失败:', error);
      toast.error('扫描失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, notes, ensureFocus]);

  // 创建防抖提交函数
  const debouncedSubmitRef = useRef(
    debounce((value: string) => {
      if (value) {
        handleSubmit(value);
      }
    }, 2000)
  );

  // 当依赖项改变时更新防抖函数
  useEffect(() => {
    debouncedSubmitRef.current = debounce((value: string) => {
      if (value) {
        handleSubmit(value);
      }
    }, 2000);
  }, [handleSubmit]);

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBarcode(value);
    
    // 如果输入不为空，触发防抖提交
    if (value) {
      debouncedSubmitRef.current(value);
    }
  }, []);

  // 处理回车键提交
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcode) {
      e.preventDefault();
      // 取消正在进行的防抖提交
      debouncedSubmitRef.current.cancel();
      // 立即提交
      handleSubmit(barcode);
    }
  }, [barcode, handleSubmit]);

  return (
    <Layout title="条码扫描 - 条码扫描管理系统">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">条码扫描</h1>
        
        <div className="card mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-primary-100 p-4">
              <FaBarcode className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="barcode" className="label">
              条码
            </label>
            <div className="relative">
              <input
                id="barcode"
                ref={inputRef}
                type="text"
                value={barcode}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="input pr-10"
                placeholder="请扫描条码或手动输入"
                disabled={isSubmitting}
                autoComplete="off"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              扫描后将自动提交，或按回车键手动提交
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="label">
              备注（可选）
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onFocus={ensureFocus}  // 当用户点击备注框时，立即重新聚焦到输入框
              className="input"
              rows={2}
              placeholder="输入备注信息（可选）"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => barcode && handleSubmit(barcode)}
              disabled={!barcode || isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? '提交中...' : '提交'}
            </button>
          </div>
        </div>
        
        {/* 最近扫描记录 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近扫描记录</h2>
          
          {recentScans.length === 0 ? (
            <p className="text-gray-500">暂无扫描记录</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      条码
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentScans.map((scan, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {scan.barcode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {scan.isDuplicate ? (
                          <span className="text-yellow-600">重复</span>
                        ) : (
                          <span className="text-green-600">成功</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;