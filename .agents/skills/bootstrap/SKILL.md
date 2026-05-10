---
name: bootstrap
description: 递归拆解 Plan，直到产出可执行的子 Plan
metadata:
 version: 0.4.1
---

# Bootstrap

## 背景与目标

这个 Skill 解决的核心问题：

> **当目标规模超过一次性建模能力时，如何通过递归拆解 Plan 稳定推进。**

Bootstrap 不是做方案设计，不是讨论实现细节，不是产出分析文档。它的唯一动作是：

> **把一个较大的 Plan 拆成若干个关键子 Plan。**

## 一句话定义

> **Bootstrap = 递归拆解 Plan，直到子 Plan 可执行。**

## 核心约束

1. **只拆 Plan，不进细节**：每一轮只回答一个问题——"当前这个 Plan 由哪些关键子 Plan 组成？"
2. **拆解粒度停在里程碑层**：子 Plan 应表达关键里程碑 / 关键工作包 / 关键子目标，不进入实现步骤
3. **细节即停机信号**：如果 Agent 发现自己正在讨论接口、表结构、目录、代码、流程步骤，必须立即停止，回到上一层重新以 Plan 级节点表达
4. **Plan 套 Plan**：每个节点本身就是一个 Plan，子 Plan 共同构成父 Plan
5. **Vision.md 是唯一核心产物**：Room.md 是 Episode 内临时空间，To-Clarify.md 和 Log.md 只服务于 Plan 树推进
6. **Vision 与 P0 必须同义**：`Vision` 是 root goal 的自然语言表达，`P0` 是同一个 root goal 的结构化表达；二者必须语义对齐，不能一个写完整愿景、一个写局部范围
7. **路线图独立于排期**：Bootstrap 负责按产品逻辑拆出路线图，不负责按资源、时间、人手做排期；资源变化只影响推进速度，不改写 Plan 树结构

## Plan 树结构

核心关系是父子递归：

```text
P0
├── P1
│ ├── P1.1
│ ├── P1.2
│ └── P1.3
├── P2
│ ├── P2.1
│ └── P2.2
└── P3
```

每个节点都是一个 Plan，子 Plan 共同构成父 Plan。同层节点应在同一抽象层级。

### Vision 与 P0 对齐规则

- `Vision` 与 `P0` 描述的是**同一个 root goal**，只是表达形式不同：前者偏自然语言，后者偏结构化
- `P0.name` 应直接对应 `Vision` 的 root goal，允许措辞压缩，但**不允许语义缩窄**
- 不允许把 `Focus` 之外的短期业务切片词直接写进 `P0.name`
- 如果业务方只讨论"当前 Focus 先做什么"，应将其解释为 **Plan 树子集的选择**，而不是修改 root goal

### 路线图与排期的分工

- Bootstrap 的职责是设计**路线图逻辑**：什么能力由什么子能力构成，依赖如何闭合，应该先拆哪里
- 排期系统的职责是决定**什么时候做、投入多少资源、并行多少项**
- 同一棵 Plan 树在不同资源条件下可以有不同推进速度，但**树本身不应变化**
- 只有当产品目标、范围边界或关键假设变化时，Plan 树才应被回流修订；仅资源变化不构成改树理由

### Focus 机制

- `Focus` 表示**在一段连续时期内优先表达、优先推进、优先落边界的关注点 / 切片**，而不是每个 Episode 重新指定的临时变量
- `Vision`、`P0`、Plan Tree 负责承载未来 **1-3 年** 的路线图；`Focus` 负责表达眼前 **1-3 个月** 的现实注意力窗口
- 项目初期可以**没有 `Focus`**；Bootstrap 先做完整路线图设计
- `Focus` 由外部流程在某一轮**显式引入**，一旦引入，就会持续生效，直到外部流程**显式解除**
- `Focus` 不改写 `Vision`，不改写 `P0`，也不替代 Plan Tree；它只决定**当前阶段先深看哪里**
- `Focus` 可以来自题型、用户群、场景、流程阶段、风险热点、业务切片等任一当前真正影响拆解决策的维度
- Bootstrap 必须始终维持**全局设计**：保证完整路线图与主路径结构不失真
- 当存在 `Focus` 时，Bootstrap 还必须做 **Focus 驱动的局部深思考**：对 Focus 强相关节点做更深的拆解与边界判断
- 对 **Focus 相关** 节点使用深度思考：判断是否必须继续拆解，才能让 Focus 边界落在具体子 Plan 上
- 对 **非 Focus 相关** 节点使用广度思考：只做全局完整性、依赖关系、边界一致性的检查，不在当前阶段无节制下钻
- `Focus` 的引入、延续、解除由外部流程控制；Bootstrap 只识别并遵守当前 Focus 内容，不私自发明、切换或解除 Focus
- `Focus` 解决的问题是：在完整路线图不变的前提下，当前哪些 Plan 应该先拆，哪些子 Plan 应该先进入后续设计 / 执行准备

## Plan ID 规则

采用层级路径式编号：

```text
P0 ← root
P1 ← 一级
P2
P2.1 ← 二级
P2.2
P2.1.1 ← 三级
P2.1.2
```

- 一眼可看出父子关系
- 引用成本低，文档中直接用 ID 定位

## 节点模型

Plan 树中的每个节点应具备以下字段：

```markdown
### [P2.1] 节点名称
- **parent**: P2
- **children**: P2.1.1, P2.1.2, P2.1.3
- **status**: FRONTIER | READY | BLOCKED | DONE
- **blocker**: [仅 `BLOCKED` 时填写]
 - [当前无法继续拆解或推进的原因]
- **requirements**:
 - [该 Plan 要完成什么]
 - [完成标准]
 - [关键假设]
```

字段说明：

- `parent` 和 `children` 表达 Plan 的递归组成关系
- `requirements` 是数组，合并了目标、完成标准、假设，每个条目为一个需求陈述
- `blocker` 仅在节点处于 `BLOCKED` 时填写
- 不包含 owner / estimate / validation / deliverable 细节等执行层字段
- 执行层信息不属于 Bootstrap 阶段，属于后续执行阶段

字段不要求一开始 100% 完整，但 `children`、`requirements` 每个节点必须有。

## 节点状态

- **FRONTIER**：需要继续拆解，是下一轮展开的候选
- **READY**：Bootstrap 断言此节点可直接进入执行（须通过 READY 自检清单）
- **BLOCKED**：缺少外部输入，无法继续拆解，等待澄清
- **DONE**：已执行完成（由外部执行系统标记；Bootstrap 仅在回流时把它改回其他状态）

Bootstrap 不维护完整状态机，状态流转由外部执行系统管理。Bootstrap 只关心节点**当前需要做什么**：继续拆 / 可执行 / 等输入 / 已完成。

READY 不是结果，是 Bootstrap 单方面发起的断言。Bootstrap 与执行阶段之间存在排产/资源延迟，无法靠"立刻执行验证"来校准 READY。因此 READY 必须由 Bootstrap **内部自检**保证质量，详见下文 READY 自检清单。

## 停机规则

以下信号出现时，Agent 必须停止当前节点继续下钻：

1. **进入实现细节**：讨论接口设计、数据表、类结构、目录结构、命令步骤 → 停止
2. **子项变成动作列表**：子节点从"关键子 Plan"滑向"操作步骤" → 停止
3. **无法再以 Plan 级拆解**：某个节点只能进入实现层才能继续 → 标记为 READY 或 BLOCKED，不在该节点继续拆

标记规则：

- 该 Plan 已足够作为后续执行入口 → 用 READY 自检清单逐项验证；通过 → READY
- 还缺外部输入才能判断 → BLOCKED
- 自检任一项未通过 → 不标 READY，按对应失败动作处理

不允许为了"看起来完整"继续往实现层硬拆。

## READY 自检清单

停机规则告诉 Bootstrap **何时停止下钻**；READY 自检清单告诉 Bootstrap **停止后该节点是否真的可执行**。两件事不一样：一个节点可能"无法继续拆解"但仍**不该被标 READY**——它可能是 BLOCKED，也可能是粒度错。

Bootstrap 必须独立工作，不能依赖执行端反馈来校准 READY。因此每次准备把节点标 READY 之前，必须**逐项**通过以下四项内部自检：

### 1. 第一步可命名（First Move Test）

> 这个节点的"第一个具体动作"是什么？能用一句 Plan 级语言写出来。

- ✅ "开始定义题目数据模型"
- ❌ "用 Prisma 定义 question 表，字段 id/content/type"（已进入实现层）

写不出第一步 → 粒度错，需重拆。

### 2. 完成标准独立可验

> 完成标准能不能**不查阅其他节点**就判断"做完没"？

- ✅ "题目可被创建、读取、编辑、删除"（自验）
- ❌ "和 P2 的组卷接口可对接"（依赖未结的兄弟节点）

依赖兄弟节点的完成标准 → 这不是 READY，是隐性 BLOCKED 或边界没切干净。

### 3. 依赖闭合

> 所有 upstream 依赖必须满足之一：已 DONE / 显式声明无依赖。

存在 "等 PX 完成才能开始" 但 PX 仍在 FRONTIER 或 READY → **不是 READY**，是排队等 upstream。不必新增 `depends_on` 字段，靠 requirements 文字承载即可，但必须在自检时显式回答这个问题。

### 4. 单句目标

> 节点的 goal 能不能压成**一句话**，不用并列从句？

需要"...，并且..." → 这个节点藏着两件事，应该再拆一层。

### 自检失败的对应动作

| 失败项 | 处理 |
|---|---|
| #1 第一步说不出 | 重拆，回到 FRONTIER |
| #2 完成标准不独立 | 修完成标准或上提依赖到父级 |
| #3 依赖未闭合 | 不标 READY，等 upstream 推进 |
| #4 目标含并列 | 拆成两个兄弟节点 |

任一不通过 → **不能标 READY**。

### 自检与回流的分工

- **自检**：避免 Bootstrap 阶段就该发现的错（拆解粒度、边界切割、依赖关系）
- **回流**：修补只有执行阶段才能暴露的错（设计假设错误、新风险）

自检不能消除回流，但能显著降低**早期可避免**的回流频率。

## 执行回流

Bootstrap 拆出 READY 节点后会被外部执行系统取走执行，执行完成的节点变为 DONE。最理想路径是 Plan 树深度优先一路推到 root 完成。但执行过程中可能反向触发 Bootstrap 重新介入——这就是**回流**。

### 回流触发的三类信号

1. **设计错误（A）**：执行中发现 Plan 本身的 requirements / 边界 / 假设是错的。错误源头**不一定是当前执行节点**，可能是几层之上已 DONE 的节点
2. **新 blocker / 新风险（B）**：执行中识别到原 Plan 树未覆盖的阻塞或风险。不一定是错，但需要补充节点或重新评估现有节点
3. **新需求 / 范围切片（C）**：一线带来新的范围决策、客户输入、产品决策。常见形态是引入一个**正交维度**（题型、学科、客户群、区域、批改方式、输入形式…），或要求引入 / 调整一个新的 `Focus`。**原拆分通常并未错**，只是粒度不够细以表达新维度

A 与 C 的常见误判：C 类反馈看起来像 A（"原 Plan 不能覆盖新需求"），但**原 Plan 没错**，只是当时不需要拆到这么细。把 C 误判为 A，会导致**重写 P0 / 删节点**这种过度反应，丢失原愿景的拆解信息。判定方法：

> 这条反馈是说"原拆分**搞错了**"，还是说"原拆分**还不够细**"？
> 后者是 C 类。

### 回流处理流程

1. **识别触发类型与维度**：
 - 这条反馈属于 A / B / C 哪类？
 - 如果是 C：它引入了什么**新维度**（题型 / 学科 / 阶段…）？这个维度该挂在 Plan 树的**哪一层**？
 - 如果反馈要求引入、调整或解除 `Focus`：它对应**哪些 Plan 节点的子集**？
2. **定位源头节点**：先回答"哪个 Plan 是源头"，而不是"哪个 Plan 在执行"。源头可能是当前执行节点的祖先、兄弟，甚至已 DONE 的节点
3. **划定影响范围**：Agent 自动标记受牵连节点，判定依据：
 - **下游依赖**：依赖源头节点产出的节点
 - **共享假设**：与源头共享同一个被推翻假设的兄弟节点
 - **共享 blocker**：与新 blocker 直接相关的节点
 - 只圈受影响子集，不传染整棵树
4. **在本 Episode 唯一 LENS 的视角下判断**：哪些边界、假设、requirements 或拆分方式需要修订
5. **状态重置**：受影响节点根据需要重新置为：
 - 需要重新拆解 → FRONTIER
 - 拆解仍成立，只需重新执行 → READY
 - 缺外部输入 → BLOCKED
6. **修订动作**：按下方"默认动作优先级"选择最小动作
7. **Log.md 强制记录回流轮次**：必须先写本 Episode LENS 的 Lens Note，再写回流轮次小结，留下源头与影响范围的痕迹

### 默认动作优先级（修订时按 1 → 4 顺序选择）

按"改动最小、保留原信息最多"原则排序。**只有当低优先级动作无法解决时，才升级到高优先级动作**。

| 优先级 | 动作 | 适用 | 信息保留 |
|---|---|---|---|
| 1 | **深拆现有节点**（按新维度引入子层） | C 类反馈：原拆分粒度不够细 | 原节点保留，子节点扩展表达 |
| 2 | **修 requirements** | A / B / C：约束变化但拆分维度不变 | 原节点保留，文字调整 |
| 3 | **新增兄弟节点** | B：原树漏掉的并列子项；C：原树未覆盖的并列维度 | 原节点保留，树扩展 |
| 4 | **重拆 / 删节点 / 改 P0** | **仅当**原拆分确实错了（A 类设计错误） | 原信息可能丢失 |

**关键警示**：

- C 类回流的默认动作是 **优先级 1（深拆）**，不是 4（重写 P0）
- 把 C 误判为 A 然后做优先级 4，会丢失完整愿景的拆解信息
- "新需求引入了我们之前没考虑的范围限制" → 几乎一定是 C，应该深拆
- "新需求和原 Plan 的某个具体设计直接冲突" → 才可能是 A

### 业务范围切片的映射规则

一线带来的短期业务切片，统一收敛为 **`Focus`**。处理规则：

1. **不引入** Plan 之外的术语，保持"Plan 套 Plan"
2. `Focus` 的语义是**范围切片**——它对应 Plan 树的某个**子集**，不对应某个 Plan 节点
3. `Focus` 表达的是当前阶段的现实注意力窗口，不是路线图结构本身；它不能决定 root goal，也不能决定 Plan 树的主拆分逻辑
4. 实现方式：
 - 如果原 Plan 树已经够细，能直接圈出对应子集 → 在 `Focus` 区域明确"哪些节点属于当前 Focus"
 - 如果原 Plan 树不够细，无法圈出干净的子集 → **深拆相关节点**（优先级 1），让切片边界落在具体子节点上
5. 切片之外的节点：保留在树中，status 维持 FRONTIER（只是当前不展开），不删除

**反模式**：把短期切片直接塞进 P0 的 name，缩窄整棵树以匹配当前 Focus。这等于把 Focus 当成 Plan 节点用，违反"Plan 套 Plan"约束，且丢失完整愿景。

### 回流操作约束

- 不引入新状态字段（如 DIRTY），仅重置 status
- 不引入 Plan 之外的术语（Phase / Milestone / Iteration 等），范围切片靠 Plan 树子集表达
- 在受影响节点的 requirements 追加一行修订原因，便于后续审计
- 同一节点回流 ≥ 2 次 → 父节点 requirements 不清，上提一层重新审视，不要在原节点反复打补丁
- DONE 节点被改回其他状态后，其原有产物的去留由外部执行系统决定，Bootstrap 不管理

## 适用场景

适合使用本 Skill 的情况：

- 目标明确、可行、可拆解，但规模过大无法一次建模
- 需要拆解出关键里程碑和子目标，而非设计实现方案
- 变量较多，需要逐轮校正拆分方向

不适合直接使用本 Skill 的情况：

- 目标本身尚未成立，root goal 不清晰
- 任务非常小，一次性列出 Todo 即可
- 核心障碍不是拆解，而是权限、预算、组织决策
- 需要的是方案设计而非计划拆解

## 执行原则

- **先有骨架，再逐步生长**：先产出最小结构，不追求一开始完整
- **只展开当前最重要的 frontier**：优先处理高价值、高风险、高不确定节点
- **拆 Plan 而非做方案**：每一轮只做拆解，不进入设计或实现
- **路线图先于 Focus**：先把产品逻辑上的 Plan 树拆出来，再由外部流程决定何时引入 Focus、当前 Focus 覆盖哪些节点
- **假设显式化**：信息不足时允许暂定，但必须记录假设
- **结构持续重构**：允许合并、上提、调整层级，不把早期结构神圣化
- **每轮都要有产物**：至少产出更新后的 Plan 树、ready 节点或明确 blocker

## 分形展开规则

为避免 Plan 树失控，拆分时遵守以下规则：

- 同一层尽量按**同一种主要维度**拆分
- 单个父节点默认拆成 3 到 7 个子节点，避免过宽
- 先拆主路径，再拆支线，避免"满树开花"
- 共享依赖尽量上提，避免在多个分支重复维护
- 同层节点颗粒度尽量接近，避免大小混杂
- 如果结构变形严重，允许整体重组，不必保留旧树形

常见拆分维度：

- 功能维度
- 优先级维度
- 依赖维度
- 风险维度
- 用户旅程 / 生命周期维度

## 输入契约

执行本 Skill 时，尽量先收集以下输入：

- root goal：最终要达成的目标
- success criteria：什么算完成
- constraints：时间、资源、技术、范围、组织边界
- known facts：已知事实、已有资产、现有结构
- unknowns：目前不确定但可能影响拆分的事项
- round lens：本 Episode 由外部流程指定且仅指定 1 个 Lens；这是本轮必需输入
- `Focus`：若有，直接给出 Focus 内容；若无，可留空。写入 `Vision.md` 时，`## Focus` 下只写 `- 无`

其中关于 `root goal` 的硬要求：

- `Vision` 必须表达完整目标，而不是某个短期 Focus
- `P0` 必须与 `Vision` 保持同义，不得缩成当前 Focus 对应的短期子集
- 如果外部只给了"当前 Focus 先做什么"，Bootstrap 也应先还原完整 root goal，再把该 Focus 映射为树上的子集

其中关于 `Focus` 的硬要求：

- `Focus` 是一个可选的、简单直接的输入项，不需要额外状态字段
- 有 `Focus` 就直接写清楚内容；没有 `Focus` 就不写内容，并在 `Vision.md` 的 `Focus` 章节用 `- 无` 占位
- 项目初期可以没有 Focus
- 一旦外部流程引入 Focus，它会在后续 Episode 中持续沿用，直到被外部流程明确解除
- `Focus` 只决定当前阶段**优先深入点**，不改写 `Vision` / `P0`，也不替代 Plan Tree
- `Focus` 可以来自题型、用户群、场景、流程阶段、风险热点、业务切片等任一当前真正影响拆解决策的维度
- `Focus` 的写法可以是一条或多条事项，但这些事项必须共同服务于同一个当前 Focus，不能混入多个彼此独立的 Focus
- 如果外部给出的信息是"只实现数学问答题"，Bootstrap 应将其直接记录为 `Focus`，而不是改写 `Vision` / `P0`

如果输入不完整：

- 允许继续推进
- `round lens` 不属于可缺省项；若缺失或指定了多个 Lens，则不能开始本轮拆解
- `Focus` 在项目初期允许为空
- 但若已经有 `Focus`，而当前 Focus 的内容或边界不清，则不能开始本轮 Focus 驱动的深拆；必须先澄清
- 但必须显式记录缺失项到 To-Clarify.md
- 同时给出一个**带假设的初始 Plan 树**，不能只停留在提问

## Run（Room + Episode 序列 + Commit）

Bootstrap 不定义具体思考视角，也不内置当前应优先深入的业务切片。每次 **Run** 由外部流程驱动，包含三个阶段：**Room 创建** → **多个 Episode** → **Commit 收口**。

`Focus` 是否存在、内容是什么，由外部流程决定，并在后续 Episode 中持续沿用，直到被明确解除。

### Run、Episode 与 Commit 的定义

- **Run**（过程）：一次 Room 创建 → 多个 Episode → Commit 收口 的完整工作周期；结构为「Lens A 思考 → Lens B 思考 → … → Commit」，由外部流程控制
- **Episode**：一个 Lens 的思考，一个 Episode 有且只有一个 Lens
- **Commit**：Run 尾部的收口步骤，不是 Episode；包含 Verify / Evaluate / Commit 三阶段（见下方 Commit 章节）

例如：

```text
[外部] 创建 Room.md，设定 Topic：拆解当前 Focus 下的题目展示能力
[外部] 指定 Lens A → Episode 1
[外部] 指定 Lens B → Episode 2
[外部] 触发 Commit → 本次 Run 结束
```

### 一次 Run 的完整流程

1. **外部控制 Topic，新建 Room.md，设定 Topic**
2. **外部控制 Episode**：每次指定一个 Lens 构成一个 Episode，可多个 Episode 陆续进行
3. **外部控制 Commit**——Verify → Evaluate → Commit，Room 归档后销毁

Room 的生命周期绑定 Run：Run 开始时创建，Commit 后销毁，不留残留。

### Room 机制

- `Room.md` 是每个过程的临时工作空间，存放在 `.context/Room.md`
- Room 由**外部流程**创建，包含本过程的 Topic
- Room 的作用：1）留痕每个 Episode 的思考过程；2）为后续 Episode 的 Lens 提供 Context
- Room 的生命周期：创建 → 多个 Episode 写入 → Commit 归档到 Log → 删除

### 单个 Episode 的工作过程

每个 Episode 有且只有一个 Lens，工作过程：

1. **读取 Vision**——这是核心输入，必须首先读取
2. **如果 Vision 有 Focus，读取 Focus**——这是核心输入，必须在 Vision 之后、严格保持先后顺序
3. 读取 Room 的 Topic，以及 Room 的**全部**内容
4. Lens 思考
5. 思考过程写入 Room（留痕 + 为后续 Episode 的 Lens 提供 Context）；产物**可以直接写入** Vision

### Commit

- **Commit 不是 Episode 的一部分，是每次 Run 尾部的收口步骤**
- 外部流程认为本次 Run 可以收口时，发起 Commit，分三阶段顺序执行：

#### Verify

检查本次 Run 是否存在偏离：

- 是否偏离 Bootstrap/SKILL.md 的过程规范（如： Episode 内出现多 Lens、滑入实现细节、READY 未经自检）
- 是否偏离 Vision.md 的方向（P0 / Vision 是否仍然一致，拆解是否向 root goal 收敛）
- 是否偏离当前 Focus（若有 Focus，本次 Run 的拆解重点是否与 Focus 对齐）

发现偏离 → 标记偏离点，决定是追加 Episode 补救，还是带记录直接进入下一阶段。

#### Evaluate

评估本次 Run 是否已经完备：

- 本次 Run 的 Topic 是否已被充分思考？
- 是否还有遗漏的 frontier 节点、未覆盖的风险、未记录的假设？
- 继续追加 Episode 是否仍有实质收益？

若评估为「仍可继续」→ 外部流程可追加 Episode；若「已完备」→ 进入下一阶段。

#### Commit

- 确认 Room 中的思考结果已写入 Vision.md；若有遗漏，补充写入
- 将 Room 关键总结写入 Log.md（Lens Note + Round Summary）
- 删除 Room.md

### 基本原则

1. **一个 Episode 有且只有一个 Lens**
 - 每个 Lens 的思考构成一个独立 Episode
 - Bootstrap 不处理同一个 Episode 内多个 Lens 的并行、串行、仲裁或融合
2. **Lens 选择完全外置**
 - 由外部流程指定本 Episode 使用哪个 Lens
 - Bootstrap 不负责选择、推荐、切换或解释具体 Lens
3. **Run 由外部流程控制**
 - 外部流程决定何时创建 Room（开始一次 Run）、何时指定哪个 Lens、何时发起 Commit（结束 Run）
 - Episode 数量由外部流程控制
4. **Focus 可以没有，也可以持续存在**
 - 项目初期允许没有 Focus
 - 一旦外部流程引入 Focus，它会在后续 Episode 中持续沿用，直到被外部流程明确解除
5. **Focus 的引入与解除完全外置**
 - Focus 何时出现、何时解除均由外部流程控制
 - Bootstrap 不负责私自生成、替换或关闭 Focus，只负责按当前 Focus 推进拆解
6. **Bootstrap、Lens、Focus 与 Room 在同一 Episode 中共同生效**
 - Bootstrap 提供拆解规则、停机规则、状态语义与产物格式
 - Lens 提供本 Episode 的思考视角、判断偏好与审视重点
 - 若当前有 Focus，则由它提供当前阶段优先深入点
 - Room 提供过程内的临时工作空间与 Episode 间 Context 传递
 - Commit 负责过程收口：确保 Vision 已更新、Room 已归档
7. **Lens 改变"怎么看"，Focus 改变"当前阶段哪里需要深看"，Room 提供思考留痕，都不改变"产出什么"**
 - Lens 的作用是帮助本 Episode 拆分更合理、更稳健、更符合当前视角
 - 当前有 Focus 时，它的作用是帮助本 Episode 判断哪些节点该深拆、哪些节点只做广度校准
 - Room 的作用是留痕和传递 Context，不是 Episode 产出的唯一出口
 - 本 Episode 核心产物仍然只有 Bootstrap 定义的 Plan 拆分产物：
 - `Vision.md` 中的 Plan Tree 更新
 - `To-Clarify.md` 中的 blocker 更新
 - `Log.md` 中的记录（由 Commit 写入）
 - 不因 Lens、Focus 或 Room 引入新的核心产物类型

### Lens 与 Focus在本 Episode 中的职责

参与本 Episode 思考的 Agent 必须先判断当前是否有 `Focus`：

- 若**没有 Focus**：只做全局设计，按常规 frontier 推进拆解
- 若**有 Focus**：同时完成**全局设计**与**Focus 驱动的局部深思考**

在此基础上，帮助回答以下问题：

- 当前最值得展开的是哪个 frontier 节点；若有 Focus，尤其要看哪些节点与 Focus 强相关
- 当前节点的边界是否切得合理
- 当前 requirements 是否清晰、独立、可成立
- 当前节点应继续拆解，还是应标记为 `READY` / `BLOCKED`
- 当前拆分是否遗漏了关键子 Plan、关键风险、关键假设或关键范围边界
- Focus 是否已经在 Plan 树上落到了足够具体的节点边界；如果没有，应该在哪一层继续深拆
- 哪些非 Focus 节点虽然当前阶段不深拆，但仍需做广度检查，以防全局结构失真

具体执行要求：

- 只拆 Plan，不进入实现细节
- 子节点保持在关键子 Plan / 里程碑层
- 触发停机规则时立即停止下钻
- 标记 `READY` 前必须通过 READY 自检清单
- 思考过程写入 Room，产物可直接写入 Vision
- 所有结果仍按 Bootstrap 的输出契约写入文档

### 设计意图

这样设计的目的不是让 Bootstrap 持有多个固定角色，而是把"拆解协议"与"思考视角"解耦：

- Bootstrap 负责稳定的 Plan 拆解机制
- Lens 负责可替换的思考视角，一个 Episode 一 Lens
- Focus 负责在一段连续时期内约束当前优先深入点
- Room 负责过程内的思考留痕与 Episode 间 Context 传递
- Commit 负责过程收口，确保 Vision 更新、Room 归档
- 外部流程负责决定每个 Episode 采用哪个 Lens、何时创建 Room、何时发起 Commit；外部流程负责决定 Focus 何时引入与解除

因此，Bootstrap 可以在不内置具体角色的前提下，支持不同参与者以不同视角参与同一套 Plan 拆解过程，同时保持产物结构稳定不变。

## 输出契约

每个 Episode 执行本 Skill，至少输出以下内容：

- 当前 Focus（Vision.md；若有则逐条写，若无则写 `- 无`）
- 更新后的 Plan 树（Vision.md）
- 当前 READY 状态的可执行子 Plan
- 当前 blocker（To-Clarify.md）
- 本 Episode Lens 的思考过程留痕（Room.md）
- 过程的 Lens Note 与 Round Summary（Log.md，由 Commit 写入）
- 下一 Episode 应继续展开的 frontier

## 标准执行流程

### 0. 初始化

1. **从 Vision.md 的 Vision 部分获取 root goal**
2. **用该 root goal 生成与 Vision 同义的 P0**（不得把短期 Focus 直接写成 root）
3. **读取当前 Focus**：若有 Focus，载入其内容与边界；若无，则在 `Vision.md` 的 `Focus` 章节写 `- 无`
4. **创建文档结构**：
 - `Vision.md`：核心产物，递归 Plan 树
 - `To-Clarify.md`：阻塞 Plan 拆解的外部问题
 - `Log.md`：结构变化记录 + Lens Note + Round Summary

### 1. 创建 Room（外部控制，过程开始）

1. **外部流程创建 Room.md**，设定本过程 Topic
2. Room.md 存放在 `.context/Room.md`

### 2. Episode （外部控制，一 Episode 一个 Lens）

外部流程指定一个 Lens，构成一个 Episode ：

1. **读取 Vision**——核心输入，必须首先读取
2. **如果 Vision 有 Focus，读取 Focus**——核心输入，必须在 Vision 之后、严格保持先后顺序
3. **读取 Room 的 Topic 及全部内容**——包括前序 Episode 的思考留痕
4. **选择本 Episode 展开对象**：在该 Lens 视角下选择 1-3 个 frontier 节点深入拆解，优先级：
 - 若当前有 Focus：与当前 Focus 强相关、且其边界尚未在树上落稳的节点
 - 会阻塞主路径的节点
 - 高价值但高不确定的节点
 - 高风险节点
 - 依赖复杂、容易产生返工的节点
5. **拆解 Plan**：
 - 回答：**"这个 Plan 由哪些关键子 Plan 组成？"**
 - 填写 children：列出子 Plan ID
 - 为每个子 Plan 填写 requirements
 - 用该 Lens 的视角检查当前拆分是否遗漏关键子 Plan、关键风险、关键假设或关键范围边界
 - 若当前有 Focus，用当前 Focus 判断：该节点是否需要继续深拆，才能让 Focus 边界落在具体子 Plan 上
 - 若当前有 Focus：对 Focus 相关节点使用深度思考；对非 Focus 相关节点只做广度校准
 - 检查是否触犯停机规则——如果正在进入细节，停止并标记节点状态
 - 准备标 READY 的节点逐项跑 **READY 自检清单（4 项）**；失败按对应动作处理，不标 `READY`
6. **写入 Room**：思考过程写入 Room.md（留痕 + 为后续 Episode 提供 Context）
7. **写入 Vision**：产物可直接写入 Vision.md
8. **更新 To-Clarify.md**：新 blocker、已解决问题

外部流程可继续指定下一个 Lens，进入下一 Episode（回到步骤 1）。

### 3. Commit（外部控制，Run 收口）

外部流程认为本次 Run 可以收口时，发起 Commit，依序执行三阶段：

1. **Verify**：检查本次 Run 是否偏离 SKILL.md 过程规范、Vision 方向或当前 Focus；发现偏离则标记，决定追加 Episode 补救或带记录 Commit
2. **Evaluate**：评估本次 Run 是否已完备（Topic 是否充分思考、是否有遗漏）；若仍有收益可追加 Episode；若完备，继续
3. **Commit**：确认 Room 思考结果已写入 Vision.md（若有遗漏补充写入）；将 Room 关键总结写入 Log.md；删除 Room.md

### 4. 回流 Episode（执行反馈触发）

不同于按 frontier 顺序推进的常规 Episode，回流 Episode 由外部执行阶段反馈触发，但仍遵循 Room + Episode + Commit 流程：

1. **外部创建 Room**，设定 Topic 为回流事项
2. **外部指定 Lens**，构成回流 Episode
3. **接收触发信号**：执行阶段或一线反馈带来的输入
4. **识别类型与维度**：
 - 这条反馈属于 A / B / C 哪类？
 - 如果是 C：它引入了什么**新维度**（题型 / 学科 / 阶段…）？这个维度该挂在 Plan 树的**哪一层**？
 - 如果反馈要求引入、调整或解除 `Focus`：它对应**哪些 Plan 节点的子集**？
5. **定位源头节点**：从触发信号回溯到错误或风险产生的 Plan
6. **划定影响范围**：Agent 自动标记受牵连节点，判定依据：
 - **下游依赖**：依赖源头节点产出的节点
 - **共享假设**：与源头共享同一个被推翻假设的兄弟节点
 - **共享 blocker**：与新 blocker 直接相关的节点
 - 只圈受影响子集，不传染整棵树
7. **在 Lens 视角下判断**：哪些边界、假设、requirements 或拆分方式需要修订
8. **状态重置**：受影响节点根据需要重新置为：
 - 需要重新拆解 → FRONTIER
 - 拆解仍成立，只需重新执行 → READY
 - 缺外部输入 → BLOCKED
9. **修订动作**：按"默认动作优先级"选择最小动作
10. **写入 Room + Vision**
11. **外部发起 Commit**：归档 Room 写入 Log.md，删除 Room.md

### 5. 判断是否收敛

出现以下任一情况即可暂停：

- 主路径上已出现一批 READY 子 Plan
- 剩余不确定性不会阻碍当前开工
- 继续拆分的收益低于直接执行
- 进入需要外部输入的 blocker

如果未满足，则外部流程可发起新的过程。

## 实际执行流程

### 准备阶段

1. **从 Vision.md 的 Vision 部分获取 root goal**
2. **用该 root goal 生成与 Vision 同义的 P0**（不得把短期 Focus 直接写成 root）
3. **读取当前 Focus**：若有 Focus，载入其内容与边界；若无，则在 `Vision.md` 的 `Focus` 章节写 `- 无`
4. **创建文档结构**：
 - `Vision.md`：核心产物，递归 Plan 树
 - `To-Clarify.md`：阻塞 Plan 拆解的外部问题
 - `Log.md`：结构变化记录 + Lens Note + Round Summary

### 过程 1: 初始化

1. **外部创建 Room.md**，设定 Topic
2. **外部指定 Lens → Episode 1**：
 - 读取 Vision → 读取 Focus → 读取 Room 全部内容
 - 以该 Lens 视角审视 root goal、当前 Focus 与一级拆分方向
 - 拆出一级骨架：为 P0 添加 3-7 个子 Plan
 - 将当前 Focus 写入 Vision.md；若没有 Focus，则在 `Focus` 章节写 `- 无`
 - 识别 blocker 写入 To-Clarify.md
 - 思考过程写入 Room，产物直接写入 Vision.md
3. **外部可指定更多 Lens → 后续 Episode **：按相同流程接力
4. **外部触发 Commit**（Verify → Evaluate → Commit，见 Commit 章节）

### 过程 2+: 继续拆解 frontier

1. **外部创建 Room.md**，设定 Topic
2. **外部指定 Lens → Episode **：
 - 读取 Vision → 读取 Focus → 读取 Room 全部内容
 - 判断当前阶段哪些节点需要深拆、哪些节点只做广度校准
 - 以该 Lens 视角选择 1-3 个 frontier 节点
 - 拆解：为每个 frontier 节点填写 children
 - 检查当前拆分是否遗漏关键子 Plan、关键风险、关键假设或关键范围边界
 - 若有 Focus：检查 Focus 是否已经在树上落到足够具体的节点；若没有，继续在相关分支下钻
 - 检查停机规则：是否滑入细节
 - 跑 READY 自检：准备标 READY 的节点逐项验证，失败按对应动作处理
 - 思考过程写入 Room，产物直接写入 Vision.md
 - 更新 To-Clarify.md
3. **外部可指定更多 Lens → 后续 Episode **：按相同流程接力
4. **外部触发 Commit**（Verify → Evaluate → Commit，见 Commit 章节）
5. **判断收敛**：是否可以暂停

### 回流过程: 处理执行反馈

由外部执行阶段触发，不按 frontier 顺序，但遵循 Room + Episode + Commit 流程：

1. **外部创建 Room.md**，设定 Topic 为回流事项
2. **外部指定 Lens → 回流 Episode **：
 - 读取 Vision → 读取 Focus → 读取 Room 全部内容
 - 接收触发信号：执行阶段或一线反馈带来的输入
 - 识别类型与维度：
 - 这条反馈属于 A / B / C 哪类？
 - 如果是 C：它引入了什么**新维度**（题型 / 学科 / 阶段…）？这个维度该挂在 Plan 树的**哪一层**？
 - 如果反馈要求引入、调整或解除 `Focus`：它对应**哪些 Plan 节点的子集**？
 - 定位源头节点：从触发信号回溯到错误或风险产生的 Plan
 - 划定影响范围：Agent 自动标记受牵连节点，判定依据：
 - **下游依赖**：依赖源头节点产出的节点
 - **共享假设**：与源头共享同一个被推翻假设的兄弟节点
 - **共享 blocker**：与新 blocker 直接相关的节点
 - 只圈受影响子集，不传染整棵树
 - 在 Lens 视角下判断：哪些边界、假设、requirements 或拆分方式需要修订
 - 状态重置：受影响节点根据需要重新置为：
 - 需要重新拆解 → FRONTIER
 - 拆解仍成立，只需重新执行 → READY
 - 缺外部输入 → BLOCKED
 - 修订动作：按"默认动作优先级"选择最小动作
 - 写入 Room + Vision
3. **外部触发 Commit**（Verify → Evaluate → Commit）：强制在 Log.md 中记录回流 Episode，留下源头与影响范围的痕迹，删除 Room.md

## 文档输出格式

**Vision.md**（核心产物：递归 Plan 树）：

```markdown
# Vision

## Vision
[Root Goal 的清晰陈述]

## Root Plan
- id: P0
- name: [与 Vision 同义的 root goal，不能写成当前 Focus 的短期切片]
- children: P1, P2, P3
- status: FRONTIER
- requirements:
 - [对完整 root goal 的简洁要求陈述]

## Focus
[有 Focus 时，逐条写当前 Focus；无 Focus 时，只写 `- 无`]
- [当前 Focus 事项 1]
- [当前 Focus 事项 2]
- [当前 Focus 的边界 / 约束]

## Plan Tree

### P1: [Plan 名称]
- parent: P0
- children: P1.1, P1.2, P1.3
- status: FRONTIER
- requirements:
 - [该 Plan 要完成什么]
 - [完成标准]
 - [关键假设]

#### P1.1: [子 Plan 名称]
- parent: P1
- children: P1.1.1, P1.1.2
- status: FRONTIER
- requirements:
 - ...

##### P1.1.1: [子 Plan 名称]
- parent: P1.1
- children: none
- status: READY
- requirements:
 - ...

### P2: [Plan 名称]
- parent: P0
- children: P2.1, P2.2
- status: READY
- requirements:
 - ...

### P3: [Plan 名称]
- parent: P0
- children: none
- status: BLOCKED
- blocker:
 - [阻塞原因]
- requirements:
 - [关键假设]

## Ready Plans
- P1.1.1: [名称] - 可作为执行入口
- P2: [名称] - 可作为执行入口

## Blocked Plans
- P3: [阻塞原因]

## Next Frontier
- P1.1: 仍需继续拆解
- P2.1: 仍需继续拆解
```

**To-Clarify.md**（阻塞 Plan 拆解的外部问题）：

```markdown
# To-Clarify.md

> 用于记录 Agent 当前无法处理、阻塞 Plan 继续拆解的外部问题
> 问题被澄清后，结果写入对应 Plan 节点，然后从本文件删除

## 待澄清问题

### 高优先级
1. [问题] - 影响 [Plan ID]，阻塞 [进度]

### 中优先级
1. [问题] - 可能影响 [Plan ID]

### 低优先级
1. [问题] - 不阻塞当前拆解

## 风险假设
1. [假设内容] - 如果假设错误，会影响 [Plan ID]
```

**Room.md**（过程临时工作空间，Commit 后删除）：

```markdown
# Room.md

## Topic
[本过程的 Topic，由外部设定]

## Round Notes

### Round 1 - Lens [name]
[本 Episode 的思考过程留痕]
- [判断与决策]
- [拆解过程]
- [产物摘要]

### Round 2 - Lens [name]
[本 Episode 的思考过程留痕]
- [判断与决策]
- [拆解过程]
- [产物摘要]
```

**Log.md**（结构变化记录，由 Commit 写入）：

```markdown
# Log.md

## 2026-05-01 过程 1: [Topic]

### Round 1 - lens/[name]
#### Lens Note
- [少于 3 句话的本 Episode 判断]

#### Round Summary
1. Focus: [若有 Focus，逐条写当前 Focus，并说明哪些节点按深度思考处理、哪些节点只做广度校准；若无，写 无]
2. Expanded: [本 Episode 新增拆解了哪些 Plan 节点]
3. Decided: [本 Episode 确认了哪些父子关系或停止拆解点]
4. Next: [下一 Episode 继续展开哪些 frontier Plan]

### Round 2 - lens/[name]
#### Lens Note
- [少于 3 句话的本 Episode 判断]

#### Round Summary
1. Focus: ...
2. Expanded: ...
3. Decided: ...
4. Next: ...

---

## 2026-05-02 过程 2: [Topic]（回流）

### Round 1 - lens/[name]
#### Lens Note
- [少于 3 句话的本 Episode 判断]

#### Round Summary
1. Focus: [若有 Focus，逐条写当前 Focus，并说明哪些节点按深度思考处理、哪些节点只做广度校准；若无，写 无]
2. Type: [A 设计错误 / B 新 blocker 风险 / C 新需求范围切片]
3. Dimension: [C 类专用：引入的新维度，如题型 / 学科 / 阶段；A / B 可写 N/A]
4. Trigger: [执行阶段或一线反馈：哪个节点报告了什么问题]
5. Source: [错误/风险源头节点 ID + 原因]
6. Impacted: [节点 ID 列表 + 状态变更，例如 P1.1 DONE→FRONTIER]
7. Revised: [按动作优先级标注：深拆 / 修 requirements / 新增兄弟 / 重拆删节点]
8. Next: [下一 Episode frontier 或新 blocker]
```

## 最终形态

你面对的不是一个静态 Plan，而是一棵递归生长的 Plan 树：

> **P = P1 + P2 + P3，每个子 P 都可以继续展开，直到可执行。**

## 验证重点

验证的核心不是 Plan 内容本身，而是：

> **这种递归拆解 + 停机规则，是否能稳定支撑从大目标到可执行子 Plan 的推进过程。**
