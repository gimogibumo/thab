import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(false)

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }
  const handleResize = () => {
    if (window.innerWidth <= 1024) {
      isCollapsed.value = false
    } else {
      isCollapsed.value = true
    }
  }
  return { isCollapsed, toggleSidebar }
})
