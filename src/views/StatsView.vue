<script setup>
import { computed } from 'vue'

const expenses = [
  { expenseId: 1, category: '숙박', description: '도쿄 숙박비', date: '2024-02-15', amount: 450000 },
  { expenseId: 2, category: '식비', description: '라멘', date: '2024-02-15', amount: 15000 },
  { expenseId: 3, category: '쇼핑', description: '에어팟', date: '2025-04-15', amount: 300000 },
]

// 카테고리 리스트
const categoryNames = ['관광', '식비', '기타', '교통', '숙박', '쇼핑']

// 카테고리별 amount 계산
const categories = computed(() => {
  const result = categoryNames.map(name => ({ name, amount: 0, percent: 0 }))

  // 각 지출 데이터를 카테고리에 더함
  expenses.forEach(item => {
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

// 총 지출
const totalExpense = computed(() =>
  expenses.reduce((sum, item) => sum + item.amount, 0)
)

// 이번 달 지출
const monthExpense = computed(() => {
  const now = new Date()
  return expenses
    .filter(item => {
      const date = new Date(item.date)
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      )
    })
    .reduce((sum, item) => sum + item.amount, 0)
})

// 지출 1위 카테고리
const topCategory = computed(() => {
  const maxItem = [...categories.value].sort((a, b) => b.amount - a.amount)[0]
  return maxItem?.amount > 0 ? `${maxItem.name} (${maxItem.amount.toLocaleString()}원)` : '-'
})

</script>

<template>
  <div class="content">
    <div class="page-title">통계</div>
    <div class="top">
      <div class="total-expense">
        <div class="total-title">총 지출</div>
        <div class="total-content">{{totalExpense.toLocaleString()}}</div>
      </div>
      <div class="month-expense">
        <div class="total-title">이번 달 지출</div>
        <div class="total-content">{{monthExpense.toLocaleString()}}</div>
      </div>
      <div class="top-expense">
        <div class="total-title">지출 1위 카테고리</div>
        <div class="total-content">{{topCategory.toLocaleString()}}</div>
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
          <div class="non-graph">🛬<br><br>여행을 다녀온 후<br>THAB에 기록해 보세요!</div>
        </div>
      </div>
    </div>
    <!--          <div class="progress"-->
    <!--               :style="{ width: Math.floor((goal.saved / goal.target) * 100) + '%' }"></div>-->
  </div>
</template>

<style scoped>
.content {
  padding: 3% 5%;
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
