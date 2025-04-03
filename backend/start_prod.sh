#!/bin/bash

# 创建日志目录
mkdir -p logs

# 停止旧的supervisor进程（如果存在）
if [ -f supervisord.pid ]; then
    supervisorctl -c supervisor.conf shutdown
    rm -f supervisord.pid
fi

# 清理旧的socket文件（如果存在）
if [ -e supervisor.sock ]; then
    rm -f supervisor.sock
fi

# 安装依赖
pip install -r requirements.txt

# 启动supervisor
supervisord -c supervisor.conf

# 等待socket文件创建
sleep 2

# 查看进程状态
supervisorctl -c supervisor.conf status

echo "使用以下命令管理应用："
echo "supervisorctl -c supervisor.conf status        - 查看状态"
echo "supervisorctl -c supervisor.conf stop all      - 停止所有进程"
echo "supervisorctl -c supervisor.conf start all     - 启动所有进程"
echo "supervisorctl -c supervisor.conf restart all   - 重启所有进程"
echo "supervisorctl -c supervisor.conf reload        - 重新加载配置"