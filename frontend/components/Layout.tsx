import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = '条码扫描管理系统' }) => {
  const router = useRouter();
  
  // 判断当前路由是否激活
  const isActive = (path: string): boolean => {
    return router.pathname === path;
  };

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/scan', label: '扫描' },
    { path: '/query', label: '查询' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-14">
            <div className="flex space-x-4 sm:space-x-8">
              {navItems.map(({ path, label }) => (
                <Link key={path} href={path} legacyBehavior>
                  <a
                    className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium
                      ${isActive(path) 
                        ? 'border-primary-500 text-primary-600' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    {label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          {children}
        </div>
      </main>
      
      <footer className="bg-white shadow mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} 条码扫描管理系统
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;