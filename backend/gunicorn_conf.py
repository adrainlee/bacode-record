import multiprocessing

# 监听地址和端口
bind = "0.0.0.0:8000"

# 工作进程数 - 一般设置为CPU核心数的2-4倍
workers = multiprocessing.cpu_count() * 2 + 1

# 工作模式 - 使用uvicorn的工作类
worker_class = "uvicorn.workers.UvicornWorker"

# 每个工作进程的最大请求数
max_requests = 1000
max_requests_jitter = 50

# 超时设置
timeout = 120

# 日志配置
# 将日志输出到标准输出/错误，方便Docker收集
accesslog = "-"
errorlog = "-"
loglevel = "info"

# 进程名称
proc_name = "barcode_scanner_api"

# 优雅重启
graceful_timeout = 120

# 前台运行（对supervisor来说很重要）
daemon = False