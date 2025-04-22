#!/bin/bash
set -e

# 确保数据目录权限正确
echo "Setting correct permissions for data directory..."
chmod -R 777 /app/data
chmod -R 777 /app/logs

# 如果数据库文件存在，确保其权限正确
if [ -f /app/data/barcode_scanner.db ]; then
    echo "Setting permissions for database file..."
    chmod 777 /app/data/barcode_scanner.db
fi

# 创建一个触发器文件，确保在容器重启时也能正确设置权限
touch /app/data/.permissions_set

echo "Starting application..."
# 执行原始的CMD命令
exec gunicorn -c gunicorn_conf.py app.main:app