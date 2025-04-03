# 条码扫描系统后端部署指南

## 环境要求

- Python 3.11+
- Supervisor 4.2+
- 操作系统：Linux/Unix

## 目录结构

```
backend/
├── app/              # 应用程序代码
├── data/             # 数据文件
├── logs/             # 日志文件
├── gunicorn_conf.py  # Gunicorn配置
├── supervisor.conf   # Supervisor配置
├── requirements.txt  # Python依赖
└── start_prod.sh     # 生产环境启动脚本
```

## 安装步骤

1. 安装Python依赖：
```bash
pip install -r requirements.txt
```

2. 创建必要的目录：
```bash
mkdir -p logs data
```

3. 生成密钥（首次部署时）：
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

4. 配置环境变量：
   - 复制.env.prod到.env
   - 更新SECRET_KEY和其他必要的配置

## 启动服务

使用start_prod.sh脚本启动服务：
```bash
chmod +x start_prod.sh  # 添加执行权限（仅首次需要）
./start_prod.sh
```

## 服务管理

所有管理命令都需要在backend目录下执行。

### 查看服务状态
```bash
supervisorctl -c supervisor.conf status
```

### 启动服务
```bash
supervisorctl -c supervisor.conf start all
```

### 停止服务
```bash
supervisorctl -c supervisor.conf stop all
```

### 重启服务
```bash
supervisorctl -c supervisor.conf restart all
```

### 重新加载配置
```bash
supervisorctl -c supervisor.conf reload
```

## 日志查看

### 应用程序日志
- 访问日志：`logs/access.log`
- 错误日志：`logs/error.log`

### Supervisor日志
- 标准输出：`logs/supervisor_out.log`
- 错误输出：`logs/supervisord.log`

## 故障排除

1. 如果服务无法启动，检查：
   - logs/error.log 中的错误信息
   - logs/supervisord.log 中的supervisor错误
   - 确保端口8000未被占用

2. 如果遇到权限问题：
   - 确保data和logs目录可写
   - 检查数据库文件权限

3. 完全重启服务：
```bash
supervisorctl -c supervisor.conf shutdown
pkill -f gunicorn
./start_prod.sh
```

## 安全建议

1. 生产环境中修改以下配置：
   - 设置强密码的SECRET_KEY
   - 配置允许的CORS域名
   - 限制数据库文件权限

2. 定期检查：
   - 系统日志
   - 数据库备份
   - 服务状态

## API文档

启动服务后，可以通过以下URL访问API文档：
- Swagger UI: http://your-domain:8000/docs
- ReDoc: http://your-domain:8000/redoc