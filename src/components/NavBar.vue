<template>
  <div :class="['sidebar', isCollapsed ? 'collapsed' : 'expanded']">
    <div v-if="!isCollapsed" class="text-center py-4 border-bottom">
      <router-link to="/" class="fs-2 fw-bold text-white text-decoration-none d-inline-block">
        THAB
      </router-link>
      <div class="profile-circle mx-auto mt-3"></div>
      <div class="mt-2 fw-semibold" v-text="userInfo.name"></div>
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
      <button v-if="!isCollapsed" class="btn logout-btn btn-light w-75" @click="loggingOut">
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
  background-color: #0F2E47; /* 진한 네이비 */
  transition: width 0.3s ease;
  overflow-y: auto;
  z-index: 100000;
  color: white; /* 기본 텍스트 색상 흰색으로 */
}

.collapsed {
  width: 70px;
}

.nav-btn {
  color: white;
  text-decoration: none;
  padding: 12px 0 12px 3px;
  transition: all 0.3s ease;
}
.nav-btn:hover {
  background-color: #205781; /* 푸른 회색 (hover 색상) */
  border-radius: 6px;
  color: white;
}

.profile-circle {
  width: 80px;
  height: 80px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #0F2E47;
}

.text-muted {
  color: #ffffff !important; /* 카테고리 이름도 흰색으로 덮어쓰기 */
}

.collapsed .nav-btn span,
.collapsed .text-muted,
.collapsed .profile-circle {
  display: none;
}

.sidebar::-webkit-scrollbar {
  display: none;
}

.logout-btn {
  background-color: #ffffff;
  color: #0F2E47;
}
.logout-btn:hover {
  background-color: #205781;
  color: white;
}
</style>
