<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  tripId: {
    type: String,
    required: true,
  },
})

const checkedItems = ref([])
const budget = ref({})
const totalBudget = ref(0)
const recentExpenses = ref([])

const categoryLabels = {
  stay: '숙박',
  transport: '교통',
  food: '식비',
  tour: '관광',
  shopping: '쇼핑',
  etc: '기타'
}

onMounted(async () => {
  try {
    const checklistRes = await axios.get(
      `http://localhost:3000/checkedList?tripId=${props.tripId}`
    )
    checkedItems.value = checklistRes.data[0]?.checklist || []

    const tripRes = await axios.get(
      `http://localhost:3000/trips/${props.tripId}`
    )
    budget.value = tripRes.data.budget || {}
    totalBudget.value = tripRes.data.totalBudget || 0

    const expenseRes = await axios.get(
      `http://localhost:3000/expense?travelsKey=${props.tripId}&_sort=date&_order=desc&_limit=5`
    )
    recentExpenses.value = expenseRes.data
  } catch (err) {
    console.error('데이터 로딩 오류:', err)
  }
})

const getTotalUsed = () => {
  return Object.keys(budget.value).reduce((acc, key) => {
    return acc + getUsedAmount(key)
  }, 0)
}


const getUsedAmount = (key) => {
  // 실제 로직에서는 expense 목록을 필터링해서 계산해야 함
  return Math.round((budget.value[key] || 0) * 0)
}

const getCategoryPercentage = (key) => {
  const used = getUsedAmount(key)
  const budgeted = budget.value[key] || 0
  return budgeted > 0 ? Math.round((used / budgeted) * 100) : 0
}

</script>


<template>
<div class="container">
  <div class="row gx-3 gy-4 align-items-stretch">
      <!-- 예산 현황 카드 -->
      <div class="col-md-8">
        <div class="card h-100 p-4 shadow-sm">
          <h5 class="fw-bold mb-3">예산 현황</h5>

          <div class="d-flex justify-content-between text-muted small mb-2">
            <span>전체 예산 대비 지출</span>
            <span class="fw-bold">
              {{ getTotalUsed().toLocaleString() }}원 / {{ totalBudget.toLocaleString() }}원
            </span>
          </div>

          <div class="progress mb-3" style="height: 8px;">
            <div
              class="progress-bar bg-warning"
              role="progressbar"
              :style="{ width: (getTotalUsed() / totalBudget * 100) + '%' }"
            />
          </div>

          <div class="row">
            <div
              class="col-6 mb-3"
              v-for="(amount, key) in budget"
              :key="key"
            >
              <div class="small fw-bold mb-1">{{ categoryLabels[key] || key }}</div>
              <div class="progress mb-1" style="height: 6px;">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :style="{ width: getCategoryPercentage(key) + '%' }"
                />
              </div>
              <div class="text-muted small">
                {{ getUsedAmount(key).toLocaleString() }}원 / {{ amount.toLocaleString() }}원
                ({{ getCategoryPercentage(key) }}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 체크리스트 카드 (오른쪽 상단) -->
      <div class="col-md-4">
        <div class="card p-4 shadow-sm h-100 d-flex flex-column">
          <h5 class="mb-3 fw-bold">체크리스트</h5>
          <div v-if="checkedItems.length === 0">체크리스트 항목이 없습니다.</div>
          <div v-else>
            <div
              v-for="(item, index) in checkedItems"
              :key="index"
              class="form-check mb-2"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="'c-' + index"
                :checked="item.checked"
                disabled
              />
              <label class="form-check-label" :for="'c-' + index">
                {{ item.label }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 최근 지출 카드 (하단 전체) -->
      <div class="col-12">
        <div class="card p-4 shadow-sm d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">최근 지출 내역</h5>
            <a href="#" class="text-muted small">전체보기</a>
          </div>
          <div v-if="recentExpenses.length === 0" class="text-muted">
            지출 내역이 없습니다.
          </div>
          <ul v-else class="list-unstyled mb-0">
            <li
              v-for="(expense, index) in recentExpenses"
              :key="expense.id"
              class="mb-3 p-3 rounded bg-light-subtle"
            >
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="text-muted small">{{ new Date(expense.date).toLocaleDateString() }}</span>
                <span class="badge bg-light text-dark border rounded-pill px-2 py-1 small">
                  {{ expense.category }}
                </span>
              </div>
              <div class="fw-bold">{{ expense.expenseName }}</div>
              <div class="d-flex justify-content-between align-items-center mt-1">
                <div class="text-muted small">{{ expense.description || '지출 내용 없음' }}</div>
                <div class="fw-bold">{{ expense.amount.toLocaleString() }}원</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 20px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-height: 100%;
}

.bg-light-subtle {
  background-color: #f8f9fa;
}

.progress {
  background-color: #e9ecef;
  border-radius: 20px;
}

.progress-bar {
  background-color: #8b5e3c;
  border-radius: 20px;
}

.fw-bold {
  font-weight: 600 !important;
}

.text-muted {
  color: #6c757d !important;
}

.form-check-input:checked {
  background-color: #8b5e3c;
  border-color: #8b5e3c;
}

.form-check-input {
  cursor: default;
}

button {
  border-radius: 10px !important;
}
</style>
