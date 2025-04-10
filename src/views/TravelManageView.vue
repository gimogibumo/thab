<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import TravelCard from '@/components/TravelCard.vue'

const activeTab = ref('upcoming')
const today = new Date()
today.setHours(0, 0, 0, 0)

const travelCards = reactive([])

const calculateTravelStatus = (card) => {
  const startDate = new Date(card.startDate)
  const endDate = new Date(card.endDate)

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
  return travelCards
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
    const response = await axios.get('http://localhost:3000/travel')
    response.data.forEach((card) => {
      calculateTravelStatus(card)
      travelCards.push(card)
    })
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error)
  }
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
        @click="activeTab = tab"
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
}
.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 20px;
  border: 1px solid #a47764;
  border-radius: 5px;
  background-color: #fff;
  color: #a47764;
  cursor: pointer;
  text-align: center;
}

.tab.active {
  background-color: #a47764;
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #a47764;
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
  background-color: #8b5e4b;
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
