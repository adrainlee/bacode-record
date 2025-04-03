import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { FaBarcode, FaSearch } from 'react-icons/fa';

const Home: React.FC = () => {
  return (
    <Layout title="首页 - 条码扫描管理系统">
      <div className="py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
          欢迎使用条码扫描管理系统
        </h1>
        
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* 条码扫描卡片 */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-4 mb-4">
                <FaBarcode className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">条码扫描</h2>
              <p className="text-gray-500 text-center mb-6">
                使用扫码枪或手动输入条码，系统将自动记录扫描时间和条码内容。
              </p>
              <Link href="/scan" legacyBehavior>
                <a className="btn btn-primary">
                  开始扫描
                </a>
              </Link>
            </div>
          </div>
          
          {/* 记录查询卡片 */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-4 mb-4">
                <FaSearch className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">记录查询</h2>
              <p className="text-gray-500 text-center mb-6">
                查询历史扫描记录，支持按日期和条码内容筛选，并可导出为Excel文件。
              </p>
              <Link href="/query" legacyBehavior>
                <a className="btn btn-primary">
                  查询记录
                </a>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500">
          <p>本系统使用Next.js和FastAPI构建，提供高效的条码扫描和管理功能。</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;