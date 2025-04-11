<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import TravelCard from '@/components/TravelCard.vue'

const authStore = useAuthStore()
const userEmail = computed(() => authStore.user?.email)

const activeTab = ref('ongoing')
const today = new Date()
today.setHours(0, 0, 0, 0)
const travelCards = ref([])

const calculateTravelStatus = (card) => {
  const startDate = new Date(card.startDate)
  const endDate = new Date(card.endDate)

  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((startDate - today) / (1000 * 60 * 60 * 24))

  if (today >= startDate && today <= endDate) {
    card.status = 'ongoing'
    card.dDay = '여행 중'
  } else if (today > endDate) {
    card.status = 'past'
    card.dDay = '완료'
  } else {
    card.status = 'upcoming'
    card.dDay = `D-${diffDays}`
  }
}

const filteredAndSortedCards = computed(() => {
  return travelCards.value
    .filter((c) => c.status === activeTab.value)
    .sort((a, b) => {
      if (activeTab.value === 'upcoming') {
        return new Date(a.startDate) - new Date(b.startDate)
      }
      if (activeTab.value === 'past') {
        return new Date(b.endDate) - new Date(a.endDate)
      }
      return 0
    })
})

const fetchTravelCards = async () => {
  try {
    const [travelRes, expenseRes] = await Promise.all([
      axios.get('http://localhost:3000/travel'),
      axios.get('http://localhost:3000/expense')
    ])

    const travels = travelRes.data.filter((t) => t.userEmail === userEmail.value)
    const expenses = expenseRes.data

    travelCards.value = travels.map((card) => {
      const relatedExpenses = expenses.filter((e) => e.travelId === card.id)
      const totalSpent = relatedExpenses.reduce((sum, e) => sum + (e.moneyByWon || 0), 0)

      calculateTravelStatus(card)

      return reactive({
        ...card,
        totalSpent
      })
    })
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error)
  }
}

const changeTab = (tab) => {
  activeTab.value = tab
}

onMounted(() => {
  fetchTravelCards()
})
</script>
<template>
  <div class="content">
    <div class="page-title">여행관리</div>
    <div class="tabs">
      <div
        v-for="tab in ['ongoing', 'upcoming', 'past']"
        :key="tab"
        class="tab"
        :class="{ active: activeTab === tab }"
        @click="changeTab(tab)"
      >
        {{ tab === 'ongoing' ? '여행 중' : tab === 'upcoming' ? '예정된 여행' : '지난 여행' }}
      </div>
    </div>
    <div
      class="travel-card"
      :class="{
        'two-column': activeTab !== 'ongoing',
        'one-column': activeTab === 'ongoing',
      }"
    >
      <TravelCard
        v-for="(card, index) in filteredAndSortedCards"
        :key="card.id"
        v-bind="card"
        :status="card.status"
        :dDay="card.dDay"
        :income="card.income"
        :size="activeTab === 'ongoing' ? 'large' : 'small'"
      />
    </div>
    <router-link to="/create" class="fab">
      <span class="plus">+</span>
    </router-link>
  </div>
</template>
<style scoped>
.content {
  padding: 3% 5%;
  color: #0F2E47;
}
.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
  color: #0F2E47;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 20px;
  border: 1px solid #205781;
  border-radius: 5px;
  background-color: #fff;
  color: #205781;
  cursor: pointer;
  text-align: center;
  font-weight: 500;
}

.tab.active {
  background-color: #205781;
  color: white;
}

.travel-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  width: 100%;
}

.travel-card.one-column {
  grid-template-columns: 1fr;
}

.travel-card.two-column {
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
}

.fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #205781;
  color: white;
  font-size: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.fab:hover {
  background-color: #174360;
  transform: scale(1.1);
}

.plus {
  line-height: 1;
}

@media (max-width: 768px) {
  .travel-card {
    grid-template-columns: 1fr !important;
  }
}
</style>
