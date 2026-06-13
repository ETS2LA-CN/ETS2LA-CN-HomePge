<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bell, X, Info } from 'lucide-vue-next'
import { motion, AnimatePresence } from 'motion-v'

// 公告内容
const announcement = {
  title: '最新公告',
  content: '因未完成雨云赞助计划需求，雨云赞助的服务器已到期，可视化已切换回原服务器并开启限速，如果您仍然希望获得更快的访问速度请为 ETS2LA国内镜像站提供者 晚安（QQ：1804832964） 进行赞助（请备注赞助目的、所在省份以及联系方式），晚安将会单独从阿里云给你开一台机器（电信/联通/移动三线峰值 200mbps= 25MB/s）并使用特定域名供你访问。',
  date: '2026-04-10',
}

const isVisible = ref(false)
const hasUnread = ref(true)

const toggleAnnouncement = () => {
  isVisible.value = !isVisible.value
  if (isVisible.value) {
    hasUnread.value = false
    localStorage.setItem('announcement_read_date', announcement.date)
  }
}

const closeAnnouncement = () => {
  isVisible.value = false
}

// 检查是否已经阅读过最新公告
onMounted(() => {
  const lastReadDate = localStorage.getItem('announcement_read_date')
  if (lastReadDate !== announcement.date) {
    hasUnread.value = true
    // 默认展示公告
    setTimeout(() => {
      isVisible.value = true
    }, 1000)
  } else {
    hasUnread.value = false
  }
})
</script>

<template>
  <div class="relative">
    <!-- 触发按钮（通常放在 Dock 中） -->
    <button
      @click="toggleAnnouncement"
      class="relative flex items-center justify-center size-full rounded-full transition-colors hover:bg-muted"
      aria-label="查看公告"
    >
      <Bell class="size-5" />
      <span
        v-if="hasUnread"
        class="absolute top-0 right-0 size-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse"
      ></span>
    </button>

    <!-- 弹出式公告卡片 -->
    <Teleport to="body">
      <AnimatePresence>
        <motion.div
          v-if="isVisible"
          :initial="{ opacity: 0, y: -20, scale: 0.95, x: 20 }"
          :animate="{ opacity: 1, y: 0, scale: 1, x: 0 }"
          :exit="{ opacity: 0, y: -20, scale: 0.95, x: 20 }"
          class="fixed top-24 right-8 z-[100] w-80 sm:w-96 overflow-hidden rounded-xl border bg-card/90 text-card-foreground shadow-2xl backdrop-blur-md"
        >
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="p-1.5 bg-primary/20 rounded-lg text-primary">
                  <Info class="size-4" />
                </div>
                <h3 class="font-semibold text-base tracking-tight">{{ announcement.title }}</h3>
              </div>
              <button
                @click="closeAnnouncement"
                class="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground/60 hover:text-muted-foreground"
              >
                <X class="size-4" />
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <p class="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {{ announcement.content }}
                </p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-border/50">
                <span class="text-[10px] text-muted-foreground/70 font-medium uppercase tracking-widest">
                  {{ announcement.date }}
                </span>
                <button
                  @click="closeAnnouncement"
                  class="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                >
                  我知道了
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Teleport>
  </div>
</template>

<style scoped></style>
