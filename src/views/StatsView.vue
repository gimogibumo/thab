<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
import { convertCurrency } from '@/utils/exchangeConverter.js'
import { useAuthStore } from '@/stores/auth.js'

Chart.register(...registerables)

const expenses = ref()
const convertedAmounts = reactive({})
const travel = ref()
const selectedTravelId = ref(null)

const authStore = useAuthStore()

// 카테고리 리스트
const categoryNames = ['관광', '식비', '기타', '교통', '숙박', '쇼핑']

// 총 지출
const totalExpense = computed(() => {
  if (!expenses.value) return '0원'

  const sum = expenses.value.reduce((acc, item) => {
    const converted = convertedAmounts[item.id]
    return acc + (converted ?? 0)  // 변환된 값이 없으면 0 처리
  }, 0)

  return sum.toLocaleString() + '원'
})

// 카테고리별 지출
const categories = computed(() => {
  const result = categoryNames.map(name => ({ name, amount: 0, percent: 0 }))
  if (!expenses.value) return result

  expenses.value.forEach(item => {
    const category = result.find(c => c.name === item.category)
    if (category && convertedAmounts[item.id]) {
      category.amount += convertedAmounts[item.id]
    }
  })

  const total = result.reduce((sum, item) => sum + item.amount, 0)
  result.forEach(item => {
    item.percent = total > 0 ? Number(((item.amount / total) * 100).toFixed(1)) : 0
  })

  return result
})

// 이번 달 지출
const monthExpense = computed(() => {
  if (!expenses.value) return '0원'

  const now = new Date()
  const sum = expenses.value
    .filter(item => {
      const date = new Date(item.date)
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      )
    })
    .reduce((acc, item) => acc + (convertedAmounts[item.id] ?? 0), 0)

  return sum.toLocaleString() + '원'
})

// 지출별 1위 카테고리
const topCategory = computed(() => {
  const categorySums = categoryNames.map(name => {
    const amount = expenses.value?.reduce((sum, item) => {
      if (item.category === name) {
        return sum + (convertedAmounts[item.id] ?? 0)
      }
      return sum
    }, 0) ?? 0

    return { name, amount }
  })

  const sorted = categorySums.sort((a, b) => b.amount - a.amount)
  const maxItem = sorted[0]

  return maxItem?.amount > 0
    ? `${maxItem.name} (${maxItem.amount.toLocaleString()}원)`
    : '-'
})

// 여행별 지출 추이
const travelExpenses = computed(() => {
  if (!expenses.value) return []

  const userEmail = authStore.user.email
  const result = {}

  expenses.value.forEach(item => {
    if (item.userEmail === userEmail) {
      const travelId = item.travelId
      if (!travelId) return
      result[travelId] = (result[travelId] || 0) + (convertedAmounts[item.id] ?? 0)  // 금액 변환값으로 계산
    }
  })

  return Object.entries(result).map(([travelId, amount]) => ({
    travelId,
    name: travelMap.value[travelId]?.title || `여행 ${userEmail}`,
    amount
  }))
})

const travelMap = computed(() => {
  const map = {}
  if (!travel.value) return map

  travel.value.forEach(item => {
    map[item.id] = {
      title: item.title
    }
    console.log(item.title)
  })

  return map
})

// 막대 그래프 그리기
const renderTravelChart = () => {
  const ctx = document.getElementById('travel-bar-chart')
  if (!ctx) return

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: travelExpenses.value.map(item => item.name),
      datasets: [{
        label: '여행별 지출',
        data: travelExpenses.value.map(item => item.amount),
        backgroundColor: '#8B6F5C',
        borderRadius: 10,
        barThickness: 30,
        categoryPercentage: 0.5,
        barPercentage: 0.5,
        hoverBackgroundColor: '#6A4E3D',
        hoverBorderRadius: 10
      }]
    },
    options: {
      responsive: true,
      onClick: (e, elements) => {
        if (!elements.length) return
        const index = elements[0].index
        const clicked = travelExpenses.value[index]
        if (selectedTravelId.value === clicked.travelId) {
          selectedTravelId.value = null
        } else {
          selectedTravelId.value = clicked.travelId
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: context => `${context.parsed.y.toLocaleString()}원`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => `${value.toLocaleString()}원`
          },
          grid: {
            borderColor: '#ddd',
            borderWidth: 1,
            color: '#f1f1f1'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })

}

const selectedTravelCategories = computed(() => {
  if (!selectedTravelId.value || !expenses.value) return []

  const filtered = expenses.value.filter(item => item.travelId === selectedTravelId.value)

  const result = categoryNames.map(name => ({ name, amount: 0, percent: 0 }))

  filtered.forEach(item => {
    const category = result.find(c => c.name === item.category)
    if (category && convertedAmounts[item.id]) {
      category.amount += convertedAmounts[item.id]
    }
  })

  const total = result.reduce((sum, item) => sum + item.amount, 0)
  result.forEach(item => {
    item.percent = total > 0 ? Number(((item.amount / total) * 100).toFixed(1)) : 0
  })

  return result
})


onMounted(async () => {
  try {
    const expenseRes = await axios.get('http://localhost:3000/expense')
    const travelRes = await axios.get('http://localhost:3000/travel')

    expenses.value = expenseRes.data
    travel.value = travelRes.data

    console.log(expenses.value)
    console.log(travel.value)

    // 각 항목의 금액을 원화로 변환
    for (const item of expenses.value) {
      const converted = await convertCurrency(item.amount, item.currency, 'KRW')
      convertedAmounts[item.id] = converted
    }

    const userEmail = authStore.user.email
    expenses.value = expenses.value.filter(item => item.userEmail === userEmail)

    nextTick(() => {
      renderTravelChart()
    })

  } catch (err) {
    console.error('데이터 불러오기 실패:', err)
  }
})
</script>

<template>
  <div class="content">
    <div class="page-title">통계</div>
    <div class="top">
      <div class="total-expense">
        <div class="total-title">총 지출</div>
        <div class="total-content">{{ totalExpense }}</div>
      </div>
      <div class="month-expense">
        <div class="total-title">이번 달 지출</div>
        <div class="total-content">{{ monthExpense }}</div>
      </div>
      <div class="top-expense">
        <div class="total-title">지출 1위 카테고리</div>
        <div class="total-content">{{ topCategory }}</div>
      </div>
    </div>
    <div class="middle">
      <div class="category-title">카테고리별 지출</div>
      <div class="category-grid">
        <div
          v-for="(item, index) in selectedTravelCategories"
          :key="index"
          class="category-box">
          <div class="category-header">
            <div>{{ item.name }}</div>
            <div>{{ item.amount.toLocaleString() }}원 ({{ item.percent }}%)</div>
          </div>
          <div class="progress-bar">
            <div
              class="progress"
              :style="{ width: item.percent + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="travel-stats">
        <div class="travel-title">여행별 지출 추이</div>
        <div class="graph">
          <div v-if="travelExpenses.length === 0" class="non-graph">
            🛬<br><br>여행을 다녀온 후<br>THAB에 기록해 보세요!
          </div>
          <div v-else class="graph">
            <canvas id="travel-bar-chart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 3% 5%;
}

.content::-webkit-scrollbar {
  display: none;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
}

.top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 12px;
}

.total-expense, .top-expense, .month-expense {
  flex: 1 1 30%;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 30px;
  transition: all 0.3s ease;
  min-width: 280px;
}

.total-title {
  margin-bottom: 10px;
  font-size: 1rem;
}

.total-content {
  font-weight: bold;
  font-size: 24px;
}

.middle {
  margin: 30px 0;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: all 0.3s ease;
}

.category-title, .travel-title {
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  margin-left: 10px;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-box {
  flex: 1 1 calc(50% - 0.5rem); /* 2열 구성 */
  border-radius: 8px;
  padding: 0.5rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.progress-bar {
  height: 7px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.progress {
  background-color: #8B6F5C;
  height: 100%;
}

.bottom {
  margin-top: 30px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: all 0.3s ease;
}

.non-graph {
  text-align: center;
}

@media (max-width: 1024px) {
  .content {
    padding: 30px 15px;
  }

  .category-box {
    flex: 1 1 100%; /* 한 줄에 하나씩 */
  }

  .total-content {
    font-size: 24px;
  }

  .total-title, .category-header {
    font-size: 0.95rem;
  }

  .bottom {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 20px;
  }

  .total-title {
    font-size: 0.9rem;
  }

  .total-content {
    font-size: 22px;
  }

  .category-title, .travel-title {
    font-size: 1rem;
  }

  .non-graph {
    margin: 10%;
    font-size: 0.95rem;
  }

  .category-header {
    font-size: 0.9rem;
  }
}


</style>
