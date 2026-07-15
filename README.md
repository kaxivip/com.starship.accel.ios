# 星舟加速器 - 项目文件说明

> 版本 v1.0 | 2026.07.14 | Inner Mongolia CENJE Electronic CO., LTD.

---

## 项目概述

星舟加速器 iOS 高保真可交互原型 + 开发规范文档。  
基于 Vite + React + TypeScript 构建，可本地运行、可部署至 Vercel。

---

## 文件结构说明

```
com.starship.accel.ios/
├── README.md                          ← 本文件（项目说明）
├── dev-spec.html                      ← 开发规范文档（独立HTML，可直接浏览器打开）
├── index.html                         ← 应用入口 HTML
├── package.json                       ← 项目依赖与脚本配置
├── package-lock.json                  ← 依赖锁定文件
├── vite.config.ts                     ← Vite 构建配置
├── tsconfig.json                      ← TypeScript 编译配置
├── .gitignore                         ← Git 忽略规则
├── starship-accelerator-prototype.canvas.tsx  ← 原始 Canvas 源文件（QODER编辑器用）
├── public/
│   └── dev-spec.html                  ← 开发规范文档（部署后可通过 /dev-spec.html 访问）
└── src/
    ├── main.tsx                       ← React 应用入口
    └── App.tsx                        ← 完整原型组件（所有页面逻辑）
```

---

## 核心文件说明

| 文件 | 用途 | 面向对象 |
|------|------|----------|
| `src/App.tsx` | 完整的 16 页可交互原型源码（React组件） | iOS/H5 开发人员 |
| `dev-spec.html` | 开发规范文档：色彩/字体/间距/动效/导航/状态机/API/iOS专项/H5专项 | iOS/H5 开发人员 |
| `index.html` | 应用 HTML 壳，含 viewport 适配和深色背景 | 前端开发 |
| `vite.config.ts` | Vite 构建配置（React 插件） | 前端开发 |
| `package.json` | 依赖：react 18、vite 5、typescript 5 | 前端开发 |

---

## 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 本地开发（热更新）
npm run dev
# 访问 http://localhost:5173

# 3. 生产构建
npm run build
# 输出至 dist/ 目录

# 4. 预览构建产物
npm run preview
```

---

## 在线访问

| 链接 | 内容 |
|------|------|
| https://com-starship-accel-ios-s7i3.vercel.app/ | 高保真交互原型 |
| https://com-starship-accel-ios-s7i3.vercel.app/dev-spec.html | 开发规范文档 |
| https://github.com/kaxivip/com.starship.accel.ios | GitHub 仓库 |

---

## 原型包含页面（共 16 页）

1. **开屏页** - 品牌启动动画（2.8s自动跳转）
2. **隐私协议弹窗** - 首次启动必现
3. **加速首页** - 火箭动画 + 一键加速 + 模式切换
4. **连接中** - 进度条 + 速度线粒子
5. **已连接** - 实时计时 + 停止按钮
6. **会员中心** - 套餐选择 + CTA + 订阅说明
7. **登录页** - 短信/一键登录双模式
8. **我的** - 用户信息 + VIP状态 + 菜单
9. **设置** - 协议入口 + 通知 + 清缓存 + 注销/退出
10. **关于我们** - 品牌信息 + 备案号
11. **帮助中心** - 加速/会员双Tab + 手风琴FAQ
12. **隐私政策** - 完整法律文本
13. **服务协议** - 完整法律文本
14. **付费协议** - 完整法律文本
15. **注销账户** - 两步验证流程
16. **UI组件库** - 弹窗/Toast/Badge/按钮/Loading/卡片样式参考

---

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 5
- **部署**: Vercel (自动CI/CD)
- **设计基准**: 375 x 812pt (iPhone 13/14)

---

## 联系方式

- **公司**: Inner Mongolia CENJE Electronic CO., LTD.
- **邮箱**: sanye.app@outlook.com
- **备案号**: 沪ICP备2021006153号-4
