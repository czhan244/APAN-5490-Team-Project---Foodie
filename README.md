# APAN-5490-Team-Project---Foodie
A full-stack recipe sharing platform built for the APAN 5490 team project, with planned extensions for food detection, barcode-based search, and personalized health filtering.

一个基于React + Node.js + MongoDB的全栈美食分享平台。

## 项目结构

```
foodie/
├── client/                 # 前端 React
│   └── src/
│       ├── pages/         # 页面组件
│       ├── components/    # 可复用组件
│       └── App.js         # 主应用组件
├── server/                 # 后端 Node + Express
│   ├── routes/            # 路由定义
│   ├── controllers/       # 控制器逻辑
│   └── models/            # 数据模型
├── database/               # MongoDB 数据结构与样本数据
└── README.md
```

## 技术栈

### 前端
- React 18
- React Router
- Axios
- CSS3

### 后端
- Node.js
- Express.js
- MongoDB
- Mongoose

## 快速开始

### 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 启动开发服务器

```bash
# 启动后端服务器 (端口 5000)
cd server
npm run dev

# 启动前端开发服务器 (端口 3000)
cd client
npm start
```

### 数据库设置

确保MongoDB服务已启动，并在 `server/config/db.js` 中配置数据库连接。

## 功能特性

- 用户注册/登录
- 美食分享
- 评论系统
- 搜索功能
- 用户个人资料

## 开发团队

- 前端开发
- 后端开发
- 数据库设计 

