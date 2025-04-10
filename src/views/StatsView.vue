<script setup>
import { computed, onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import { nextTick } from 'vue'
import axios from 'axios'

Chart.register(...registerables)

const expenses = ref()

// 카테고리 리스트
const categoryNames = ['관광', '식비', '기타', '교통', '숙박', '쇼핑']

// 총 지출
const totalExpense = computed(() => {
  if (!expenses.value) return 0
  return expenses.value.reduce((sum, item) => sum + item.amount, 0).toLocaleString() + '원'
})

// 카테고리별 지출
const categories = computed(() => {
  const result = categoryNames.map(name => ({ name, amount: 0, percent: 0 }))
  if (!expenses.value) return result

  expenses.value.forEach(item => {
    const category = result.find(c => c.name === item.category)
    if (category) {
      category.amount += item.amount
    }
  })

  const total = result.reduce((sum, item) => sum + item.amount, 0)
  result.forEach(item => {
    item.percent = total > 0 ? Math.round((item.amount / total) * 100) : 0
  })

  return result
})

// 이번 달 지출
const monthExpense = computed(() => {
  if (!expenses.value) return 0
  const now = new Date()
  const sum = expenses.value
    .filter(item => {
      const date = new Date(item.date)
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      )
    })
    .reduce((sum, item) => sum + item.amount, 0)

  return sum.toLocaleString() + '원'
})

// 지출 1위 카테고리
const topCategory = computed(() => {
  const sorted = [...categories.value].sort((a, b) => b.amount - a.amount)
  const maxItem = sorted[0]
  return maxItem?.amount > 0 ? `${maxItem.name} (${maxItem.amount.toLocaleString()}원)` : '-'
})

// 여행별 지출 추이
const travelExpenses = computed(() => {
  if (!expenses.value) return []

  const result = {}

  expenses.value.forEach(item => {
    const id = item.travelId
    if (!id) return
    result[id] = (result[id] || 0) + item.amount
  })

  return Object.entries(result).map(([id, amount]) => ({
    id,
    name: travelMap[id] || `여행 ${id}`,
    amount
  }))
})

const travelMap = computed(() => {
  const map = {}
  if (!expenses.value) return map

  expenses.value.forEach(item => {
    if (!map[item.travelId]) {
      map[item.travelId] = 0
    }
    map[item.travelId] += item.amount
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
        barPercentage: 0.2,
        categoryPercentage: 0.2
      }]
    },
    options: {
      responsive: true,
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
          }
        }
      }
    }
  })
}


onMounted(async () => {
  try {
    const expenseRes = await axios.get('http://localhost:3000/expense')

    expenses.value = expenseRes.data
    console.log(expenses.value)

    // 데이터 세팅 후 차트 렌더링
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
          v-for="(item, index) in categories"
          :key="index"
          class="category-box">
          <div class="category-header">
            <div>{{ item.name }}</div>
            <div>{{ item.amount }}원 ({{ item.percent }}%)</div>
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
