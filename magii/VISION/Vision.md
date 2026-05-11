# Vision

## Vision

Magii 成为 AI Agent 工作流的标准定义框架，通过公约形式固化 AI Agent 行为规范、工作流程与协作规则，让用户在多种平台（IDE、移动端等）和 AI 助手工具中获得统一、可靠的 AI 协作体验。

## Root Plan

- id: P0
- name: 将 Magii 建设为 AI Agent 工作流的标准定义框架
- parent: none
- children: P1, P2, P3
- status: FRONTIER
- requirements:
  - 面向用户提供标准化的 AI Agent 协作规范、工作流定义与行为约束能力
  - 通过"公约"形式固化最佳实践，公约文档保持稳定、工具无关
  - 支持多种平台（IDE、移动端等）集成，至少覆盖 3 种工具/平台
  - 新增 AI Agent 可通过加载公约快速理解项目上下文，实现快速接入
  - 提供参考客户端实现，验证框架可落地性

## Focus

- **背景**：Android 客户端首页需要动态可配置，卡片布局样式通过后端 JSON 下发，避免发版
- **核心问题**：加入新卡片布局样式时，如何不重新 Build、不经过应用商店审核即可动态更新
- **场景**：假设已有三种完全不同的卡片渲染布局样式，通过后端 JSON 配置切换；需要第四种时，客户端无需发版即可渲染
- **难点**：原生 Android 应用传统方式需改代码 → Build → 提审 → 上架，周期长；需要一种绕过此流程的动态布局下发方案
- **本阶段重点**：讨论首页动态卡片布局的热更新技术方案方向，不进入具体代码实现

## Plan Tree

### P1: Magii 核心系统 MVP 建设
- parent: P0
- children: P1.1, P1.2, P1.3, P1.4
- status: FRONTIER
- requirements:
  - 建立注册中心、调度中心、自我学习、自我进化四大核心能力，形成完整系统闭环
  - 产出可运行的最小可用系统（MVP），不包含具体业务逻辑实现
  - 外部系统通过 API/Webhook 接入，Magii 自身保持紧凑，不自建 Utils 类型能力

#### P1.1: 注册中心能力
- parent: P1
- children: none
- status: BLOCKED
- blocker:
  - Phase 1 建设已暂停，恢复建设需外部显式决策
- requirements:
  - 提供服务注册与发现能力，管理外部系统（爬虫、量化交易等）的接入
  - 记录服务调用关系，支持服务状态管理
  - 完成标准：服务注册 API 可用，服务发现功能正常，调用关系可查询

#### P1.2: 调度中心能力
- parent: P1
- children: none
- status: READY
- requirements:
  - 通过外部应用 flowablex 建立任务调度与工作流编排能力
  - Magii 与 flowablex 集成接口可用，双向通信正常
  - 记录关键云设施接入点（如阿里云 Step Function、EventBridge 等）
  - 完成标准：flowablex 部署可用，Magii 侧集成接口验证通过

#### P1.3: 自我学习能力
- parent: P1
- children: none
- status: FRONTIER
- requirements:
  - 实现基于反馈的学习核心机制，记录调度过程中的决策与结果
  - 能够利用历史经验调整策略，学习过程可追溯
  - 完成标准：学习模块可运行，能记录并利用历史经验
  - 关键假设：P1.2 调度中心已完成，可提供执行反馈数据

#### P1.4: 自我进化能力
- parent: P1
- children: none
- status: FRONTIER
- requirements:
  - 实现基于学习结果的自我优化与进化机制
  - 进化过程可追溯，支持回滚
  - 完成标准：进化模块可运行，能基于学习结果调整调度策略
  - 关键假设：P1.3 自我学习能力已完成，可提供经验数据

### P2: Plan 树 DSL 标准化与外部接入
- parent: P0
- children: P2.1, P2.2
- status: FRONTIER
- requirements:
  - Bootstrap 的 Plan 树产物形式化为可机读的 DSL，使外部工具可消费
  - 以 Roadmap 为第一案例，定义 DSL 与外部工具之间的接入契约
  - DSL 设计只在 Vision 侧产出；外部工具（如 Roadmap）自行实现转换脚本

#### P2.1: Plan 树 DSL Schema 设计
- parent: P2
- children: none
- status: READY
- requirements:
  - DSL 格式：YAML；结构：flat dict，以 Plan id 为 key
  - 必选字段：`name`, `parent`, `children`, `status`, `requirements`；条件字段：`blockers`（仅 BLOCKED）；可选字段：`assumptions`
  - 元字段：`schema_version`、`vision`（Vision 陈述）、`focus`（当前 Focus 列表，无则为空列表）
  - 存储位置：**内嵌 Vision.md**，新增 `## Plan DSL` section，内容为 YAML 代码块
  - Bootstrap 同时维护 `## Plan Tree`（human-readable）与 `## Plan DSL`（machine-readable），两者互为镜像
  - 完成标准：`## Plan DSL` section 存在于 Vision.md，schema 字段规范有文档，Bootstrap 可按此格式输出

#### P2.2: Roadmap 接入契约定义
- parent: P2
- children: none
- status: BLOCKED
- blocker:
  - 依赖 Roadmap 侧提供其自身数据结构约束，否则无法定义转换接口
- requirements:
  - 定义 Vision 侧 DSL 与 Roadmap 所需格式之间的接口契约（文档形式）
  - 明确 Roadmap 侧需自行实现转换脚本，Vision 不负责
  - 完成标准：接口契约文档存在，Roadmap 开发者可据此实现转换

### P3: 客户端应用建设
- parent: P0
- children: P3.1, P3.2
- status: FRONTIER
- requirements:
  - 为 Magii 框架提供可落地的参考客户端实现，验证框架能力可触达终端用户
  - 当前 Focus 为 Android 客户端；多平台扩展仅做占位，当前不展开
  - 客户端消费 Magii 后端能力，不重新定义核心规范

#### P3.1: Android 客户端 MVP
- parent: P3
- children: P3.1.1, P3.1.2, P3.1.3, P3.1.4
- status: FRONTIER
- requirements:
  - 交付可在 Android 设备上运行的客户端应用，覆盖 Magii 核心能力的移动端触达
  - 消费 Magii 后端 API（Plan 树查看、状态管理、调度触发等）
  - 完成标准：Android 客户端可安装运行，可展示 Plan 树并触发基本操作
  - 关键假设：Magii 后端已有可用的 API 供客户端调用

##### P3.1.1: Android 项目骨架与架构确立
- parent: P3.1
- children: none
- status: READY
- requirements:
  - 建立 Android 项目结构与架构选型，产出可编译运行的项目骨架
  - 确定关键技术选型（UI 框架、依赖注入、网络库等）
  - 完成标准：Android 项目可编译运行，架构决策已记录，开发者可基于此骨架继续开发

##### P3.1.2: Magii 后端 API 对接层
- parent: P3.1
- children: none
- status: BLOCKED
- blocker:
  - 依赖 Magii 后端提供可用的 API（Plan 树查询、状态变更等），当前后端 API 状态不明
- requirements:
  - 实现 Android 客户端与 Magii 后端的 API 通信层
  - 完成标准：客户端可调用后端 API 获取 Plan 树数据并执行状态变更操作
  - 关键假设：后端 API 接口契约已确定且可访问

##### P3.1.3: 首页动态卡片布局与浏览
- parent: P3.1
- children: P3.1.3.1, P3.1.3.2, P3.1.3.3
- status: FRONTIER
- requirements:
  - 首页支持动态可配置的卡片布局，卡片样式通过后端 JSON 配置下发
  - 用户可在首页浏览不同布局样式的卡片内容
  - 新增卡片布局样式时，客户端无需发版即可渲染
  - 完成标准：首页可渲染至少三种不同布局的卡片，布局由后端配置驱动

###### P3.1.3.1: 动态布局架构方案选型
- parent: P3.1.3
- children: none
- status: READY
- requirements:
  - 决定"如何实现不发版即可渲染新卡片布局"的架构方向
  - 需评估的候选方向至少包括：服务端驱动 UI（SDUI）、WebView 混合渲染、动态代码加载等
  - 评估维度：灵活性、原生体验、实现复杂度、应用商店合规风险
  - 完成标准：选定一种架构方向，记录选型理由与取舍判断
  - 关键假设：应用商店政策对动态代码加载方案存在合规风险，需在选型中显式评估
  - 选型结论：**SDUI + WebView 降级兜底**——常规布局走原生 SDUI（JSON 描述原语组合，原生渲染），超出 DSL 表达力的卡片降级到 WebView 渲染；动态代码加载因合规风险排除

###### P3.1.3.2: 首页卡片布局 DSL 与后端配置协议
- parent: P3.1.3
- children: none
- status: FRONTIER
- requirements:
  - 基于选定的架构方向，定义后端下发的卡片布局协议（JSON schema）
  - 协议需描述卡片类型、布局参数、数据绑定关系
  - 完成标准：JSON schema 定义完成，可表达至少三种不同卡片布局的配置差异
  - 关键假设：P3.1.3.1 架构方案已选定，DSL 形式由架构方向决定

###### P3.1.3.3: 首页卡片渲染与热更新实现
- parent: P3.1.3
- children: none
- status: FRONTIER
- requirements:
  - 基于选定的架构方向和定义好的 DSL，实现客户端渲染引擎与热更新下发机制
  - 实现需覆盖：布局模板的下发、缓存、加载与渲染
  - 完成标准：后端新增第四种卡片布局配置后，客户端可在不更新 APK 的情况下正确渲染
  - 关键假设：P3.1.3.1 和 P3.1.3.2 已完成

##### P3.1.4: Plan 操作与状态管理
- parent: P3.1
- children: none
- status: FRONTIER
- requirements:
  - 实现 Plan 节点的状态变更与操作触发（如状态流转、调度触发等）
  - 操作结果可反馈给用户
  - 完成标准：用户可在 Android 端对 Plan 节点执行状态变更等基本操作
  - 关键假设：P3.1.2 和 P3.1.3 已完成

#### P3.2: 多平台扩展
- parent: P3
- children: none
- status: FRONTIER
- requirements:
  - 未来将客户端能力扩展至 iOS、Web 等其他平台
  - 当前仅占位，不展开拆解
  - 完成标准：至少一个额外平台有可运行客户端

## Ready Plans

- P1.2: 调度中心能力 - 通过 flowablex 建立，可作为执行入口
- P2.1: Plan 树 DSL Schema 设计 - YAML flat dict，内嵌 Vision.md，可立即执行
- P3.1.1: Android 项目骨架与架构确立 - 无后端依赖，可立即执行
- P3.1.3.1: 动态布局架构方案选型 - 选型结论已确定，可立即执行

## Blocked Plans

- P1.1: 注册中心能力 - Phase 1 已暂停，待外部决策恢复
- P2.2: Roadmap 接入契约定义 - 待 Roadmap 侧提供数据结构约束
- P3.1.2: Magii 后端 API 对接层 - 待后端 API 可用性确认

## Next Frontier

- P1.3: 自我学习能力 - 待 P1.2 完成后展开
- P1.4: 自我进化能力 - 待 P1.3 完成后展开
- P2.1: Plan 树 DSL Schema 设计 - 可立即展开，不依赖 P1
- P3.1.3.1: 动态布局架构方案选型 - READY，可立即执行
- P3.1.3.2: 首页卡片布局 DSL 与后端配置协议 - 待 P3.1.3.1 完成后展开，架构方向已确定可预研
- P3.1.3.3: 首页卡片渲染与热更新实现 - 待 P3.1.3.1 和 P3.1.3.2 完成后展开
- P3.1.4: Plan 操作与状态管理 - 待 P3.1.2 和 P3.1.3 完成后展开
