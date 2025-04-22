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

## 开发环境运行说明

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
   前端页面将在 http://localhost:3000 上运行

## 生产环境部署说明

### 后端部署
1. 配置环境变量：
   ```bash
   cd backend
   cp .env.prod.example .env.prod
   # 编辑 .env.prod 配置生产环境参数
   ```

2. 启动服务：
   ```bash
   ./start_prod.sh
   ```
   这将使用supervisor管理FastAPI应用，提供自动重启和日志管理功能。

### 前端部署
1. 安装PM2（如果尚未安装）：
   ```bash
   npm install -g pm2
   ```

2. 构建和启动：
   ```bash
   cd frontend
   npm run build
   pm2 start ecosystem.config.js
   ```

3. 常用PM2命令：
   ```bash
   pm2 list            # 查看应用状态
   pm2 logs           # 查看日志
   pm2 restart all    # 重启所有应用
   pm2 stop all      # 停止所有应用
   ```

## 使用 Docker 部署 (推荐)

本项目推荐使用 Docker 和 Docker Compose 进行部署，可以简化环境配置和依赖管理。

### 前提条件
- 已安装 [Docker](https://docs.docker.com/get-docker/)
- 已安装 [Docker Compose](https://docs.docker.com/compose/install/) (通常随 Docker Desktop 一起安装)

### 部署步骤
1. **克隆仓库** (如果尚未克隆):
   ```bash
   git clone <your-repository-url>
   cd bacode-record  # 进入项目根目录
   ```

2. **配置环境变量**:
   ```bash
   # 复制后端环境变量示例文件并进行配置
   cp backend/.env.prod.example backend/.env.prod
   # 编辑 backend/.env.prod 文件，设置必要的环境变量
   ```
   这一步非常重要，因为后端服务需要这些环境变量来正确运行。

3. **设置用户权限** (解决数据库权限问题):
   ```bash
   # 导出当前用户的UID和GID环境变量
   export UID=$(id -u)
   export GID=$(id -g)
   ```
   这将确保Docker容器使用与宿主机相同的用户ID和组ID运行，从而避免权限问题。
   
   或者，您也可以创建一个`.env`文件在项目根目录：
   ```bash
   echo "UID=$(id -u)" > .env
   echo "GID=$(id -g)" >> .env
   ```

4. **构建并启动容器**:
   在项目根目录下（包含 `docker-compose.yml` 文件），运行以下命令：
   ```bash
   docker-compose up --build -d
   ```
   - `--build` 选项会强制重新构建镜像，确保使用最新的代码。
   - `-d` 选项会在后台（分离模式）运行容器。
   - 此命令会自动构建前端和后端的 Docker 镜像，并启动相应的服务容器。

5. **访问应用**:
   - **前端应用**: 打开浏览器访问 `http://localhost:3000`
   - **后端API文档 (Swagger UI)**: 访问 `http://localhost:8000/docs`
   - **后端API文档 (ReDoc)**: 访问 `http://localhost:8000/redoc`

### 常用 Docker Compose 命令

- **查看容器状态**:
  ```bash
  docker-compose ps
  ```

- **查看日志**:
  ```bash
  docker-compose logs         # 查看所有服务的日志
  docker-compose logs backend   # 只查看后端服务的日志
  docker-compose logs frontend  # 只查看前端服务的日志
  docker-compose logs -f backend # 实时跟踪后端日志
  ```

- **停止并移除容器**:
  ```bash
  docker-compose down
  ```
  这会停止并删除由 `docker-compose up` 创建的容器、网络和卷（除非卷被声明为外部卷）。

- **仅停止容器 (不移除)**:
  ```bash
  docker-compose stop
  ```

- **仅启动已停止的容器**:
  ```bash
  docker-compose start
  ```

- **重新构建镜像**:
  ```bash
  docker-compose build
  ```

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