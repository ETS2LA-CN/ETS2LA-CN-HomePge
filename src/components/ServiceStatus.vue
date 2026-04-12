<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface MonitorItem {
  id?: number
  name?: string
  type?: string
  status?: number
  uptime?: number
  validCert?: boolean
  certExpiryDaysRemaining?: number
  url?: string
}

interface HeartbeatItem {
  status: number
  time: string
  msg: string
  ping: number
}

interface HeartbeatResponse {
  heartbeatList: Record<string, HeartbeatItem[]>
  uptimeList: Record<string, number>
}

interface GroupItem {
  name?: string
  monitorList?: MonitorItem[]
}

interface StatusPageResponse {
  publicGroupList?: GroupItem[]
  groupList?: GroupItem[]
}

const props = withDefaults(defineProps<{ apiUrl?: string; statusPageUrl?: string }>(), {
  apiUrl: '/api/status-page/ets2la',
  statusPageUrl: 'https://uptime.ets2la.cn/status/ets2la',
})

const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<StatusPageResponse | null>(null)
const heartbeats = ref<HeartbeatResponse | null>(null)
const lastUpdated = ref<string>('')

async function refresh(initial = false) {
  const absoluteDefault = 'https://uptime.ets2la.cn/api/status-page/ets2la'
  const sameOrigin = `${location.origin}/api/status-page/ets2la`
  const attempts = Array.from(new Set([props.apiUrl, sameOrigin, absoluteDefault].filter(Boolean))) as string[]

  let success = false
  let lastErr: any = null
  let successUrl = ''

  for (const url of attempts) {
    try {
      await fetchUrl(url)
      error.value = null
      success = true
      successUrl = url
      break
    } catch (err) {
      lastErr = err
    }
  }

  if (!success) {
    error.value = lastErr?.message ?? '无法获取状态页数据'
  } else {
    let hbUrl = ''
    if (successUrl.includes('/api/status-page/')) {
      hbUrl = successUrl.replace('/api/status-page/', '/api/status-page/heartbeat/')
    } else {
      hbUrl = 'https://uptime.ets2la.cn/api/status-page/heartbeat/ets2la'
    }

    try {
      await fetchHeartbeat(hbUrl)
    } catch (e) {
      console.warn('Failed to fetch heartbeats:', e)
    }
  }

  const d = new Date()
  lastUpdated.value = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
  if (initial) loading.value = false
}

onMounted(() => {
  refresh(true)
})

async function fetchUrl(url: string) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store', mode: 'cors' })
  if (!res.ok) throw new Error(`请求失败: ${res.status}`)
  const json = await res.json()
  data.value = json
}

async function fetchHeartbeat(url: string) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store', mode: 'cors' })
  if (!res.ok) throw new Error(`Heartbeat fetch failed: ${res.status}`)
  const json = await res.json()
  heartbeats.value = json
}

function getMonitorStatus(m: MonitorItem): number | undefined {
  if (!heartbeats.value || !m.id) return undefined
  const list = heartbeats.value.heartbeatList[m.id.toString()]
  if (Array.isArray(list) && list.length > 0) {
    return list[list.length - 1]?.status
  }
  return undefined
}

function statusInfo(m: MonitorItem) {
  const s = getMonitorStatus(m)
  if (s === 1) return { class: 'bg-emerald-500', label: '正常', textClass: 'text-emerald-600 dark:text-emerald-400' }
  if (s === 0) return { class: 'bg-red-500', label: '异常', textClass: 'text-red-600 dark:text-red-400' }

  const v = typeof m?.validCert === 'boolean' ? m.validCert : null
  if (v === true) return { class: 'bg-emerald-500', label: '正常', textClass: 'text-emerald-600 dark:text-emerald-400' }
  if (v === false) return { class: 'bg-red-500', label: '证书过期', textClass: 'text-red-600 dark:text-red-400' }
  return { class: 'bg-yellow-500', label: '未知', textClass: 'text-yellow-600 dark:text-yellow-400' }
}

function certText(m: MonitorItem) {
  if (typeof m?.certExpiryDaysRemaining !== 'number') return null
  const days = m.certExpiryDaysRemaining
  if (days < 0) return { text: `已过期 ${Math.abs(days)} 天`, warning: true }
  if (days < 30) return { text: `证书 ${days} 天后过期`, warning: true }
  return { text: `证书 ${days} 天`, warning: false }
}
</script>

<template>
  <div class="space-y-4">
    <!-- 错误提示 -->
    <div v-if="error" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="flex items-center gap-3 text-muted-foreground">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>正在加载服务状态...</span>
      </div>
    </div>

    <!-- 服务列表 -->
    <div v-else>
      <div v-for="group in (data?.publicGroupList ?? data?.groupList ?? [])" :key="group?.name" class="space-y-3">
        <!-- 分组标题 -->
        <div v-if="group?.name" class="text-sm font-medium text-muted-foreground px-1">
          {{ group.name }}
        </div>

        <!-- 服务卡片列表 -->
        <div class="space-y-2">
          <component
            :is="m.url ? 'a' : 'div'"
            v-for="m in (group?.monitorList ?? [])"
            :key="m?.id ?? m?.name"
            :href="m.url"
            :target="m.url ? '_blank' : undefined"
            :rel="m.url ? 'noopener noreferrer' : undefined"
            class="group flex items-center gap-4 p-4 rounded-2xl border bg-muted/30 hover:bg-muted/50 transition-all"
            :class="{ 'cursor-pointer': !!m.url }"
          >
            <!-- 状态指示器 -->
            <div class="flex-shrink-0">
              <span class="block h-3 w-3 rounded-full" :class="statusInfo(m).class"></span>
            </div>

            <!-- 服务名称 -->
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ m?.name ?? '未命名服务' }}</div>
              <div v-if="certText(m)" class="text-xs mt-0.5" :class="certText(m)?.warning ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'">
                {{ certText(m)?.text }}
              </div>
            </div>

            <!-- 状态标签 -->
            <div class="flex-shrink-0">
              <span class="text-sm font-medium px-2.5 py-1 rounded-full" :class="statusInfo(m).textClass + ' bg-current/10'">
                {{ statusInfo(m).label }}
              </span>
            </div>

            <!-- 外部链接图标 -->
            <svg v-if="m.url" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" x2="21" y1="14" y2="3" />
            </svg>
          </component>
        </div>
      </div>

      <!-- 更新时间 -->
      <div class="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
        最近更新：{{ lastUpdated }} · <a :href="props.statusPageUrl" target="_blank" rel="noopener noreferrer" class="underline hover:text-foreground">查看完整状态页</a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
