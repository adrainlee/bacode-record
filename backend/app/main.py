from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .api.api import router as api_router
from .models.base import engine
from .models import models

# 创建数据库表
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="条码扫描管理系统",
    description="用于管理条码扫描记录的API",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该限制为前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含API路由
app.include_router(api_router, prefix="/api")

# 根路由
@app.get("/")
def read_root():
    return {"message": "欢迎使用条码扫描管理系统API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)