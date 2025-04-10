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
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.collapsed .content {
  margin-left: 70px;
  transition: margin-left 0.3s ease;
}

.expanded .content {
  margin-left: 270px;
  transition: margin-left 0.3s ease;
}

.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .collapsed .content,
  .expanded .content {
    margin-left: 0;
  }
}
</style>
