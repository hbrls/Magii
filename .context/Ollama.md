# MAGII-12 · 在 MacMini 上运行最小尺寸 LLM 验证路径

> updated_by: DeepSeek Harness (lead) - kimi-coding/k3
> updated_at: 2026-11-26 23:17:00

## 目标

在 MacMini 上运行一个最小尺寸的 LLM，验证「本地大模型推理」这条路径可行。**不关心模型的实际工作能力**，只验证路径本身。

对应白板节点：MAGII-12（本文件为方案的权威记录，不再回写白板）。

## 目标硬件

| 项目 | 值 |
|---|---|
| 机型 | MacMini M4（序列号 Z1CG0002SZ） |
| CPU/GPU | 10 + 10 Core |
| 内存 | 32 GB 统一内存 |
| 存储 | 512 GB |

结论：对最小尺寸模型（100–300MB 权重）而言**没有任何硬件瓶颈**，Metal 加速路径天然成立。网络/模型下载不是问题，无需调研。

## 核心概念：运行时与模型

- **模型** = 权重文件，一坨静态数字（乐谱）。它自己什么也不会做。
- **运行时** = 加载权重并执行推理的引擎（乐队）：把权重搬进统一内存、逐 token 做前向计算、管理 KV cache。
- 同一模型可换运行时（GGUF 可在 llama.cpp / Ollama / LM Studio 上跑），同一运行时可换模型。
- 本任务验证的是「乐队能否在这台机器上演奏」，与模型聪明与否无关。

## 工具选择：Ollama

Ollama 的本质是一个**后台推理服务**（监听 `localhost:11434`），一个安装包同时提供三种入口：

| 入口 | 形态 | 本任务是否使用 |
|---|---|---|
| macOS App | 菜单栏图标 + **内置聊天窗口（GUI）**，可选模型、下载、直接对话（2025-07 起内置） | ✅ **优先使用** |
| CLI | `ollama run <模型名>`（拉模型 + 启动对话二合一） | 备选 / 留档 |
| API | OpenAI 兼容接口（`localhost:11434`） | 不使用 |

需要学习的命令行参数数量：**0**（GUI 路径）或 **1**（CLI 备选）。

## 模型选择（已选定，2026-11-26）

| 口径 | 模型 | 参数量 | 量化后体积 | 说明 |
|---|---|---|---|---|
| **最小口径（路径验证）** | **Qwen3-0.6B** | 0.6B | ~400–600MB | 带 thinking 模式，多语言 |
| **75% 口径（能力上限）** | **Qwen3-14B** | 14B 稠密 | ~9 GB（4bit） | 预算内稠密中速档，估算 10+ tok/s |

选型已收敛，不再做横向评测——评测不是本任务的目标。

## 执行步骤（在 MacMini M4 本机执行，GUI 优先）

1. 在 MacMini 上下载 Ollama（<https://ollama.com/download>），拖入「应用程序」并打开；菜单栏出现小羊驼图标即服务已启动。
2. 打开 Ollama 的内置聊天窗口。
3. 在窗口中选择并下载 **Qwen3-0.6B**。
4. 输入一段任意 Prompt（例如「用一句话介绍你自己」）。
5. 观察到模型输出一段文字 —— 验收闭环。

CLI 备选（需要可复制的留档记录时）：

```sh
ollama run qwen3:0.6b
# 终端内输入 Prompt，输出文字即通过
```

## 验收标准

必须同时满足：

1. 模型在 MacMini M4 本机成功加载。
2. 完成一次 **Text → Text** 推理：输入一段 Prompt，输出一段文字。
3. 不需要 Tools、函数调用、API、并发或任何复杂能力。
4. 形成路径验证记录：模型名、参数量、执行方式（GUI 或 CLI）、一次推理的截图或文本。

## 边界（非目标）

- **本方案不在当前工作机上执行**；执行只能发生在 MacMini M4（Z1CG0002SZ）上。
- 不评估模型能力高低，不做模型横评。
- 不搭建 API 服务、不接入其他系统、不做自动化。
- 不处理网络/下载问题（已确认为非问题）。
- 不改写白板节点 MAGII-12。

## 追加调查：这台 MacMini M4（32G）能运行的最大模型尺寸

调查时间：2026-11-26。

### 候选模型清单（2026-11 调查）

围绕最小与 75% 两个口径给出的候选，**最终已选定：Qwen3-0.6B（最小口径）、Qwen3-14B（75% 口径）**。

#### 锚点 A 附近：最小口径（135M–1B）

| 模型 | 参数量 | 量化后体积 | 特点 |
|---|---|---|---|
| SmolLM2-135M | 135M | ~100–200 MB | 主流可下载的绝对最小指令模型，HuggingFace 官方 |
| Gemma 3 270M | 270M | ~300 MB | Google 官方最小，基准可查，Ollama 官方收录 |
| **Qwen3-0.6B ✅ 已选** | 0.6B | ~400–600 MB | 带 thinking 模式，多语言 |
| Qwen3.5-0.8B | 0.8B | ~500–800 MB | 2026-02 发布，DeltaNet 混合架构，262K 原生上下文 |
| Gemma 3 1B / Llama 3.2 1B | 1B | ~700 MB–1 GB | 两大厂最小聊天模型，生态成熟 |

#### 锚点 B 附近：75% 口径（14B–27B，权重 ≤15 GB 为主）

| 模型 | 规模（总/激活） | 权重体积（4bit） | 特点 |
|---|---|---|---|
| **Qwen3-14B ✅ 已选** | 14B 稠密 | ~9 GB | 稠密路线中速档，thinking 模式 |
| Gemma 4 12B | 12B 稠密 | ~8 GB | 2026 款，文本+图像+音频输入 |
| gpt-oss-20b | 21B / 3.6B MoE | ~13 GB（原生 MXFP4） | OpenAI 开源权重，MXFP4 原生小体积，20+ tok/s |
| Mistral Small 3 24B | 24B 稠密 | ~14.3 GB（Q4_K_M） | Apache 2.0，欧洲阵营代表 |
| Gemma 4 26B-A4B | 26B / ~4B MoE | ~15 GB | 2026 款 MoE，实测 32G 可跑、号称小体积档能力最强 |
| Qwen3.6-27B | 27B 稠密 | ~16–18 GB | 2026-11 能力优先之选，略超 15 GB 预算 |

### 决定上限的物理约束

1. **统一内存池**：CPU / GPU / macOS / 推理运行时共享 32 GB。macOS 默认只把约 65–75% 划给 GPU 工作集——实测 32 GB 机器上 `recommendedMaxWorkingSetSize` ≈ **21–25 GB**（[fitmyllm 实测 M4-32G 可用 21.3 GB](https://www.fitmyllm.com/gpu/m4-32gb)；[M5-32G 实测 ≈24.96 GB](https://github.com/wiltodelta/small-llm-testing)）。可用 `sudo sysctl iogpu.wired_limit_mb=<MB>` 上调，但会挤压系统。
2. **权重 + KV cache 都要住进这个池子**：KV cache 随上下文长度增长，长对话会让「刚好能加载」变成「加载后跑不动」（[内存占用拆解](https://mefmobile.org/how-much-unified-memory-does-a-mac-mini-need-for-local-ai-models/)）。
3. **速度由内存带宽决定**：M4 为 120 GB/s。生成速度上限 ≈ 带宽 ÷ 每 token 需读取的权重字节数。

### 估算口径

按本机可用内存预算的 75% 估算，为 KV cache 与系统占用预留余量。

### 估算结果

| 维度 | 估算值 |
|---|---|
| 权重体积预算 | **~15 GB** |
| 稠密模型最大尺寸（Q4 量化） | **~24B** |
| 生成速度（120 GB/s ÷ 权重字节） | 6–9 tok/s（稠密）/ 20+ tok/s（MoE） |

代表模型：稠密方向为 Qwen3-14B–24B、Gemma 3 27B 以下档位；MoE 方向为 gpt-oss-20b（权重 ≈13 GB，激活 3.6B，20+ tok/s）。**最终选用 Qwen3-14B（权重 ~9 GB，余量充足）。**

### 一句话结论

> **按 75% 估算，这台 MacMini M4（32G）可运行的最大尺寸是 ~24B 稠密（Q4，权重 ≤15 GB）；最终选用 Qwen3-14B（~9 GB，预算的 60%），余量充足。** 对 MAGII-12 的路径验证无影响——最小模型（Qwen3-0.6B）与该上限之间差约 23 倍，但都走在同一条 Ollama 路径上。

## 参考来源

- [Ollama's new app（官方博客，2025-07-30，GUI 聊天窗口）](https://registry.ollama.com/blog/new-app)
- [Ollama Quickstart（官方文档）](https://docs.ollama.com/quickstart)
- [Gemma 3 270M 官方说明与基准](https://gemma.ai/models/gemma-3.md)
- [Open WebUI 文档：Ollama 形态说明](https://docs.openwebui.com/alternatives/ollama)
- [Apple Silicon 上 llama.cpp 实测记录（M5, 32GB）](https://github.com/wiltodelta/small-llm-testing)
