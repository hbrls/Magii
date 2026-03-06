# 代码结构

> updated_by: Claude-Sonnet-4-20250514
> updated_at: 2026-03-06 10:28:00

## 项目布局

```
magii/
├── .agents/                # Agent 命令定义
│   ├── commands/          # 命令定义
│   │   ├── steering/       # 公约命令
│   │   ├── plan/           # 计划命令
│   │   └── retrospective/ # 回顾命令
│   └── references/        # 命令模板
├── .clinerules/           # Cline 配置
├── .windsurf/             # Windsurf 配置
├── .kilocode/             # Kilocode 配置
├── .github/               # GitHub 集成
│   ├── instructions/      # 指令定义
│   └── prompts/           # 提示词
├── .steering/             # 公约文档 (输出)
├── AGENTS.md              # Agent 行为规范
└── README.md              # 项目说明
```

## 模块组织

### 目录命名规范

| 类型 | 约定 | 示例 |
|------|------|------|
| 配置文件 | `.` 前缀 + 工具名 | `.windsurf/`, `.clinerules/` |
| 命令目录 | 动词/名词 | `commands/`, `plan/` |
| 参考目录 | `references/` | `references/` |

### 文件命名规范

| 类型 | 约定 | 示例 |
|------|------|------|
| Markdown 文件 | kebab-case | `steering.md`, `product.md` |
| 命令定义 | `COMMAND.md` | `COMMAND.md` |
| 模板文件 | `template-*.md` | `template-tasks.md` |

## 命令结构

### 命令目录结构

每个命令包含：
- `COMMAND.md`: 命令定义
- `references/`: 参考模板目录

```
commands/
├── steering/
│   ├── COMMAND.md
│   └── references/
│       ├── product.md
│       ├── constitution.md
│       ├── structure.md
│       └── design.md
└── plan/
    ├── COMMAND.md
    └── references/
        ├── template-tasks.md
        └── template-design.md
```

## 配置结构

### IDE 配置文件

| 工具 | 配置目录 | 说明 |
|------|----------|------|
| Windsurf | `.windsurf/` | 工作流和规则 |
| Cursor | `.windsurf/` | 使用 Windsurf 配置 |
| CLAUDE | `.clinerules/` | 工作流和规则 |
| Cline | `.clinerules/` | 工作流和规则 |
| Kilocode | `.kilocode/` | 规则定义 |

### 配置类型

| 类型 | 文件 | 用途 |
|------|------|------|
| 工作流 | `workflows/*.md` | 定义工作流程 |
| 规则 | `rules/*.md` | 定义行为规则 |
| 提示词 | `.github/prompts/*.md` | AI 提示词 |
| 指令 | `.github/instructions/*.md` | 指令定义 |

## 文档规范

### Markdown 注释约定

- 使用注释 `<!-- // 给 AGENTS 的引导 -->` 作为仅供 Agent 阅读的补充引导
- Agent 必须阅读并在执行中使用，但不将该注释内容原样输出到产物中
- 使用单括号 `{占位并内容说明}` 表示模板占位符

### 元信息约定

在写入仓库的 Markdown 文件时：
- 在原标题开头插入元信息
- 使用中文输出

```markdown
# 原标题

> updated_by: {当前 Agent}
> updated_at: {当前时间 YYYY-MM-DD HH:MM:SS}
```

## 依赖管理

### 添加依赖

1. 检查现有依赖中是否有类似功能
2. 评估安全性
3. 检查维护状态
4. 在 PR 中记录原因

### 版本管理

- 生产环境锁定精确版本
- 开发环境允许 minor 更新
- 显式审查 major 更新

## Changelog

<!-- // 这是一个 Living Document，如无必要，无需维护变更历史。 -->
