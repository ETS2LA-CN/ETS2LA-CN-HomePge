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
const lastUpdated = ref<string>('')

async function refresh(initial = false) {
  const absoluteDefault = 'https://uptime.ets2la.cn/api/status-page/ets2la'
  const sameOrigin = `${location.origin}/api/status-page/ets2la`
  const attempts = Array.from(new Set([props.apiUrl, sameOrigin, absoluteDefault].filter(Boolean))) as string[]

  let success = false
  let lastErr: any = null
  for (const url of attempts) {
    try {
      await fetchUrl(url)
      error.value = null
      success = true
      break
    } catch (err) {
      lastErr = err
    }
  }
  if (!success) error.value = lastErr?.message ?? '无法获取状态页数据'
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

function statusClass(m: MonitorItem) {
  const v = typeof m?.validCert === 'boolean' ? m.validCert : null
  if (v === true) return 'bg-emerald-500'
  if (v === false) return 'bg-red-500'
  return 'bg-muted-foreground/30'
}
</script>

<template>
  <div>
    <div v-if="loading" class="text-sm text-muted-foreground">正在加载服务状态…</div>
    <div v-else>
      <div v-if="error" class="mb-2 text-xs text-red-600">无法加载服务状态：{{ error }}。仍显示最近一次数据</div>
      <div class="mb-2 text-xs text-muted-foreground">最近更新：{{ lastUpdated }}</div>
      <div v-for="group in (data?.publicGroupList ?? data?.groupList ?? [])" :key="group?.name" class="mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-for="m in (group?.monitorList ?? [])" :key="m?.id ?? m?.name" class="rounded-lg border bg-white/60 dark:bg-neutral-900/50 p-3 flex items-center justify-between gap-4">
            <div class="text-sm flex-1 pl-1 text-center">
              <div class="font-medium">{{ m?.name ?? '未命名服务' }}</div>
              <div class="text-xs text-muted-foreground mt-1">
                <span v-if="typeof m?.certExpiryDaysRemaining === 'number'">
                  证书剩余：{{ m.certExpiryDaysRemaining >= 0 ? m.certExpiryDaysRemaining : `已过期${Math.abs(m.certExpiryDaysRemaining)}` }} 天
                </span>
                <span v-else>证书剩余：未知</span>
              </div>
            </div>
            <div class="w-[240px] flex items-center justify-end">
              <span class="h-3 w-3 rounded-full" :class="statusClass(m)"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 text-sm text-muted-foreground">
        该页面显示的状态只是预览，并非完全正确，详情信息请访问状态页查看
        <a :href="props.statusPageUrl" target="_blank" rel="noopener noreferrer" class="underline">状态页</a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>