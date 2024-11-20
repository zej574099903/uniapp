# H5 项目

这是一个基于 uni-app 开发的 H5 项目。

## 技术栈

- Vue.js
- uni-app
- Sass/SCSS
- Vite

## 开发环境要求

- Node.js >= 14.18.0
- npm >= 6.14.0

## 安装

```bash
# 安装依赖
npm install
```

## 开发

```bash
# 启动开发服务器
npm run dev:h5
```

## 构建

```bash
# 构建生产环境
npm run build:h5
```

## 目录结构

```
├── src/                # 源代码目录
│   ├── pages/         # 页面文件
│   ├── components/    # 组件
│   ├── static/        # 静态资源
│   ├── store/         # Vuex 状态管理
│   ├── utils/         # 工具函数
│   └── App.vue        # 应用入口组件
├── public/            # 公共资源
├── dist/              # 构建输出目录
└── package.json       # 项目配置文件
```

## 特性

- 基于 uni-app 框架，一次开发，多端运行
- 使用 Vue.js 3 开发，支持组合式 API
- 支持 Sass/SCSS 预处理器
- 使用 Vite 作为构建工具，开发体验更好
- 支持多环境配置

## 注意事项

- 开发时请遵循 uni-app 的开发规范
- 建议使用 VS Code 进行开发，并安装相关插件
- 提交代码前请进行代码格式化

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交您的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 开启一个 Pull Request

## 许可证

[MIT](LICENSE)
