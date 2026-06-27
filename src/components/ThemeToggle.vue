<template>
  <div class="relative inline-flex items-center">
    <button
      type="button"
      class="relative inline-flex items-center justify-center rounded-md border bg-background px-2.5 py-2 text-foreground shadow-sm hover:bg-muted"
      @click="toggleTheme"
      aria-label="Toggle theme"
    >
      <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  </div>
  
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useColorMode, usePreferredDark } from '@vueuse/core'
import { computed } from 'vue'

const mode = useColorMode()
const preferredDark = usePreferredDark()
const effectiveDark = computed(() => mode.value === 'dark' || (mode.value === 'auto' && preferredDark.value))

const toggleTheme = () => {
  mode.value = effectiveDark.value ? 'light' : 'dark'
}
</script>

<style scoped></style>