<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'

interface KomariNodesResponse { status?: string; message?: string; data?: any[] }

const props = withDefaults(defineProps<{ nodeApiBase?: string }>(), {
  nodeApiBase: 'https://node.ets2la.cn',
})

const nodes = ref<any[]>([])
const nodesError = ref<string | null>(null)
const nodesUpdated = ref<string>('')
const nodeNameByUUID = ref<Record<string, string>>({})
const wsClients = ref<WebSocket | null>(null)
const wsConnected = ref(false)
let wsPollTimer: number | null = null

onMounted(() => {
  refreshNodes()
  connectClientsWS()
})

useIntervalFn(() => {
  if (wsConnected.value && wsClients.value) {
    try { wsClients.value.send('get') } catch {}
  }
}, 60000, { immediate: false })

async function refreshNodes() {
  try {
    const url = `${props.nodeApiBase.replace(/\/$/, '')}/api/nodes`
    const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store', mode: 'cors' })
    if (!res.ok) throw new Error(`请求失败: ${res.status}`)
    const json = await res.json()
    const arr = Array.isArray(json) ? json : (json as KomariNodesResponse)?.data ?? []
    seedNodes(arr)
    nodesError.value = null
  } catch (e: any) {
    nodesError.value = e?.message ?? '无法获取节点数据'
  } finally {
    const d = new Date()
    nodesUpdated.value = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
  }
}

function wsUrlClients() {
  const base = props.nodeApiBase.replace(/\/$/, '')
  const proto = base.startsWith('https') ? 'wss' : 'ws'
  const host = base.replace(/^https?:\/\//, '')
  return `${proto}://${host}/api/clients`
}

function connectClientsWS() {
  try { if (wsClients.value) wsClients.value.close() } catch {}
  wsConnected.value = false
  const url = wsUrlClients()
  const ws = new WebSocket(url)
  ws.onopen = () => {
    wsConnected.value = true
    try { ws.send('get') } catch {}
    try {
      if (wsPollTimer) clearInterval(wsPollTimer)
      wsPollTimer = setInterval(() => { try { ws.send('get') } catch {} }, 60000) as unknown as number
    } catch {}
  }
  ws.onmessage = ev => {
    try {
      const msg = JSON.parse(ev.data)
      const payload = msg?.data ?? {}
      const onlineList: string[] = Array.isArray(payload?.online) ? payload.online : []
      const onlineSet = new Set<string>(onlineList)
      const dict: Record<string, any> = typeof payload?.data === 'object' && payload?.data ? payload.data : {}
      const arr: any[] = []
      for (const [uuid, item] of Object.entries(dict)) {
        arr.push({ uuid, ...item, data: { online: onlineSet.has(uuid) } })
      }
      if (arr.length > 0) upsertClients(arr)
      if (onlineSet.size > 0) {
        for (const n of nodes.value) {
          if (n?.uuid) n.online = onlineSet.has(n.uuid)
        }
      }
      nodesError.value = null
    } catch (e: any) {
      nodesError.value = e?.message ?? '数据解析失败'
    }
    const d = new Date()
    nodesUpdated.value = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
  }
  ws.onerror = () => {}
  ws.onclose = () => { wsConnected.value = false; if (wsPollTimer) { clearInterval(wsPollTimer); wsPollTimer = null } setTimeout(() => connectClientsWS(), 5000) }
  wsClients.value = ws
}

function getNested(o: any, path: string) {
  try { return path.split('.').reduce((acc, k) => (acc != null ? acc[k] : undefined), o) } catch { return undefined }
}
function getNestedNumber(o: any, path: string): number | undefined {
  const v = getNested(o, path)
  return typeof v === 'number' ? v : undefined
}

function seedNodes(arr: any[]) {
  for (const raw of arr) {
    const uuid = raw?.uuid ?? raw?.id ?? null
    const name = raw?.name ?? raw?.hostname ?? raw?.node_name ?? raw?.display_name ?? null
    if (!uuid && !name) continue
    if (uuid && name) nodeNameByUUID.value[uuid] = name
    let idx = -1
    if (uuid) idx = nodes.value.findIndex(x => x?.uuid === uuid)
    if (idx === -1 && name) idx = nodes.value.findIndex(x => x?.name === name)
    const base = { uuid, name }
    if (idx >= 0) nodes.value[idx] = { ...nodes.value[idx], ...base }
    else nodes.value.push(base)
  }
}

function nodeStatusInfo(n: any) {
  const v = typeof n?.online === 'boolean' ? n.online : null
  if (v === true) return { class: 'bg-emerald-500', label: '在线', textClass: 'text-emerald-600 dark:text-emerald-400', dotClass: 'bg-emerald-500' }
  if (v === false) return { class: 'bg-red-500', label: '离线', textClass: 'text-red-600 dark:text-red-400', dotClass: 'bg-red-500' }
  return { class: 'bg-yellow-500', label: '未知', textClass: 'text-yellow-600 dark:text-yellow-400', dotClass: 'bg-yellow-500' }
}

function formatBytes(n?: number) {
  if (typeof n !== 'number' || !isFinite(n) || n < 0) return '未知'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let v = n
  let i = 0
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)} ${units[i]}`
}

function percent(a?: number, b?: number) {
  if (typeof a !== 'number' || typeof b !== 'number' || !isFinite(a) || !isFinite(b) || b <= 0) return null
  const p = (a / b) * 100
  return clampPercent(p)
}

function clampPercent(x?: number | null) {
  if (typeof x !== 'number' || !isFinite(x)) return null
  return Math.max(0, Math.min(100, x))
}

function round2(x?: number | null) {
  const v = clampPercent(x)
  if (v === null) return null
  return Math.round(v * 100) / 100
}

function getCpuUsage(n: any) {
  const cpuRaw = typeof n?.cpu_usage === 'number' ? n.cpu_usage : getNestedNumber(n, 'cpu.usage')
  return round2(cpuRaw)
}

function getMemPercent(n: any) {
  return round2(
    percent(
      typeof n?.mem_used === 'number' ? n.mem_used : getNestedNumber(n, 'ram.used'),
      typeof n?.mem_total === 'number' ? n.mem_total : getNestedNumber(n, 'ram.total')
    ) ?? undefined
  )
}

function getDiskPercent(n: any) {
  return round2(
    percent(
      typeof n?.disk_used === 'number' ? n.disk_used : getNestedNumber(n, 'disk.used'),
      typeof n?.disk_total === 'number' ? n.disk_total : getNestedNumber(n, 'disk.total')
    ) ?? undefined
  )
}

function formatUptime(n: any) {
  const sec = typeof n?.uptime === 'number' ? n.uptime : getNestedNumber(n, 'uptime')
  if (typeof sec !== 'number' || !isFinite(sec) || sec < 0) return null
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (d > 0) return `${d}天 ${h}小时`
  if (h > 0) return `${h}小时 ${m}分钟`
  return `${m}分钟`
}

function normalizeClient(c: any) {
  const uuid = c?.uuid ?? c?.id ?? null
  const name = nodeNameByUUID.value[uuid as string] ?? c?.name ?? c?.hostname ?? c?.node_name ?? c?.display_name ?? null
  const online = getNested(c, 'data.online')
  const rx_bytes = getNestedNumber(c, 'network.totalDown')
  const tx_bytes = getNestedNumber(c, 'network.totalUp')
  const cpu_usage = getNestedNumber(c, 'cpu.usage')
  const mem_used = getNestedNumber(c, 'ram.used')
  const mem_total = getNestedNumber(c, 'ram.total')
  const disk_used = getNestedNumber(c, 'disk.used')
  const disk_total = getNestedNumber(c, 'disk.total')
  const uptime = getNestedNumber(c, 'uptime')
  return { uuid, name, online, cpu_usage, mem_used, mem_total, disk_used, disk_total, rx_bytes, tx_bytes, uptime }
}

function upsertClients(list: any[]) {
  for (const raw of list) {
    const c = normalizeClient(raw)
    let idx = -1
    if (c.uuid) idx = nodes.value.findIndex(x => x?.uuid === c.uuid)
    if (idx === -1 && c.name) idx = nodes.value.findIndex(x => x?.name === c.name)
    if (idx >= 0) nodes.value[idx] = { ...nodes.value[idx], ...c, name: nodes.value[idx].name ?? c.name ?? (c.uuid ? nodeNameByUUID.value[c.uuid] : undefined) }
    else nodes.value.push(c)
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- 错误提示 -->
    <div v-if="nodesError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
      {{ nodesError }}
    </div>

    <!-- 加载状态 -->
    <div v-if="nodes.length === 0 && !nodesError" class="flex items-center justify-center py-8">
      <div class="flex items-center gap-3 text-muted-foreground">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>正在加载机器状态...</span>
      </div>
    </div>

    <!-- 节点列表 -->
    <div v-else class="space-y-3">
      <div
        v-for="n in nodes"
        :key="n?.uuid ?? n?.name ?? Math.random()"
        class="p-4 rounded-2xl border bg-muted/30"
      >
        <!-- 节点头部 -->
        <div class="flex items-center gap-3 mb-3">
          <span class="h-2.5 w-2.5 rounded-full flex-shrink-0" :class="nodeStatusInfo(n).dotClass"></span>
          <span class="font-medium truncate">{{ n?.name ?? '未命名节点' }}</span>
          <span class="text-xs px-2 py-0.5 rounded-full ml-auto" :class="nodeStatusInfo(n).textClass + ' bg-current/10'">
            {{ nodeStatusInfo(n).label }}
          </span>
        </div>

        <!-- 资源使用率 -->
        <div class="grid grid-cols-3 gap-2 text-xs">
          <div class="flex flex-col gap-1">
            <div class="text-muted-foreground">CPU</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="{
                    'bg-emerald-500': (getCpuUsage(n) ?? 0) < 60,
                    'bg-yellow-500': (getCpuUsage(n) ?? 0) >= 60 && (getCpuUsage(n) ?? 0) < 85,
                    'bg-red-500': (getCpuUsage(n) ?? 0) >= 85
                  }"
                  :style="{ width: Math.min(getCpuUsage(n) ?? 0, 100) + '%' }"
                ></div>
              </div>
              <span class="w-10 text-right font-medium">{{ getCpuUsage(n)?.toFixed(0) ?? '--' }}%</span>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-muted-foreground">内存</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="{
                    'bg-emerald-500': (getMemPercent(n) ?? 0) < 60,
                    'bg-yellow-500': (getMemPercent(n) ?? 0) >= 60 && (getMemPercent(n) ?? 0) < 85,
                    'bg-red-500': (getMemPercent(n) ?? 0) >= 85
                  }"
                  :style="{ width: Math.min(getMemPercent(n) ?? 0, 100) + '%' }"
                ></div>
              </div>
              <span class="w-10 text-right font-medium">{{ getMemPercent(n)?.toFixed(0) ?? '--' }}%</span>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-muted-foreground">磁盘</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="{
                    'bg-emerald-500': (getDiskPercent(n) ?? 0) < 60,
                    'bg-yellow-500': (getDiskPercent(n) ?? 0) >= 60 && (getDiskPercent(n) ?? 0) < 85,
                    'bg-red-500': (getDiskPercent(n) ?? 0) >= 85
                  }"
                  :style="{ width: Math.min(getDiskPercent(n) ?? 0, 100) + '%' }"
                ></div>
              </div>
              <span class="w-10 text-right font-medium">{{ getDiskPercent(n)?.toFixed(0) ?? '--' }}%</span>
            </div>
          </div>
        </div>

        <!-- 流量和运行时 -->
        <div class="mt-3 pt-3 border-t border-muted/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            上传 {{ formatBytes(n?.tx_bytes ?? getNestedNumber(n, 'network.totalUp')) }} /
            下载 {{ formatBytes(n?.rx_bytes ?? getNestedNumber(n, 'network.totalDown')) }}
          </span>
          <span v-if="formatUptime(n)">在线 {{ formatUptime(n) }}</span>
        </div>
      </div>
    </div>

    <!-- 更新时间 -->
    <div class="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
      最近更新：{{ nodesUpdated }} · <a :href="props.nodeApiBase" target="_blank" rel="noopener noreferrer" class="underline hover:text-foreground">查看完整探针页面</a>
    </div>
  </div>
</template>

<style scoped></style>
