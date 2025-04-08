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
    const response = await axios.get('http://localhost:3000/trips')
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
  <div class="content">TravelMavageView</div>
</template>
