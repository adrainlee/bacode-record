# 条码扫描管理系统

一个基于Next.js和FastAPI的条码扫描管理系统，用于管理和查询条码扫描记录。

## 功能特点

- 条码扫描录入（支持扫码枪和手动输入）
- 自动提交机制（支持回车触发和延迟自动提交）
- 历史记录查询（支持按日期和条码内容筛选）
- 数据导出（支持导出为Excel格式）
- 响应式界面设计
- TypeScript 类型安全

## 技术栈

### 前端
- Next.js (React框架)
- TypeScript
- Tailwind CSS (样式框架)
- SWR (数据获取)
- React Icons
- React Datepicker
- React Toastify

### 后端
- FastAPI (Python Web框架)
- SQLAlchemy (ORM)
- Pydantic (数据验证)
- SQLite (数据库)
- pandas (数据处理)

## 安装说明

### 后端安装
1. 进入后端目录：
   ```bash
   cd backend
   ```

2. 创建虚拟环境（推荐）：
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # 或
   venv\Scripts\activate  # Windows
   ```

3. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

### 前端安装
1. 进入前端目录：
   ```bash
   cd frontend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

## 运行说明

### 启动后端
1. 进入后端目录：
   ```bash
   cd backend
   ```

2. 启动服务器：
   ```bash
   python run.py
   ```
   后端服务将在 http://localhost:8000 上运行

### 启动前端
1. 进入前端目录：
   ```bash
   cd frontend
   ```

2. 开发模式启动：
   ```bash
   npm run dev
   ```
   或生产模式构建和启动：
   ```bash
   npm run build
   npm start
   ```
   前端页面将在 http://localhost:3000 上运行

## API文档

启动后端服务后，可以通过以下地址访问API文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 使用说明

1. 条码扫描
   - 访问"条码扫描"页面
   - 使用扫码枪扫描条码，或手动输入条码
   - 系统会自动提交，或按回车键手动提交
   - 可以添加可选的备注信息

2. 记录查询
   - 访问"记录查询"页面
   - 可以按日期范围和条码内容进行筛选
   - 支持分页查看结果
   - 可以将查询结果导出为Excel文件

## 项目结构
```
.
├── backend/                # 后端代码
│   ├── app/               # 应用代码
│   │   ├── api/          # API路由
│   │   ├── crud/         # 数据库操作
│   │   ├── models/       # 数据库模型
│   │   └── schemas/      # Pydantic模式
│   ├── requirements.txt   # Python依赖
│   └── run.py            # 启动脚本
│
└── frontend/             # 前端代码
    ├── components/       # React组件
    ├── lib/             # 工具函数
    ├── pages/           # Next.js页面
    ├── public/          # 静态资源
    ├── styles/          # 样式文件
    └── package.json     # Node.js依赖