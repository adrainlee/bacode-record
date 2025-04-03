import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  if (totalPages <= 1) {
    return null;
  }
  
  // 计算要显示的页码范围
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6">
      <div className="hidden md:-mt-px md:flex">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } inline-flex items-center px-4 pt-4 border-t-2 border-transparent text-sm font-medium`}
        >
          上一页
        </button>
        
        {/* 页码按钮 */}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`${
              currentPage === number
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } inline-flex items-center px-4 pt-4 border-t-2 text-sm font-medium`}
          >
            {number}
          </button>
        ))}
        
        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } inline-flex items-center px-4 pt-4 border-t-2 border-transparent text-sm font-medium`}
        >
          下一页
        </button>
      </div>
      
      {/* 移动端分页 */}
      <div className="flex items-center justify-between w-full md:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-700'
          } relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300`}
        >
          上一页
        </button>
        <div className="text-sm text-gray-700">
          第 <span className="font-medium">{currentPage}</span> 页，
          共 <span className="font-medium">{totalPages}</span> 页
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-700'
          } relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300`}
        >
          下一页
        </button>
      </div>
    </nav>
  );
};

export default Pagination;