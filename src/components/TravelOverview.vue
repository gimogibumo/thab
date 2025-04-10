<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  travelId: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['change-tab'])

const checkedItems = ref([])
const budget = ref({})
const totalBudget = ref(0)
const recentExpenses = ref([])
const allExpenses = ref([])

const income = ref({})
const totalIncome = ref(0)

const tripStatus = ref('') // 'past', 'ongoing', 'upcoming'

const checklistId = ref(null)

const categoryLabels = {
  stay: '숙박',
  transport: '교통',
  food: '식비',
  tour: '관광',
  shopping: '쇼핑',
  etc: '기타'
}

const today = new Date()

onMounted(async () => {
  try {
    const travelRes = await axios.get(`http://localhost:3000/travel/${props.travelId}`)
    const travelData = travelRes.data
    budget.value = travelData.budget || {}
    totalBudget.value = travelData.totalBudget || 0

    const startDate = new Date(travelData.startDate)
    const endDate = new Date(travelData.endDate)

    if (today < startDate) {
      tripStatus.value = 'upcoming'
    } else if (today >= startDate && today <= endDate) {
      tripStatus.value = 'ongoing'
    } else {
      tripStatus.value = 'past'
    }

    if (tripStatus.value === 'upcoming') {
      const incomeRes = await axios.get(`http://localhost:3000/income?travelId=${props.travelId}`)
      const incomeData = incomeRes.data[0]
      income.value = incomeData || { income: 0, details: [] }
      totalIncome.value = income.value.income || 0
    }


    const expenseRes = await axios.get(
      `http://localhost:3000/expense?travelId=${props.travelId}&_sort=date&_order=desc`
    )
    allExpenses.value = expenseRes.data
    recentExpenses.value = expenseRes.data.slice(0, 3)

    const checklistRes = await axios.get(
      `http://localhost:3000/travelChecklist?travelId=${props.travelId}`
    )
    const checklistData = checklistRes.data[0]
    checkedItems.value = checklistData?.checklist || []
    checklistId.value = checklistData?.id
  } catch (err) {
    console.error('데이터 로딩 오류:', err)
  }
})

const getIncomeByCategory = (categoryKey) => {
  const categoryLabel = categoryLabels[categoryKey] || categoryKey
  return income.value.details?.filter(d => d.category === categoryLabel)
    .reduce((acc, cur) => acc + (cur.amount || 0), 0)
}


const getUsedAmount = (key) => {
  const label = categoryLabels[key] || key
  const matchedExpenses = allExpenses.value.filter(exp => exp.category === label)
  return matchedExpenses.reduce((acc, cur) => acc + (cur.moneyByWon || 0), 0)
}


const getCategoryPercentage = (key) => {
  const used = getUsedAmount(key)
  const budgeted = budget.value[key] || 0
  return budgeted > 0 ? Math.round((used / budgeted) * 100) : 0
}

const handleCheckToggle = async () => {
  try {
    if (!checklistId.value) throw new Error('체크리스트 ID를 찾을 수 없습니다.')
    await axios.patch(`http://localhost:3000/travelChecklist/${checklistId.value}`, {
      checklist: checkedItems.value
    })
  } catch (err) {
    console.error('체크리스트 업데이트 실패:', err)
    alert('체크 상태를 저장하는 데 실패했습니다.')
  }
}
</script>

<template>
  <div class="container-fluid px-4">
    <div class="row gx-3 gy-4 align-items-stretch">
      <!-- 예산 현황 카드 -->
      <div class="col-md-8">
        <div class="card h-100 p-4 shadow-sm">
          <h5 class="fw-bold mb-3">예산 현황</h5>
          <div v-if="tripStatus === 'upcoming'">
            <!-- 전체 수입 대비 예산 -->
            <div class="d-flex justify-content-between text-muted small mb-2">
              <span>전체 수입 대비 예산</span>
              <span class="fw-bold">
                {{ ( totalIncome || 0).toLocaleString() }}원 / {{ ( totalBudget || 0).toLocaleString() }}원
              </span>
            </div>
            <div class="progress mb-4" style="height: 8px;">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{ width: totalBudget > 0 ? Math.round(( totalIncome / totalBudget) * 100) + '%' : '0%' }"
              />
            </div>
            <div class="row">
              <div class="col-6 mb-3" v-for="(amount, key) in budget" :key="key">
                <div class="p-3 rounded category-card">
                  <div class="d-flex justify-content-between small mb-2">
                    <strong>{{ categoryLabels[key] || key }}</strong>
                    <span>
                      {{
                        amount > 0
                          ? Math.round((getIncomeByCategory(key) / amount) * 100)
                          : 0
                      }}%
                    </span>
                  </div>
                  <div class="progress mb-2" style="height: 6px;">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      :style="{ width: amount > 0 ? Math.round((getIncomeByCategory(key) / amount) * 100) + '%' : '0%' }"
                    />
                  </div>
                  <div class="d-flex justify-content-between text-muted small">
                    <!-- 좌측: 실제 수입 / 우측: 예산 -->
                    <span>{{ getIncomeByCategory(key).toLocaleString() }}원</span>
                    <span>{{ amount.toLocaleString() }}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="d-flex justify-content-between text-muted small mb-2">
              <span>전체 예산 대비 지출</span>
              <span class="fw-bold">
                {{
                  Object.keys(budget).reduce((acc, key) => acc + getUsedAmount(key), 0).toLocaleString()
                }}원 / {{ totalBudget.toLocaleString() }}원
              </span>
            </div>
            <div class="progress mb-4" style="height: 8px;">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{
                  width:
                    (Object.keys(budget).reduce((acc, key) => acc + getUsedAmount(key), 0) /
                      totalBudget) *
                      100 +
                    '%'
                }"
              />
            </div>

            <div class="row">
              <div class="col-6 mb-3" v-for="(amount, key) in budget" :key="key">
                <div class="p-3 rounded category-card">
                  <div class="d-flex justify-content-between small mb-2">
                    <strong>{{ categoryLabels[key] || key }}</strong>
                    <span>{{ getCategoryPercentage(key) }}%</span>
                  </div>
                  <div class="progress mb-2" style="height: 6px;">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      :style="{ width: getCategoryPercentage(key) + '%' }"
                    />
                  </div>
                  <div class="d-flex justify-content-between text-muted small">
                    <span>{{ getUsedAmount(key).toLocaleString() }}원</span>
                    <span>{{ amount.toLocaleString() }}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 체크리스트 카드 -->
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
                v-model="item.checked"
                @change="handleCheckToggle(index)"
              />
              <label class="form-check-label" :for="'c-' + index">
                {{ item.label }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 최근 지출 카드 -->
      <div class="col-12">
        <div class="card p-4 shadow-sm d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">최근 지출 내역</h5>
            <a href="#" class="text-muted small" @click.prevent="$emit('change-tab', 'budget')">전체보기</a>
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
              <div class="d-flex justify-content-between align-items-start flex-wrap">
                <!-- 왼쪽: 날짜 -->
                <div class="text-muted small me-3 min-width-80">
                  {{ new Date(expense.date).toLocaleDateString() }}
                </div>

                <!-- 카테고리 -->
                <div class="badge bg-light text-dark border rounded-pill px-2 py-1 small me-3 min-width-70">
                  {{ expense.category }}
                </div>

                <!-- 지출명 + 메모 -->
                <div class="flex-grow-1 me-3">
                  <div class="fw-bold">{{ expense.expenseName || '지출 항목' }}</div>
                  <div class="text-muted small">{{ expense.memo || '지출 내용 없음' }}</div>
                </div>

                <!-- 금액 -->
                <div class="text-end min-width-100">
                  <div class="fw-bold">{{ (expense.moneyByWon || 0).toLocaleString() }}원</div>
                  <div class="text-muted small">{{ expense.amount?.toLocaleString() }}{{ expense.currency }}</div>
                </div>
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

.category-card {
  background-color: #f8f4f1;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

</style>
