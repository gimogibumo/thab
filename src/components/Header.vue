<template>
  <div class="header">
    <!-- 알림 버튼 -->
    <div class="button-wrapper">
      <button class="btn btn-light rounded-circle me-2" @click="toggleNotification">
        <i class="bi bi-bell"></i>
        <span v-if="hasAlert" class="badge-dot"></span>
      </button>

      <!-- 알림 드롭다운 -->
      <div v-if="showNotification" class="notification-dropdown shadow">
        <div class="dropdown-header fw-bold text-dark px-3 py-2 border-bottom">🔔 알림</div>
        <div class="dropdown-body px-3 py-2 text-muted small">
          <ul class="mb-0 ps-3">
            <li v-if="alerts.travel && alerts.travelSoon != null">
              여행이 {{ alerts.travelSoon }}일 남았습니다!
            </li>
            <li v-if="alerts.budget && alerts.budgetWarning">
              예산의 80% 이상을 지출했어요! 지출을 확인해보세요 ⚠️
            </li>
            <li v-if="alerts.budget && !alerts.budgetWarning">아직 예산이 80%를 넘지 않았어요</li>
            <li v-if="!alerts.travel && !alerts.budget && !alerts.income" class="text-muted">
              새로운 알림이 없습니다.
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 마이페이지 버튼 -->
    <button class="btn btn-light rounded-circle mypage" @click="onProfileClick">
      <i class="bi bi-person"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const showNotification = ref(false)
const alerts = ref({
  travel: false,
  budget: false,
  income: false,
  travelSoon: null,
  budgetWarning: false,
})
const hasAlert = ref(false)

const toggleNotification = () => {
  showNotification.value = !showNotification.value
}

const onProfileClick = () => {
  router.push('/my_page')
}

onMounted(async () => {
  try {
    // ✅ 유저 정보 알림 체크
    const res = await axios.get(`http://localhost:3000/users?email=${authStore.user.email}`)
    const user = res.data[0]
    alerts.value = {
      travel: user.travel === true,
      budget: user.budget === true,
      income: user.income === true,
      travelSoon: null,
    }

    // ✅ 여행 시작일 D-day 확인
    const travels = await axios.get(
      `http://localhost:3000/travel?userEmail=${authStore.user.email}`,
    )
    const travelDatas = travels.data
    const today = new Date()
    const ongoingTravel = null
    const ongoingFlag = false
    for (const travel of travelDatas) {
      const startDate = new Date(travel.startDate)
      const diffTime = startDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const endDate = new Date(travel.endDate)
      const diffTime2 = endDate.getTime() - today.getTime()
      const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24))
      const flag = false
      if (diffDays <= 0 && diffDays2 >= 0 && !ongoingFlag) {
        ongoingTravel = travel
        ongoingFlag = true
      }
      if (diffDays > 1 && diffDays < 3 && !flag) {
        alerts.value.travelSoon = diffDays
        console.log(travel)
        flag = true
      }
    }
    if (ongoingFlag) {
      const totalBudget = Number(ongoingTravel.income)
      const totalSpent = Number(ongoingTravel.totalSpent)
      if (totalBudget > 0 && totalSpent / totalBudget >= 0.8) {
        alerts.value.budgetWarning = true
      }
    }
    if (alerts.value.budget) {
      for (const travel of travelDatas) {
        const totalBudget = Number(travel.totalBudget)
        const totalSpent = Number(travel.totalSpent)
        if (totalBudget > 0 && totalSpent / totalBudget >= 0.0) {
          alerts.value.budgetWarning = true
        }
      }
    }

    hasAlert.value =
      alerts.value.travel ||
      alerts.value.budget ||
      alerts.value.income ||
      alerts.value.travelSoon !== null
    alerts.value.budgetWarning !== null
  } catch (err) {
    console.error('데이터 로딩 오류:', err)
  }
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1030;
  display: flex;
  align-items: center;
  gap: 10px;
}

.button-wrapper {
  position: relative;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 260px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #ddd;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.mypage {
  background-color: #8b6f5c;
  color: white;
}

.badge-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
}
</style>
