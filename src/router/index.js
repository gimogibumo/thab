import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layout/MainLayout.vue'

import MainView from '@/views/MainView.vue'
import TravelManageView from '@/views/TravelManageView.vue'
import InputExpenseView from '@/views/InputExpenseView.vue'
import ListExpenseView from '@/views/ListExpenseView.vue'
import CreateTravel from '@/views/CreateTravelView.vue'
import TravelManageDetail from '@/views/TravelManageDetail.vue'
import SignUpView from '@/views/SignUpView.vue'

import InputBudgetView from '@/views/InputBudgetView.vue'
import StatsView from '@/views/StatsView.vue'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
// import { useAuthStore } from '@/stores/auth'
// import MyPageView from '@/views/MyPageView.vue'

const routes = [
  {
    path: '/',
    name: 'MainLayout',
    component: MainLayout,
    children: [
      { path: '', component: MainView },
      { path: 'travel_manage', component: TravelManageView },
      { path: 'expense_input', component: InputExpenseView },
      { path: 'expense_list', component: ListExpenseView },
      { path: 'create', component: CreateTravel },
      { path: '/travel_manage/:id', component: TravelManageDetail },
      { path: 'signup', component: SignUpView },
      { path: 'create', component: CreateTravel },
      { path: 'budget_input', component: InputBudgetView }, // 예산 모으기
      { path: 'stats', component: StatsView }, // 통계
      // { path: 'my_page', component: MyPageView} // 마이 페이지
    ],
  },
  {
    path: '/login',
    name: 'LoginLayout',
    component: LoginView,
    meta: { public: true },
  },
  { path: '/signup', name: 'SignUpLayout', component: SignUpView, meta: { public: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
// const authStore = useAuthStore()
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // const publicPages = ['/login', '/signup']
  const isPublic = to.matched.some((record) => record.meta.public)
  // const authRequired = !publicPages.includes(to.path)
  const authRequired = !isPublic

  if (authRequired && !authStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
export default router
