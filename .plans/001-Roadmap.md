# Roadmap 可视化项目

> updated_by: Kilo - GLM-5
> updated_at: 2026-05-10 10:04:25

## Requirements

在 monorepo 中创建 Roadmap 可视化子项目，使用 pnpm 工作区管理，构建为可部署到阿里云 FC 3.0 的生产环境产物。

项目使用 ByteDance FlowGram.ai 实现流程图/DAG/状态机的只读展示，数据以 YAML 格式存储在代码仓库中。

## Goals

- 创建 `packages/roadmap-rsrc`（React 前端，@magii/roadmap-rsrc）和 `packages/roadmap`（Midway.js 部署壳，@magii/roadmap）
- 构建产物可部署到阿里云 FC 3.0

## Non-Goals

- 不使用数据库存储数据（使用 YAML 文件）
- 不支持流程图编辑功能（仅只读展示）

## Functional Requirements

- **FR-001**: 系统应在 `packages/roadmap` 和 `packages/roadmap-rsrc` 目录下创建完整的项目结构
- **FR-002**: roadmap-rsrc 使用 React + Webpack 构建前端资源
- **FR-003**: roadmap 使用 Midway.js 作为部署壳承载前端
- **FR-004**: 系统应集成 ByteDance FlowGram.ai 实现流程图展示
- **FR-005**: 系统应支持从 YAML 文件加载流程图数据
- **FR-006**: 系统应以只读模式展示流程图
- **FR-030**: 系统不得使用数据库存储数据
- **FR-032**: 系统不得提供流程图编辑功能

## Constraints

- **C-001**: 必须使用 ByteDance FlowGram.ai 作为流程图库
- **C-002**: 必须使用 YAML 文件存储数据
- **C-003**: 流程图必须为只读模式
- **C-004**: 必须使用 pnpm 作为包管理器
- **C-006**: 构建产物必须可部署到阿里云 FC 3.0

## Specs

- [x] **SPEC-001**：monorepo 子项目结构与配置
  - **目标**：创建 @magii/roadmap（服务端）和 @magii/roadmap-rsrc（前端）两个子项目
  - **关键决策**：
    - roadmap-rsrc（React + Webpack）构建前端资源，通过 gulp 复制到 roadmap（Midway.js 部署壳）的 public/view 目录
    - roadmap（Midway.js）仅用于承载和部署前端，不含业务逻辑
    - 开发模式和生产模式使用完全相同的 `.dist/roadmap/` 目录结构
  - **路径约定**：
    - roadmap-rsrc 构建输出：`.dist/roadmap/index.html` + `.dist/roadmap/rsrc/dist/*.js`
    - gulp 复制：`.dist/roadmap/rsrc/**/*` → `../roadmap/public/rsrc/`，`.dist/roadmap/*.html` → `../roadmap/view/`
    - roadmap 服务端路径：`public/rsrc/dist/*.js`（静态资源），`view/index.html`（入口页面）
    - 访问路径：`/roadmap`，静态资源路由：`/roadmap/rsrc/dist/`
    - 服务端口：8080，开发服务器端口：3000
  - **命令**：
    - `pnpm --filter @magii/roadmap-rsrc dev` — 前端开发服务器（端口 3000）
    - `pnpm --filter @magii/roadmap-rsrc build` — 前端构建 + gulp 复制到 roadmap
    - `pnpm --filter @magii/roadmap dev` — 服务端开发服务器（端口 8080）
    - `pnpm --filter @magii/roadmap build` — 服务端构建
  - **验收**：
    - [x] 子项目目录结构完整
    - [x] roadmap-rsrc 构建 + gulp 复制到 roadmap 成功
    - [x] roadmap 服务端启动正常

- [ ] **SPEC-002**：FlowGram.ai 流程图展示与 YAML 数据集成
  - **目标**：使用 ByteDance FlowGram.ai 实现流程图只读展示，数据以 YAML 格式存储
  - **关键决策**：
    - 使用 @flowgram.ai/fixed-layout-editor
    - 使用 YAML 文件存储流程图数据
    - 流程图仅支持只读展示
  - **验收**：
    - [ ] roadmap-rsrc 已集成 FlowGram.ai（当前 readonly: false，需改为 true）
    - [ ] 添加 js-yaml 依赖
    - [ ] 创建示例 YAML 数据文件
    - [ ] 实现 YAML 数据加载和解析
    - [ ] 配置为只读模式
    - [ ] 流程图可正常显示和交互

## 项目目录结构

```
packages/roadmap-rsrc/              # @magii/roadmap-rsrc 前端
├── src/
│   ├── index.js                    # 入口
│   ├── App.js                      # 根组件（FlowGram.ai Editor）
│   ├── index.css                   # 全局样式（TailwindCSS）
│   ├── document.html               # HTML 模板
│   ├── initialData.js              # 初始流程图数据
│   └── nodeConfig.js               # 节点注册配置
├── .dist/roadmap/                  # 构建输出（webpack → gulp copy）
│   ├── index.html
│   └── rsrc/dist/umi-*.js, vendors-react-*.js
├── webpack.config.js
├── gulpfile.js
├── babel.config.js
├── tailwind.config.js
└── package.json

packages/roadmap/                   # @magii/roadmap 部署壳（Midway.js）
├── public/rsrc/dist/               # 前端静态资源（由 gulp 从 roadmap-rsrc 复制）
├── view/index.html                 # 入口页面（由 gulp 从 roadmap-rsrc 复制）
├── src/
│   ├── controller/
│   ├── config/
│   └── configuration.ts
├── app.js / bootstrap.js
└── package.json
```

## Phases

### PHASE-100: 基础框架与构建

已完成双项目框架搭建：roadmap-rsrc（React + Webpack + FlowGram.ai）和 roadmap（Midway.js 部署壳），构建流程通过 gulp 衔接。

- [x] 创建 roadmap-rsrc 项目结构（React + Webpack + webpack-chain）
- [x] 创建 roadmap 项目结构（Midway.js）
- [x] 配置 gulp 构建衔接（roadmap-rsrc → roadmap）
- [x] 集成 FlowGram.ai FixedLayoutEditor
- [x] 验证构建和开发服务器

### PHASE-200: 路由集成与 YAML 配置设计

集成 react-router，建立路由体系 `/roadmap/:appId/:planId`，设计 YAML 文件存储结构。

- [x] **集成 react-router**：在 roadmap-rsrc 的 index.js 中引入 BrowserRouter，App.js 中配置 Route
- [x] **路由设计**：`/roadmap/:appId/:planId`，匹配时从路径参数获取 appId 和 planId
- [x] **YAML 文件命名与存储**：
  - 目录：`packages/roadmap-rsrc/src/data/`
  - 命名：`{appId}-{planId}.yaml`（如 `Magii-PLAN-000.yaml`）
  - 通过 require.context 在构建时打包进 JS bundle（需配置 webpack yaml-loader）
  - YAML 结构与 FlowGram.ai 的 initialData 格式保持一致，不额外定义
- [x] **更新 view.controller.ts**：添加 `/roadmap/:appId/:planId` 路由，均渲染 index.html（SPA fallback）
- [x] **验证**：访问 `/roadmap/Magii/PLAN-000` 正确加载对应 YAML 数据

### PHASE-400: FlowGram.ai YAML 数据集成

将硬编码数据替换为 YAML 文件加载，配置只读模式。

- [ ] 添加 js-yaml 依赖
- [ ] 创建示例 YAML 数据文件
- [ ] 实现 YAML 数据加载和解析
- [ ] 将 readonly 改为 true
- [ ] 验证构建兼容性
