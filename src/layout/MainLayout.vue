<template>
  <div :class="['main-layout', isCollapsed ? 'collapsed' : 'expanded']">
    <NavBar />
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSidebarStore } from '@/stores/sidebar'
import NavBar from '@/components/NavBar.vue'
import Header from '@/components/Header.vue'

const sidebarStore = useSidebarStore()
const isCollapsed = computed(() => sidebarStore.isCollapsed)
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.collapsed .content {
  margin-left: 80px;
  transition: margin-left 0.3s ease;
}

.expanded .content {
  margin-left: 270px;
  transition: margin-left 0.3s ease;
}

.content {
  flex-grow: 1;
  /* padding: 20px; */
  overflow-y: auto;
  padding: 0px;
}

body,
button,
input,
textarea {
  font-family:
    'Pretendard Variable',
    Pretendard,
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    sans-serif;
}

@media (max-width: 1024px) {
  .collapsed .content,
  .expanded .content {
    margin-left: 0;
  }
}
</style>
