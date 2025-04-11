<template>
  <div class="card" :class="size">
    <div class="card-header" :style="{ backgroundImage: `url(${cover})` }">
      <span class="d-day">{{ dDay }}</span>
      <div class="text-overlay">
        <p class="trip-info">{{ title }}</p>
        <p class="trip-dates">{{ startDate }} - {{ endDate }}</p>
      </div>
    </div>
    <div v-if="showProgress" class="budget-progress">
      <div class="progress-label">
        <span>{{ progressLabel }}</span>
        <span class="progress-percentage">{{ progress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    <div class="budget-info">
      <div class="budget-item">
        <span class="label">{{ budgetLabel1 }}</span>
        <span class="value">{{ mainBudget.toLocaleString() }}원</span>
      </div>
      <div class="budget-item">
        <span class="label">{{ budgetLabel2 }}</span>
        <span class="value">{{ subAmount.toLocaleString() }}원</span>
      </div>
    </div>
    <div class="button-container">
      <button class="manage-button" @click="goToManagePage">여행 관리하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  coverImage: String,
  destination: String,
  id: String,
  title: String,
  startDate: String,
  endDate: String,
  totalBudget: Number,
  income: Number,
  totalSpent: Number,
  status: String,
  dDay: String,
  size: {
    type: String,
    default: 'small',
  },
})

// ⭐ 동적 커버 이미지 설정
const cover = ref(props.coverImage)

onMounted(async () => {
  if (!cover.value && props.destination) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '49696568-789720e76db658f1dff80e68c', // ← 너의 API 키로 교체!
          q: props.destination,
          image_type: 'photo',
          per_page: 5,
          orientation: 'horizontal',
        }
      })
      const hits = response.data?.hits
      if (hits && hits.length > 0) {
        cover.value = hits[0].webformatURL
      }
    } catch (error) {
      console.error('이미지 불러오기 실패:', error)
    }
  }
})

const budgetLabel1 = computed(() => {
  if (props.status === 'ongoing' || props.status === 'past') return '총 예산'
  if (props.status === 'upcoming') return '목표 예산'
  return ''
})

const budgetLabel2 = computed(() => {
  if (props.status === 'ongoing') return '현재 지출'
  if (props.status === 'past') return '총 지출'
  if (props.status === 'upcoming') return '저축 금액'
  return ''
})

const mainBudget = computed(() => {
  if (props.status === 'ongoing' || props.status === 'past') return props.income
  if (props.status === 'upcoming') return props.totalBudget
  return 0
})

const subAmount = computed(() => {
  if (props.status === 'upcoming') return props.income
  if (props.status === 'ongoing' || props.status === 'past') return props.totalSpent
  return 0
})

const progressLabel = computed(() => {
  if (props.status === 'ongoing') return '예산 대비 지출'
  if (props.status === 'upcoming') return '목표 예산 달성률'
  return ''
})

const progress = computed(() => {
  if (props.status === 'upcoming') {
    return props.totalBudget ? Math.round((props.income / props.totalBudget) * 100) : 0
  }
  if (props.status === 'ongoing') {
    return props.income ? Math.round((props.totalSpent / props.income) * 100) : 0
  }
  return 0
})

const showProgress = computed(() => props.status !== 'past')

const router = useRouter()
const goToManagePage = () => {
  console.log('여행 ID:', props.id)
  router.push(`/travel_manage/${props.id}`)
}
</script>
<style scoped>
.card {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 450px;
}

.card.small {
  max-width: 100%;
  min-height: 600px;
}

.card.large {
  max-width: 80%;
  min-height: 500px;
}

.card-header {
  position: relative;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  color: white;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1;
}

.d-day {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #ffffff;
  color: #a47764;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  z-index: 2;
}

.text-overlay {
  position: relative;
  z-index: 2;
  text-align: left;
  margin: 10px;
}

.trip-info {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.trip-dates {
  font-size: 14px;
  margin: 5px 0 0;
  color: #ddd;
}

.budget-progress {
  margin: 20px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #888;
  margin-bottom: 5px;
}

.progress-bar {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #a47764;
}

.progress-percentage {
  font-weight: bold;
  font-size: 20px;
  color: #a47764;
}

.budget-info {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 20px;
}

.budget-item {
  text-align: left;
  background-color: #faf7f5;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(50% - 20px);
  max-width: calc(50% - 20px);
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.label {
  display: block;
  padding-bottom: 10px;
  font-size: 14px;
  color: #888;
}

.value {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1.5px;
  display: block;
  word-wrap: break-word;
  word-break: keep-all;
}

.button-container {
  padding: 10px 20px 20px 20px;
}

.manage-button {
  height: 56px;
  width: 100%;
  padding: 10px;
  background-color: #a47764;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
