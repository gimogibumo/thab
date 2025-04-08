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
    const response = await axios.get('http://localhost:3000/travelCards')
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
    <!-- 공통 부모 컨테이너 -->
    <div class="content-container">
      <!-- 탭 -->
      <div class="tabs">
        <div
          class="tab"
          :class="{ active: activeTab === 'ongoing' }"
          @click="activeTab = 'ongoing'"
        >
          여행 중
        </div>
        <div
          class="tab"
          :class="{ active: activeTab === 'upcoming' }"
          @click="activeTab = 'upcoming'"
        >
          예정된 여행
        </div>
        <div class="tab" :class="{ active: activeTab === 'past' }" @click="activeTab = 'past'">
          지난 여행
        </div>
      </div>

      <!-- 카드 리스트 -->
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
    </div>
  </div>
</template>

<style scoped>
.content-container {
  padding: 0 20px;
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
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-left: 0;
  margin-right: auto;
}

.travel-card.one-column .card {
  flex: 1 1 100%;
  max-width: 100%;
}

.travel-card.two-column .card {
  flex: 1 1 calc(50% - 20px);
  max-width: calc(50% - 20px);
}
@media (max-width: 768px) {
  .travel-card.two-column .card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>
