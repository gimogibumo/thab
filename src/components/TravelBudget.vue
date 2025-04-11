<script setup>
import { ref, computed, onMounted } from 'vue'
import TravelBudgetCard from '@/components/TravelBudgetCard.vue'
import StatsChart from '@/components/StatsChart.vue'
import axios from 'axios'

const props = defineProps({
  travelId: {
    type: String,
    required: true,
  },
})

const expenses = ref([])

const fetchExpenses = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/expense?travelId=${props.travelId}&_sort=date&_order=desc`,
    )
    expenses.value = response.data
  } catch (error) {
    console.error('Failed to fetch expenses:', error)
  }
}

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/expense/${id}`)
    expenses.value = expenses.value.filter((e) => e.id !== id)
  } catch (error) {
    console.error('Failed to delete expense:', error)
  }
}

const saveEditedExpense = async (updatedExpense) => {
  try {
    await axios.patch(`http://localhost:3000/expense/${updatedExpense.id}`, updatedExpense)
    const index = expenses.value.findIndex((e) => e.id === updatedExpense.id)
    if (index !== -1) {
      expenses.value[index] = { ...updatedExpense }
    }
  } catch (error) {
    console.error('Failed to update expense:', error)
  }
}

const selectedCategory = ref('')
const selectedSort = ref('latest')

const filteredExpenses = computed(() => {
  const filtered = expenses.value.filter((e) => {
    return (
      e.travelId === props.travelId &&
      (!selectedCategory.value || e.category === selectedCategory.value)
    )
  })

  switch (selectedSort.value) {
    case 'latest':
      return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))
    case 'oldest':
      return [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date))
    case 'high':
      return [...filtered].sort((a, b) => b.moneyByWon - a.moneyByWon)
    case 'low':
      return [...filtered].sort((a, b) => a.moneyByWon - b.moneyByWon)
    default:
      return filtered
  }
})

onMounted(fetchExpenses)
</script>

<template>
  <div class>
    <StatsChart :travelId="travelId" :expenses="expenses" />
    <div class="expenses">
      <h3>지출 내역</h3>
      <div class="filters">
        <select v-model="selectedCategory">
          <option value="">전체카테고리</option>
          <option>숙박</option>
          <option>식비</option>
          <option>교통</option>
          <option>관광</option>
          <option>쇼핑</option>
          <option>기타</option>
        </select>
        <select v-model="selectedSort">
          <option value="latest">최신순</option>
          <option value="oldest">오래된 순</option>
          <option value="high">금액 높은 순</option>
          <option value="low">금액 낮은 순</option>
        </select>
      </div>
      <div v-if="expenses.length <= 0">
        <div class="no-data">지출 내역이 없습니다</div>
      </div>
      <div v-else class="scrollable-expenses">
        <TravelBudgetCard
          v-for="expense in filteredExpenses"
          :key="expense.id"
          :expense="expense"
          :travelId="travelId"
          @edit="saveEditedExpense"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 80%;
}

.expenses {
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 46, 71, 0.2); /* 0F2E47 색상으로 그림자 */
  margin-bottom: 2rem;
}

.expenses h3 {
  margin-bottom: 0;
  color: #0F2E47; /* 타이틀도 주 색상 */
}

.scrollable-expenses {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.filters {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

select {
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #205781; /* 포인트 색상 */
  background-color: #f9f9f9;
  color: #0F2E47;
  font-weight: 500;
}

select:focus {
  outline: none;
  border-color: #0F2E47;
  box-shadow: 0 0 4px rgba(15, 46, 71, 0.4);
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  font-size: 1rem;
  color: #205781; /* 포인트 색상 강조 */
  background-color: #EAF0F5; /* 연한 배경 추가 */
  border-radius: 8px;
  border: 1px dashed #205781;
}
</style>
