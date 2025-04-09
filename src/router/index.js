import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import TravelManageView from '@/views/TravelManageView.vue'
import MainLayout from '@/layout/MainLayout.vue'
import InputExpenseView from '@/views/InputExpenseView.vue'
import ListExpenseView from '@/views/ListExpenseView.vue'
import SignUpView from '@/views/SignUpView.vue'

import CreateTravel from '@/views/CreateTravelView.vue'
import InputBudgetView from '@/views/InputBudgetView.vue'
import StatsView from '@/views/StatsView.vue'
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
      { path: 'signup', component: SignUpView },
      { path: 'create', component: CreateTravel},
      { path: 'budget_input', component: InputBudgetView }, // 예산 모으기
      { path: 'stats', component: StatsView }, // 통계
      // { path: 'my_page', component: MyPageView} // 마이 페이지
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
