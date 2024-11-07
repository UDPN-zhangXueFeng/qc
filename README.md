# my-vue3-project

基于 Vue 3 + TypeScript + Vite + Element Plus 的前端项目

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- Tailwind CSS
- Vue Router
- Axios

## 开发环境要求

- Node.js >= 20.x
- npm >= 9.x

## 项目设置

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
- 开发环境配置文件: `.env.development`
- 生产环境配置文件: `.env.production`

## 开发

启动开发服务器:
```bash
npm run dev
```
服务器将在 `http://localhost:5173` 启动（支持局域网访问）

## 构建

项目支持三种不同类型的构建:

1. Commission 版本构建:
```bash
npm run build:commission
```

2. Task 版本构建:
```bash
npm run build:task
```

3. QC 版本构建:
```bash
npm run build:qc
```

## 类型检查

运行 TypeScript 类型检查:
```bash
npm run type-check
```

## IDE 推荐配置

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- 请禁用 Vetur 插件以避免冲突

## 项目结构

```
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   ├── utils/          # 工具函数
│   ├── views/          # 页面组件
│   └── App.vue         # 根组件
├── public/             # 公共静态资源
├── .env.development    # 开发环境配置
├── .env.production     # 生产环境配置
├── vite.config.ts      # Vite 配置
└── tsconfig.json       # TypeScript 配置
```

## 主要功能

- 用户登录 (`src/views/login.vue`)
- 任务详情 (`src/views/task/detail.vue`)
- 支持 PDF 导出 (使用 jspdf)
- Excel 导出功能 (使用 xlsx)
- 响应式设计 (使用 Tailwind CSS)

## 注意事项

1. 开发时请确保正确配置环境变量
2. 构建前请选择正确的构建命令
3. 提交代码前请运行类型检查

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## License

[MIT](LICENSE)
