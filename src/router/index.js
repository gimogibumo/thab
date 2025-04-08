import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import TravelManageView from '@/views/TravelManageView.vue'
import MainLayout from '@/layout/MainLayout.vue'
import InputExpenseView from '@/views/InputExpenseView.vue'
import ListExpenseView from '@/views/ListExpenseView.vue'
import InputBudgetView from '@/views/InputBudgetView.vue'

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
      { path: 'budget_input', component: InputBudgetView },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
