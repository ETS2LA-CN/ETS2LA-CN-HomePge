<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import Announcement from '@/components/Announcement.vue'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { CardTitle } from '@/components/ui/card'
import { StarsBackground } from '@/components/ui/bg-stars'
import ServiceStatus from '@/components/ServiceStatus.vue'
import MachineStatus from '@/components/MachineStatus.vue'
import NewsUpdate from '@/components/NewsUpdate.vue'
import { Github, MessageCircle, ExternalLink, Menu, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useColorMode, usePreferredDark } from '@vueuse/core'

// 移动端菜单状态
const mobileMenuOpen = ref(false)

// 根据当前主题切换界面预览图片的目录
const mode = useColorMode()
const preferredDark = usePreferredDark()
const isDark = computed(() => mode.value === 'dark' || (mode.value === 'auto' && preferredDark.value))
const imgBase = computed(() => (isDark.value ? '/show/flip_card/black' : '/show/flip_card/white'))

// 当前版本信息
const currentVersion = 'ETS2LA C# v3.4.13'

// 导航链接
const navLinks = [
  { label: '文档', href: 'https://docs.ets2la.cn/version/v3/', external: true },
]

// 功能卡片数据
const featureCards = [
  {
    title: '快速上手',
    description: '查看文档并在数分钟内完成插件/软件的安装',
    href: 'https://docs.ets2la.cn/version/v3',
  },
]

// 预览图片数据
const previewImages = [
  { src: 'home.png', label: '主页' },
  { src: 'visualization.png', label: '可视化' },
  { src: 'plugins.png', label: '插件' },
  { src: 'catalogue.png', label: '社区插件' },
  { src: 'performance.png', label: '资源消耗' },
  { src: 'settings.png', label: '设置' },
]
</script>

<template>
  <main class="relative min-h-screen bg-background text-foreground">

    <!-- 星空背景 -->
    <StarsBackground
      :factor="0.05"
      :speed="50"
      :star-color="isDark ? '#ffffff' : '#000000'"
      :background-class="isDark ? 'bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]' : 'bg-background'"
      class="absolute inset-0 z-0 pointer-events-none"
    />

    <!-- 顶部导航栏 -->
    <header class="relative z-50 w-full">
      <nav class="mx-auto max-w-7xl px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo 区域 -->
          <a href="/" class="flex items-center gap-3 group">
            <img
              src="/icon/ets2la-jian.png"
              alt="ETS2LA"
              class="h-10 w-10 rounded-xl transition-transform group-hover:scale-105"
            />
            <span class="text-xl font-bold tracking-tight">ETS2LA</span>
          </a>

          <!-- 桌面端导航 -->
          <div class="hidden md:flex items-center gap-6">
            <a
              v-for="link in navLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {{ link.label }}
            </a>
            <Dialog>
              <DialogTrigger as-child>
                <button class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  下载
                </button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <CardTitle>选择下载方式</CardTitle>
                </DialogHeader>
                <p class="text-sm text-muted-foreground mt-2">
                  请选择你想使用的下载源：
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <a
                    href="https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist/-/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
                  >
                    <div class="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Github class="size-6" />
                    </div>
                    <div class="text-center">
                      <h4 class="font-semibold group-hover:text-primary transition-colors">CNB 镜像</h4>
                      <p class="text-xs text-muted-foreground mt-1">国内镜像，下载更快</p>
                    </div>
                  </a>
                  <a
                    href="https://github.com/ETS2LA/ETS2LA/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
                  >
                    <div class="p-3 rounded-xl bg-foreground/5 text-foreground">
                      <Github class="size-6" />
                    </div>
                    <div class="text-center">
                      <h4 class="font-semibold group-hover:text-primary transition-colors">GitHub</h4>
                      <p class="text-xs text-muted-foreground mt-1">官方仓库</p>
                    </div>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger as-child>
                <button class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  社区
                </button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <CardTitle>选择社区平台</CardTitle>
                </DialogHeader>
                <p class="text-sm text-muted-foreground mt-2">
                  请选择你想加入的社区：
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <a
                    href="https://www.kookapp.cn/app/invite/VZaUPP"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
                  >
                    <div class="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                      <MessageCircle class="size-6" />
                    </div>
                    <div class="text-center">
                      <h4 class="font-semibold group-hover:text-primary transition-colors">Kook</h4>
                      <p class="text-xs text-muted-foreground mt-1">国内社区，交流更方便</p>
                    </div>
                  </a>
                  <a
                    href="https://ets2la.com/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
                  >
                    <div class="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <MessageCircle class="size-6" />
                    </div>
                    <div class="text-center">
                      <h4 class="font-semibold group-hover:text-primary transition-colors">Discord</h4>
                      <p class="text-xs text-muted-foreground mt-1">官方社区</p>
                    </div>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <!-- 桌面端功能按钮 -->
          <div class="hidden md:flex items-center gap-4">
            <Announcement />
            <ThemeToggle />
            <a
              href="https://ets2la.com/discord"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Discord"
            >
              <MessageCircle class="size-5" />
            </a>
          </div>

          <!-- 移动端菜单按钮 -->
          <button
            class="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="菜单"
          >
            <Menu v-if="!mobileMenuOpen" class="size-6" />
            <X v-else class="size-6" />
          </button>
        </div>

        <!-- 移动端菜单 -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="mobileMenuOpen"
            class="md:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-4"
          >
            <a
              v-for="link in navLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              {{ link.label }}
              <ExternalLink class="size-3" />
            </a>
            <Dialog>
              <DialogTrigger as-child>
                <button class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  下载
                  <ExternalLink class="size-3" />
                </button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <CardTitle>选择下载方式</CardTitle>
                </DialogHeader>
                <p class="text-sm text-muted-foreground mt-2">
                  请选择你想使用的下载源：
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <a
                    href="https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all"
                  >
                    <div class="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Github class="size-6" />
                    </div>
                    <div class="text-center">
                      <h4 class="font-semibold group-hover:text-primary transition-colors">CNB 镜像</h4>
                      <p class="text-xs text-muted-foreground mt-1">国内镜像，下载更快</p>
                    </div>
                  </a>
                  <a
                    href="https://github.com/ETS2LA/ETS2LA/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all"
                  >
                    <div class="p-3 rounded-xl bg-foreground/5 text-foreground">
                      <Github class="size-6" />
                    </div>
                    <div class="text-center">
                      <h4 class="font-semibold group-hover:text-primary transition-colors">GitHub</h4>
                      <p class="text-xs text-muted-foreground mt-1">官方仓库</p>
                    </div>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger as-child>
                <button class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  社区
                  <ExternalLink class="size-3" />
                </button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <CardTitle>选择社区平台</CardTitle>
                </DialogHeader>
                <p class="text-sm text-muted-foreground mt-2">
                  请选择你想加入的社区：
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <a
                    href="https://www.kookapp.cn/app/invite/VZaUPP"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all"
                  >
                    <div class="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                      <MessageCircle class="size-6" />
                    </div>
                    <div class="text-center">
                      <h4 class="font-semibold group-hover:text-primary transition-colors">Kook</h4>
                      <p class="text-xs text-muted-foreground mt-1">国内社区，交流更方便</p>
                    </div>
                  </a>
                  <a
                    href="https://ets2la.com/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all"
                  >
                    <div class="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <MessageCircle class="size-6" />
                    </div>
                    <div class="text-center">
                      <h4 class="font-semibold group-hover:text-primary transition-colors">Discord</h4>
                      <p class="text-xs text-muted-foreground mt-1">官方社区</p>
                    </div>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <div class="flex items-center gap-4 pt-4 border-t">
              <Announcement />
              <ThemeToggle />
            </div>
          </div>
        </Transition>
      </nav>
    </header>

    <!-- Hero 区域 -->
    <section class="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        <TextGenerateEffect words="ETS2LA 中文站" :class="''" />
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
        <TextGenerateEffect words="欢迎来到 ETS2LA 的中文站点。这是一个为 SCS 卡车模拟器带来自动驾驶技术的项目。如需前往官方站点，请" :class="''" />
      </p>
      <a
        href="https://ets2la.com/"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <TextGenerateEffect words="点击这里" :class="''" />
        <ExternalLink class="size-4" />
      </a>
    </section>

    <!-- 功能入口卡片 -->
    <section class="relative z-10 mx-auto max-w-6xl px-6 pb-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          v-for="card in featureCards"
          :key="card.title"
          :href="card.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative flex items-center gap-4 p-5 rounded-2xl border bg-card text-card-foreground hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
        >
          <div class="flex-1">
            <h3 class="font-semibold mb-1 group-hover:text-primary transition-colors">{{ card.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ card.description }}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
        <Dialog>
          <DialogTrigger as-child>
            <div class="group relative flex items-center gap-4 p-5 rounded-2xl border bg-card text-card-foreground hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5 cursor-pointer">
              <div class="flex-1">
                <h3 class="font-semibold mb-1 group-hover:text-primary transition-colors">下载中心</h3>
                <p class="text-sm text-muted-foreground">使用国内镜像快速完成插件/软件的下载</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <CardTitle>选择下载方式</CardTitle>
            </DialogHeader>
            <p class="text-sm text-muted-foreground mt-2">
              请选择你想使用的下载源：
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <a
                href="https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist/releases"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
              >
                <div class="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Github class="size-6" />
                </div>
                <div class="text-center">
                  <h4 class="font-semibold group-hover:text-primary transition-colors">CNB 镜像</h4>
                  <p class="text-xs text-muted-foreground mt-1">国内镜像，下载更快</p>
                </div>
              </a>
              <a
                href="https://github.com/ETS2LA/ETS2LA/releases"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
              >
                <div class="p-3 rounded-xl bg-foreground/5 text-foreground">
                  <Github class="size-6" />
                </div>
                <div class="text-center">
                  <h4 class="font-semibold group-hover:text-primary transition-colors">GitHub</h4>
                  <p class="text-xs text-muted-foreground mt-1">官方仓库</p>
                </div>
              </a>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger as-child>
            <div class="group relative flex items-center gap-4 p-5 rounded-2xl border bg-card text-card-foreground hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5 cursor-pointer">
              <div class="flex-1">
                <h3 class="font-semibold mb-1 group-hover:text-primary transition-colors">社区支持</h3>
                <p class="text-sm text-muted-foreground">加入社区，获取帮助并分享你的想法</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <CardTitle>选择社区平台</CardTitle>
            </DialogHeader>
            <p class="text-sm text-muted-foreground mt-2">
              请选择你想加入的社区：
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <a
                href="https://www.kookapp.cn/app/invite/VZaUPP"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
              >
                <div class="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                  <MessageCircle class="size-6" />
                </div>
                <div class="text-center">
                  <h4 class="font-semibold group-hover:text-primary transition-colors">Kook</h4>
                  <p class="text-xs text-muted-foreground mt-1">国内社区，交流更方便</p>
                </div>
              </a>
              <a
                href="https://ets2la.com/discord"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex flex-col items-center gap-3 p-5 rounded-xl border bg-card hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-black/5"
              >
                <div class="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <MessageCircle class="size-6" />
                </div>
                <div class="text-center">
                  <h4 class="font-semibold group-hover:text-primary transition-colors">Discord</h4>
                  <p class="text-xs text-muted-foreground mt-1">官方社区</p>
                </div>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>

    <!-- 更新&新闻 -->
    <section v-if="false" class="relative z-10 mx-auto max-w-6xl px-6 pb-16">
      <NewsUpdate />
    </section>

    <!-- 界面预览画廊 -->
    <section v-if="false" class="relative z-10 mx-auto max-w-6xl px-6 pb-16">
      <div class="rounded-3xl border bg-card overflow-hidden">
        <div class="px-6 py-4 border-b bg-muted/30">
          <h2 class="text-xl font-semibold">界面预览</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Dialog v-for="img in previewImages" :key="img.src">
              <DialogTrigger as-child>
                <div class="group relative aspect-video rounded-xl overflow-hidden cursor-zoom-in border">
                  <img
                    :src="`${imgBase}/${img.src}`"
                    :alt="img.label"
                    class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="text-white font-medium">{{ img.label }}</span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[90vw] p-0 bg-background border max-w-[95vw]">
                <img
                  :src="`${imgBase}/${img.src}`"
                  :alt="img.label"
                  class="w-full h-auto rounded-lg"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>

    <!-- 赞助支持 -->
    <section v-if="false" class="relative z-10 mx-auto max-w-6xl px-6 pb-16">
      <div class="rounded-3xl border bg-card p-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold mb-2">赞助支持</h2>
          <p class="text-muted-foreground">支持 ETS2LA 国内镜像站的持续运行</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 方案一 -->
          <Dialog>
            <DialogTrigger as-child>
              <div class="group p-6 rounded-2xl border bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-black/5">
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-xl bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coffee">
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                      <line x1="6" x2="6" y1="2" y2="4" />
                      <line x1="10" x2="10" y1="2" y2="4" />
                      <line x1="14" x2="14" y1="2" y2="4" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold">给晚安买杯咖啡</h3>
                    <p class="text-sm text-muted-foreground">可在文档站中添加赞助人信息</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground group-hover:text-primary transition-colors">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent class="sm:max-w-md">
              <DialogHeader>
                <CardTitle>给晚安买杯咖啡</CardTitle>
              </DialogHeader>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="flex flex-col items-center gap-2">
                  <img src="/sponsored/9-vx.png" alt="微信支付" class="w-full rounded-lg border" />
                  <span class="text-sm font-medium">微信支付</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <img src="/sponsored/9-alipay.jpg" alt="支付宝" class="w-full rounded-lg border" />
                  <span class="text-sm font-medium">支付宝</span>
                </div>
              </div>
              <div class="mt-4 p-4 rounded-xl bg-muted text-sm text-center">
                <p>赞助时请备注<span class="font-bold">昵称</span>，以便我们及时为您在文档站中添加信息</p>
              </div>
            </DialogContent>
          </Dialog>

          <!-- 方案二 -->
          <Dialog>
            <DialogTrigger as-child>
              <div class="group p-6 rounded-2xl border bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-black/5">
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold">可视化加速访问</h3>
                    <p class="text-sm text-muted-foreground">使用单独域名访问，体验极速加速</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground group-hover:text-primary transition-colors">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent class="sm:max-w-sm">
              <DialogHeader>
                <CardTitle>可视化加速访问</CardTitle>
              </DialogHeader>
              <div class="flex flex-col items-center gap-4 mt-4">
                <img src="/sponsored/keshihuajiasuzanzhu.jpg" alt="加速赞助" class="w-full rounded-lg border" />
                <span class="text-sm font-medium">支付宝支付</span>
              </div>
              <div class="mt-4 p-4 rounded-xl bg-muted text-sm text-center">
                <p>赞助时请备注<span class="font-bold">所在省份、昵称以及联系方式</span></p>
                <p class="mt-1">晚安将为您单独开通阿里云机器（三线峰值 200mbps）</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p class="mt-6 text-center text-sm text-muted-foreground">
          如有任何疑问，请联系：<span class="text-primary font-medium">晚安（QQ：1804832964）</span>
        </p>
      </div>
    </section>

    <!-- 服务状态 -->
    <section class="relative z-10 mx-auto max-w-6xl px-6 pb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="rounded-2xl border bg-card p-6">
          <h2 class="text-lg font-semibold mb-4 text-center">服务状态</h2>
          <ServiceStatus api-url="/api/status-page/ets2la" status-page-url="https://uptime.ets2la.cn/status/ets2la" />
        </div>
        <div class="rounded-2xl border bg-card p-6">
          <h2 class="text-lg font-semibold mb-4 text-center">机器状态</h2>
          <MachineStatus node-api-base="https://node.ets2la.cn" />
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="relative z-10 border-t bg-muted/30">
      <div class="mx-auto max-w-6xl px-6 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div class="flex items-center gap-2 flex-wrap justify-center">
            <span>由</span>
            <a href="https://beian.aliyun.com/" target="_blank" rel="noopener noreferrer" class="hover:underline">阿里云</a>
            <span>提供域名备案，由</span>
            <a href="https://cloud.tencent.com/product/cdn" target="_blank" rel="noopener noreferrer" class="hover:underline">腾讯云</a>
            <span>提供 CDN 加速</span>
          </div>
          <div class="flex items-center gap-3 flex-wrap justify-center">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="hover:underline">苏ICP备2025160641号-3</a>
            <span>|</span>
            <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32120202010796" target="_blank" rel="noopener noreferrer" class="hover:underline">苏公网安备32120202010796号</a>
          </div>
          <div class="text-center md:text-right">
            由 <a href="https://goodnightan.com" target="_blank" rel="noopener noreferrer" class="underline">晚安</a> 搭建与运营
          </div>
        </div>
      </div>
    </footer>
  </main>
</template>

<style scoped></style>
