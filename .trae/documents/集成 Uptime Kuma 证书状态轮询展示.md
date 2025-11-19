## 目标
- 从 `https://uptime.ets2la.cn/api/status-page/ets2la` 解析 `publicGroupList[].monitorList[]`。
- 以 `name` 为显示名称，`validCert` 作为状态（true=绿色，false=红色）。
- 展示 `certExpiryDaysRemaining` 为“SSL证书剩余时间（天）”。
- 每分钟（60秒）自动轮询刷新一次，样式参考 Uptime Kuma 状态卡片。

## 代码位置与现状
- 组件入口：`src/components/StatusPage.vue`（当前已实现一次性拉取并展示“状态/可用率”，未包含证书状态与轮询）。
  - 初始 `fetch` 在 `onMounted` 中执行：`src/components/StatusPage.vue:33-47`
  - 状态文案/样式函数：`statusLabel` 与 `statusClass`：`src/components/StatusPage.vue:49-65`
  - 列表渲染：`publicGroupList` 或 `groupList`：`src/components/StatusPage.vue:78-93`
- 页面使用：`src/App.vue` 中的“服务状态”卡片：`src/App.vue:375-385`

## 数据结构与解析
- 扩展/替换 `MonitorItem`，新增：
  - `validCert?: boolean`
  - `certExpiryDaysRemaining?: number`
  - 保留 `name?: string`，兼容缺失字段。
- 解析策略：
  - 取 `data.publicGroupList ?? data.groupList ?? []`。
  - 对每个 `monitorList` 项，读取 `name`、`validCert`、`certExpiryDaysRemaining`。
  - 若缺失 `validCert` 或 `certExpiryDaysRemaining`，显示“未知”与灰色样式。

## 轮询实现
- 使用 `@vueuse/core` 的 `useIntervalFn` 在组件挂载后每 60000ms 调用一次刷新函数。
- 首次立即执行（`immediate: true`），在组件卸载时自动清理。
- 刷新函数：封装 `fetch(props.apiUrl)`，失败时保留上次数据并显示错误提示。

## 展示样式（类似 Uptime Kuma）
- 列表项左右布局：左侧名称，右侧状态徽章（圆角胶囊）。
- 状态徽章：
  - 绿色（正常）：`bg-emerald-500/15 text-emerald-600 border-emerald-500/30`
  - 红色（异常）：`bg-red-500/15 text-red-600 border-red-500/30`
  - 灰色（未知）：`bg-muted text-muted-foreground border-muted-foreground/20`
- 徽章内文案：
  - `validCert===true` → `SSL正常 · 剩余{certExpiryDaysRemaining}天`
  - `validCert===false` → `SSL异常 · 剩余{certExpiryDaysRemaining}天`
  - `certExpiryDaysRemaining<0` → `已过期 {abs(天数)} 天`
- 支持暗色/浅色主题，沿用现有 Tailwind 设计系统（`src/style.css`）。

## 交互与易用性
- 顶部显示最近刷新时间（例如：`最近更新：HH:mm:ss`）。
- 右上角提供“立即刷新”按钮，触发一次 `refresh()`。
- 当 API 不可达时，保留上次成功数据并在卡片底部显示错误文本与状态页链接（现有逻辑基础上增强）。

## 兼容性与边界
- 若页面仍传入相对路径（`/api/status-page/ets2la`），保留现状；组件默认值使用绝对路径，避免跨域问题时可直接工作。
- 仅对存在 `validCert` 字段的监控项显示证书状态；其他类型显示为“未知”。
- 支持 `publicGroupList` 与 `groupList` 两种字段，以适配不同配置。

## 变更清单
- 修改 `src/components/StatusPage.vue`：
  - 数据类型与解析逻辑，增加证书相关字段。
  - 新增 `refresh()` 与 `useIntervalFn` 轮询。
  - 新增 `certLabel(validCert, days)` 与 `certClass(validCert)`。
  - 更新模板，展示证书状态胶囊与剩余天数；增加最近更新时间和手动刷新。
- 不改动 `vite.config.ts` 与全局样式，仅使用 Tailwind 现有变量和色板。

## 验证
- 本地运行页面，确认：
  - 首次加载显示正确分组与监控项。
  - `validCert` 为 true 显示绿色；false 显示红色；缺失显示灰色。
  - `certExpiryDaysRemaining` 数值正确呈现，过期为负数时转为“已过期”。
  - 每分钟自动刷新且最近更新时间更新。
  - 手动刷新按钮立即生效，错误提示可见并不破坏旧数据。

确认后我将按以上计划实现并提交改动。