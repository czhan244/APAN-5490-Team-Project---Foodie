#!/bin/bash

echo "🍽️ 启动 Foodie 美食分享应用..."

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 请先安装 Node.js"
    exit 1
fi

# 检查是否安装了 MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  警告: 未检测到 MongoDB，请确保 MongoDB 服务已启动"
fi

# 启动后端服务器
echo "🚀 启动后端服务器..."
cd server
npm install
npm run dev &
SERVER_PID=$!

# 等待后端启动
sleep 3

# 启动前端应用
echo "🎨 启动前端应用..."
cd ../client
npm install
npm start &
CLIENT_PID=$!

echo "✅ Foodie 应用已启动!"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:5000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $SERVER_PID $CLIENT_PID; exit" INT
wait 