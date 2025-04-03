#!/bin/bash

# 创建日志目录
mkdir -p logs

# 安装后端依赖
echo "Installing backend dependencies..."
cd backend
python -m pip install -r requirements.txt
cd ..

# 安装前端依赖并构建
echo "Installing frontend dependencies and building..."
cd frontend
npm install
npm run build
cd ..

# 使用pm2启动应用
echo "Starting applications with PM2..."
pm2 start ecosystem.config.js

# 保存PM2进程列表
echo "Saving PM2 process list..."
pm2 save

echo "Application started successfully!"
echo "Frontend running on http://localhost:3000"
echo "Backend API running on http://localhost:8000"