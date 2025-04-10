<template>
  <div :class="['sidebar', isCollapsed ? 'collapsed' : 'expanded']">
    <div v-if="!isCollapsed" class="text-center py-4 border-bottom">
      <router-link to="/" class="fs-2 fw-bold text-white text-decoration-none d-inline-block">
        THAB
      </router-link>
      <div class="profile-circle mx-auto mt-3"></div>
      <div class="mt-2 fw-semibold" v-text="userInfo.name"></div>
      <div class="text-muted small">도쿄 여행 중 (2/5)</div>
    </div>

    <div class="flex-grow-1 overflow-auto">
      <div class="px-3 py-2">
        <div v-for="category in navCategories" :key="category.name">
          <div class="text-muted px-3 fw-bold" v-if="!isCollapsed">{{ category.name }}</div>
          <div v-for="item in category.items" :key="item.name" class="ms-3">
            <router-link :to="item.path" class="nav-btn d-flex align-items-center">
              <i :class="item.icon"></i>
              <span v-if="!isCollapsed" class="ms-2">{{ item.name }}</span>
            </router-link>
          </div>
          <hr v-if="!isCollapsed" class="my-1" />
        </div>
      </div>
    </div>

    <div class="px-3 mb-3 d-flex justify-content-between">
      <button v-if="!isCollapsed" class="btn btn-danger w-75" @click="loggingOut">
        <i class="bi bi-box-arrow-right"></i> <span v-if="!isCollapsed">로그아웃</span>
      </button>
      <button class="btn btn-light" @click="toggleSidebar">
        <i :class="isCollapsed ? 'bi bi-arrow-bar-right' : 'bi bi-arrow-bar-left'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
// import router from '@/router'

const authStore = useAuthStore()
const userInfo = authStore.user
console.log(userInfo.name)
const isCollapsed = ref(false)
const toggled = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  toggled.value = !toggled.value
  console.log(isCollapsed.value)
}
const loggingOut = () => {
  authStore.logout()
  window.location.reload()
}
const handleResize = () => {
  if (window.innerWidth <= 1024 || toggled.value) {
    isCollapsed.value = true
    console.log('phonesize')
  } else {
    isCollapsed.value = false
    console.log('originalsize')
  }
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
watch(isCollapsed, (newVal) => {
  const contentElements = document.querySelectorAll("[class^='content']")
  contentElements.forEach((el) => {
    el.style.marginLeft = newVal ? '80px' : '270px'
  })
})

const navCategories = [
  {
    name: '일정 관리',
    items: [{ name: '여행', path: '/travel_manage', icon: 'bi bi-square' }],
  },
  {
    name: '가계부',
    items: [
      { name: '지출 입력', path: '/expense_input', icon: 'bi bi-plus' },
      { name: '지출 내역', path: '/expense_list', icon: 'bi bi-list' },
      { name: '수입 입력', path: '/budget_input', icon: 'bi bi-graph-up' },
    ],
  },
  {
    name: '리포트',
    items: [{ name: '통계', path: '/stats', icon: 'bi bi-bar-chart' }],
  },
]
</script>

<style scoped>
.sidebar {
  width: 270px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  background-color: #8b6f5c;
  transition: width 0.3s ease;
}

.collapsed {
  width: 70px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  row-gap: 8px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 0px;
  padding-right: 0px;
  margin: 0px 0;
  background-color: transparent;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background-color: #8b6f5c;
  border-radius: 6px;
}

.profile-circle {
  width: 80px;
  height: 80px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #8b6f5c;
}

.collapsed .nav-btn span {
  display: none;
}

.collapsed .text-muted {
  display: none;
}

.collapsed .profile-circle {
  display: none;
}

.content {
  transition: 0.3s ease;
}

.sidebar::-webkit-scrollbar {
  display: none;
}
</style>
