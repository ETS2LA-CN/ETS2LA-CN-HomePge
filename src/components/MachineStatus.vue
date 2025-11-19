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

function nodeDotClass(n: any) {
  const v = typeof n?.online === 'boolean' ? n.online : null
  if (v === true) return 'bg-emerald-500'
  if (v === false) return 'bg-red-500'
  return 'bg-muted-foreground/30'
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

function nodeTrafficText(n: any) {
  const up = typeof n?.tx_bytes === 'number' ? n.tx_bytes : getNestedNumber(n, 'network.totalUp')
  const down = typeof n?.rx_bytes === 'number' ? n.rx_bytes : getNestedNumber(n, 'network.totalDown')
  const a = formatBytes(up)
  const b = formatBytes(down)
  if (a === '未知' && b === '未知') return '流量：未知'
  return `流量：上传 ${a} · 下载 ${b}`
}

function nodeUsageText(n: any) {
  // CPU 按照你的要求：ws 返回的值直接视为百分比，不做乘 100
  const cpuRaw = typeof n?.cpu_usage === 'number' ? n.cpu_usage : getNestedNumber(n, 'cpu.usage')
  const cpuP = round2(cpuRaw)
  const memP = round2(
    percent(
      typeof n?.mem_used === 'number' ? n.mem_used : getNestedNumber(n, 'ram.used'),
      typeof n?.mem_total === 'number' ? n.mem_total : getNestedNumber(n, 'ram.total')
    ) ?? undefined
  )
  const diskP = round2(
    percent(
      typeof n?.disk_used === 'number' ? n.disk_used : getNestedNumber(n, 'disk.used'),
      typeof n?.disk_total === 'number' ? n.disk_total : getNestedNumber(n, 'disk.total')
    ) ?? undefined
  )
  const fmt = (v: number | null) => (v !== null ? `${v.toFixed(2)}%` : '未知')
  const parts: string[] = []
  parts.push(`CPU ${fmt(cpuP)}`)
  parts.push(`内存 ${fmt(memP)}`)
  parts.push(`磁盘 ${fmt(diskP)}`)
  return `占用率：` + parts.join(' · ')
}

function nodeUptimeText(n: any) {
  const sec = typeof n?.uptime === 'number' ? n.uptime : getNestedNumber(n, 'uptime')
  if (typeof sec !== 'number' || !isFinite(sec) || sec < 0) return '在线时间：未知'
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  return `在线时间：${d}天${h}小时${m}分钟${s}秒`
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
  <div>
    <div v-if="nodesError" class="mb-2 text-xs text-red-600">无法加载机器状态：{{ nodesError }}。仍显示最近一次数据</div>
    <div class="mb-2 text-xs text-muted-foreground">最近更新：{{ nodesUpdated }}</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div v-for="n in nodes" :key="n?.uuid ?? n?.name ?? Math.random()" class="rounded-lg border bg-white/60 dark:bg-neutral-900/50 p-3 flex items-center justify-between gap-4">
        <div class="text-sm flex-1 pl-1 text-center">
          <div class="font-medium">{{ n?.name ?? '未命名节点' }}</div>
          <div class="text-xs text-muted-foreground mt-1">{{ nodeTrafficText(n) }}</div>
          <div class="text-xs text-muted-foreground mt-1">{{ nodeUsageText(n) }}</div>
          <div class="text-xs text-muted-foreground mt-1">{{ nodeUptimeText(n) }}</div>
        </div>
        <div class="w-[240px] flex items-center justify-end">
          <span class="h-3 w-3 rounded-full" :class="nodeDotClass(n)"></span>
        </div>
      </div>
    </div>
    <div class="mt-3 text-sm text-muted-foreground">
      获取机器状态详细信息可前往
      <a :href="props.nodeApiBase" target="_blank" rel="noopener noreferrer" class="underline">探针页面</a>
    </div>
  </div>
</template>

<style scoped></style>