<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import Announcement from '@/components/Announcement.vue'
import { FlipCard } from '@/components/ui/flip-card'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle as UIDialogTitle } from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { StarsBackground } from '@/components/ui/bg-stars'
import ServiceStatus from '@/components/ServiceStatus.vue'
import MachineStatus from '@/components/MachineStatus.vue'
import { Dock, DockIcon, DockSeparator } from '@/components/ui/dock'
import { Heart, Info, Coffee, Globe } from 'lucide-vue-next'
import { computed, ref, onMounted } from 'vue'
import { useColorMode, usePreferredDark } from '@vueuse/core'

// 根据当前主题（深色/浅色/系统）切换界面预览图片的目录
const mode = useColorMode()
const preferredDark = usePreferredDark()
const isDark = computed(() => mode.value === 'dark' || (mode.value === 'auto' && preferredDark.value))
const imgBase = computed(() => (isDark.value ? '/show/flip_card/black' : '/show/flip_card/white'))

// Uptime Kuma 状态页 iframe 加载回退（防止跨域嵌入被拒绝）
const statusIframeLoaded = ref(false)
const statusIframeFallback = ref(false)
onMounted(() => {
  // 若在限定时间内未触发 onload，则视为被拒绝或阻塞，显示回退内容
  setTimeout(() => {
    if (!statusIframeLoaded.value) {
      statusIframeFallback.value = true
    }
  }, 3000)
})
</script>

<template>
  <main class="relative min-h-screen bg-background text-foreground overflow-hidden">
    <StarsBackground
      :factor="0.05"
      :speed="50"
      :star-color="isDark ? '#ffffff' : '#000000'"
      :background-class="isDark ? 'bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]' : 'bg-background'"
      class="absolute inset-0 z-0 pointer-events-none"
    />
    <section class="mx-auto max-w-[130rem] px-8 py-20 flex flex-col items-center text-center">
      <div class="w-full flex justify-end mb-6">
        <Dock class="mb-0">
          <!-- 公告组件 -->
          <DockIcon>
            <div class="size-full flex items-center justify-center">
              <Announcement />
            </div>
          </DockIcon>
          <DockSeparator />
          <!-- 背景切换按钮（主题切换） -->
          <DockIcon>
            <div class="size-full flex items-center justify-center">
              <ThemeToggle />
            </div>
          </DockIcon>
          <DockSeparator />
          <!-- GitHub 链接（使用本地 SVG） -->
          <DockIcon>
            <a
              href="https://github.com/ETS2LA/Euro-Truck-Simulator-2-Lane-Assist"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="size-full flex items-center justify-center"
            >
              <img src="/icon/github.svg" alt="GitHub" class="size-full dark:invert" />
            </a>
          </DockIcon>
          <!-- Discord 链接（使用本地 SVG） -->
          <DockIcon>
            <a
              href="htttps://ets2la.com/discrd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              class="size-full flex items-center justify-center"
            >
              <img src="/icon/discord.svg" alt="Discord" class="size-full dark:invert" />
            </a>
          </DockIcon>
        </Dock>
      </div>

      
      <h1 class="text-4xl font-bold tracking-tight mb-4">
        <TextGenerateEffect words="ETS2LA中文站" :class="''" />
      </h1>
      <div class="text-muted-foreground max-w-2xl mb-8">
        <TextGenerateEffect words="欢迎来到我们的中文站点。这只是 ETS2LA 的中国镜像站，如需前往官方站点，请" :class="'inline'" />
        <a href="https://ets2la.com/" target="_blank" rel="noopener noreferrer" class="underline text-primary">
          <TextGenerateEffect words="点击这里" :class="'inline'" />
        </a>
      </div>

      

      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[90rem]">
        <a
          href="https://docs.ets2la.cn"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative block overflow-hidden rounded-xl border bg-card text-card-foreground p-6 flex flex-col justify-center text-center"
        >
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="size-2 scale-100 rounded-lg bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
            <span class="inline-block text-xl font-semibold transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">快速上手</span>
          </div>
          <p class="text-sm text-muted-foreground transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-center">
            查看文档并在数分钟内完成插件/软件的安装。
          </p>
          <div class="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
            <span class="text-xl font-semibold">快速上手</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </a>

        <a
          href="https://download.ets2la.cn/downloads"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative block overflow-hidden rounded-xl border bg-card text-card-foreground p-6 flex flex-col justify-center text-center"
        >
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="size-2 scale-100 rounded-lg bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
            <span class="inline-block text-xl font-semibold transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">下载中心</span>
          </div>
          <p class="text-sm text-muted-foreground transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-center">
            使用国内镜像快速完成插件/软件的下载。
          </p>
          <div class="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
            <span class="text-xl font-semibold">下载中心</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </a>

        <a
          href="https://www.kookapp.cn/app/invite/VZaUPP"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative block overflow-hidden rounded-xl border bg-card text-card-foreground p-6 flex flex-col justify-center text-center"
        >
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="size-2 scale-100 rounded-lg bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
            <span class="inline-block text-xl font-semibold transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">社区支持</span>
          </div>
          <p class="text-sm text-muted-foreground transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-center">
            加入社区，获取帮助并分享你的想法。
          </p>
          <div class="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
            <span class="text-xl font-semibold">社区支持</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>

    <!-- 赞助支持 -->
    <section class="mx-auto max-w-[130rem] px-8 pb-20 flex flex-col items-center text-center relative z-10">
      <div class="mt-10 w-full max-w-[90rem]">
        <Card class="bg-card text-card-foreground overflow-hidden">
          <CardHeader>
            <CardTitle class="flex items-center justify-center gap-2">
              <Heart class="size-6 text-red-500 fill-red-500" />
              赞助支持
            </CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col items-center gap-8">
            <p class="text-muted-foreground text-lg max-w-3xl">
              如果您希望支持 ETS2LA 国内镜像站的持续运行，请考虑以下赞助方案：
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
              <!-- 方案一 -->
              <Dialog>
                <DialogTrigger as-child>
                  <div class="p-8 rounded-2xl border bg-muted/30 flex flex-col items-center gap-4 transition-all hover:bg-muted/50 hover:scale-[1.02] cursor-pointer group">
                    <div class="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary/20 transition-colors">
                      <Coffee class="size-8" />
                    </div>
                    <h4 class="font-bold text-xl">方案一：给晚安买杯咖啡</h4>
                    <p class="text-muted-foreground">可在文档站中添加赞助人信息</p>
                    <div class="mt-2 text-primary font-medium flex items-center gap-2">
                      <span>点击查看赞助码</span>
                      <Info class="size-4" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[600px]">
                  <DialogHeader>
                    <UIDialogTitle>方案一：给晚安买杯咖啡</UIDialogTitle>
                  </DialogHeader>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div class="flex flex-col items-center gap-2">
                      <img src="/sponsored/9-vx.png" alt="微信赞助" class="w-full rounded-lg border shadow-sm" />
                      <span class="text-sm font-medium">微信支付</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                      <img src="/sponsored/9-alipay.jpg" alt="支付宝赞助" class="w-full rounded-lg border shadow-sm" />
                      <span class="text-sm font-medium">支付宝支付</span>
                    </div>
                  </div>
                  <div class="mt-4 p-4 rounded-lg bg-muted text-sm text-center">
                    <p>赞助时请备注<span class="font-bold">昵称</span></p>
                    <p class="mt-1">以便我们及时为您在文档站中添加信息</p>
                  </div>
                </DialogContent>
              </Dialog>

              <!-- 方案二 -->
              <Dialog>
                <DialogTrigger as-child>
                  <div class="p-8 rounded-2xl border bg-muted/30 flex flex-col items-center gap-4 transition-all hover:bg-muted/50 hover:scale-[1.02] cursor-pointer group">
                    <div class="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 group-hover:bg-yellow-500/20 transition-colors">
                      <Globe class="size-8" />
                    </div>
                    <h4 class="font-bold text-xl">方案二：可视化加速访问</h4>
                    <p class="text-muted-foreground">使用单独域名访问环境可视化，体验极速加速</p>
                    <div class="mt-2 text-yellow-600 dark:text-yellow-400 font-medium flex items-center gap-2">
                      <span>点击查看赞助码</span>
                      <Info class="size-4" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[400px]">
                  <DialogHeader>
                    <UIDialogTitle>方案二：可视化加速访问</UIDialogTitle>
                  </DialogHeader>
                  <div class="flex flex-col items-center gap-4 mt-4">
                    <img src="/sponsored/keshihuajiasuzanzhu.jpg" alt="加速赞助" class="w-full rounded-lg border shadow-sm" />
                    <span class="text-sm font-medium">支付宝支付</span>
                  </div>
                  <div class="mt-4 p-4 rounded-lg bg-muted text-sm text-center">
                    <p>赞助时请备注<span class="font-bold">所在省份、昵称以及联系方式</span></p>
                    <p class="mt-1">晚安将为您单独开通阿里云机器（三线峰值 200mbps）</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div class="flex flex-col items-center gap-2">
              <p class="text-sm text-muted-foreground">
                如有任何疑问，请联系提供者：<span class="text-primary font-bold">晚安（QQ：1804832964），如需其他金额请手动联系晚安</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

      <!-- Flip Card Gallery moved below feature row -->
      <div class="mt-12 w-full max-w-[90rem] relative z-10">
        <h2 class="text-2xl font-semibold mb-4 text-center">界面预览</h2>
        <div class="grid grid-cols-2 gap-8 justify-items-center">
          <FlipCard class="h-94 w-[42rem]" :back-class="isDark ? 'bg-black/80' : 'bg-white'">
            <template #default>
              <Dialog>
                <DialogTrigger as-child>
                  <img :src="`${imgBase}/home.png`" alt="home" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 cursor-zoom-in" />
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/home.png`" alt="home preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
            <template #back>
              <Dialog>
                <DialogTrigger as-child>
                  <div class="size-full flex items-center justify-center cursor-zoom-in">
                    <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">主页</span>
                  </div>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/home.png`" alt="home preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
          </FlipCard>
          
          <FlipCard class="h-94 w-[42rem]" :back-class="isDark ? 'bg-black/80' : 'bg-white'">
            <template #default>
              <Dialog>
                <DialogTrigger as-child>
                  <img :src="`${imgBase}/visualization.png`" alt="visualization" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 cursor-zoom-in" />
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/visualization.png`" alt="visualization preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
            <template #back>
              <Dialog>
                <DialogTrigger as-child>
                  <div class="size-full flex items-center justify-center cursor-zoom-in">
                    <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">可视化</span>
                  </div>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/visualization.png`" alt="visualization preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
          </FlipCard>

          <FlipCard class="h-94 w-[42rem]" :back-class="isDark ? 'bg-black/80' : 'bg-white'">
            <template #default>
              <Dialog>
                <DialogTrigger as-child>
                  <img :src="`${imgBase}/plugins.png`" alt="plugins" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 cursor-zoom-in" />
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/plugins.png`" alt="plugins preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
            <template #back>
              <Dialog>
                <DialogTrigger as-child>
                  <div class="size-full flex items-center justify-center cursor-zoom-in">
                    <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">插件</span>
                  </div>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/plugins.png`" alt="plugins preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
          </FlipCard>

          <FlipCard class="h-94 w-[42rem]" :back-class="isDark ? 'bg-black/80' : 'bg-white'">
            <template #default>
              <Dialog>
                <DialogTrigger as-child>
                  <img :src="`${imgBase}/catalogue.png`" alt="catalogue" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 cursor-zoom-in" />
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/catalogue.png`" alt="catalogue preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
            <template #back>
              <Dialog>
                <DialogTrigger as-child>
                  <div class="size-full flex items-center justify-center cursor-zoom-in">
                    <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">社区插件</span>
                  </div>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/catalogue.png`" alt="catalogue preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
          </FlipCard>

          <FlipCard class="h-94 w-[42rem]" :back-class="isDark ? 'bg-black/80' : 'bg-white'">
            <template #default>
              <Dialog>
                <DialogTrigger as-child>
                  <img :src="`${imgBase}/performance.png`" alt="performance" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 cursor-zoom-in" />
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/performance.png`" alt="performance preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
            <template #back>
              <Dialog>
                <DialogTrigger as-child>
                  <div class="size-full flex items-center justify-center cursor-zoom-in">
                    <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">资源消耗</span>
                  </div>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/performance.png`" alt="performance preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
          </FlipCard>

          <FlipCard class="h-94 w-[42rem]" :back-class="isDark ? 'bg-black/80' : 'bg-white'">
            <template #default>
              <Dialog>
                <DialogTrigger as-child>
                  <img :src="`${imgBase}/settings.png`" alt="settings" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40 cursor-zoom-in" />
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/settings.png`" alt="settings preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
            <template #back>
              <Dialog>
                <DialogTrigger as-child>
                  <div class="size-full flex items-center justify-center cursor-zoom-in">
                    <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">设置</span>
                  </div>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[80vw] max-w-[90vw] p-0 bg-background border">
                  <img :src="`${imgBase}/settings.png`" alt="settings preview" class="w-full h-auto rounded-lg" />
                </DialogContent>
              </Dialog>
            </template>
          </FlipCard>

        </div>
      </div>
    </section>
    
    <!-- 展示视频 -->
    <section class="mx-auto max-w-[130rem] px-8 pb-20 flex flex-col items-center text-center relative z-10">
      <div class="mt-10 w-full max-w-[90rem]">
        <Card class="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>展示视频</CardTitle>
          </CardHeader>
          <CardContent>
            <AspectRatio :ratio="16 / 9" class="w-full">
              <video
                src="/show/video/background.mp4"
                class="size-full rounded-xl border"
                controls
                autoplay
                muted
                loop
                playsinline
              ></video>
            </AspectRatio>
          </CardContent>
        </Card>
      </div>
    </section>
    
    <!-- 状态区块：服务状态 + 机器状态（分两个卡片） -->
    <section class="mx-auto max-w-[130rem] px-8 pb-20 flex flex-col items-center text-center relative z-10">
      <div class="mt-10 w-full max-w-[90rem] space-y-6">
        <Card class="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>服务状态</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceStatus api-url="/api/status-page/ets2la" status-page-url="https://uptime.ets2la.cn/status/ets2la" />
          </CardContent>
        </Card>
        <Card class="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>机器状态</CardTitle>
          </CardHeader>
          <CardContent>
            <MachineStatus node-api-base="https://node.ets2la.cn" />
          </CardContent>
        </Card>
      </div>
    </section>
    
    <!-- 页脚 Footer -->
    <footer class="mx-auto max-w-[130rem] px-8 pb-16 relative z-10 w-full">
      <Card class="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 bg-background/10 text-foreground border backdrop-blur-md">
        <CardContent class="py-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-sm">
            <!-- 左侧：云服务与备案/CDN说明 -->
            <div class="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
              <span>
                该站点由
                <a
                  href="https://beian.aliyun.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:underline"
                >阿里云</a>
                提供域名备案服务，由
                <a
                  href="https://cloud.tencent.com/product/cdn"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:underline"
                >腾讯云</a>
                提供 CDN 加速服务
              </span>
            </div>

            <!-- 中间：备案信息，带跳转 -->
            <div class="flex items-center justify-center gap-3">
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline"
              >
                苏ICP备2025160641号-3
              </a>
              <span class="text-muted-foreground">|</span>
              <a
                href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32120202010796"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline"
              >
                苏公网安备32120202010796号
              </a>
            </div>

            <!-- 右侧：站点运营者说明 -->
            <div class="text-muted-foreground md:text-right text-center">
              国内镜像站所有站点均由
              <a
                href="https://goodnightan.com"
                target="_blank"
                rel="noopener noreferrer"
                class="underline"
              >
                晚安
              </a>
              搭建与运营
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  </main>
  
  
</template>

<style scoped></style>
