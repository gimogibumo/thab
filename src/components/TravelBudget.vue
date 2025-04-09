<script setup>
import { ref, computed, onMounted } from 'vue'
import TravelBudgetCard from '@/components/TravelBudgetCard.vue'
import StatsChart from '@/components/StatsChart.vue'
import CategoryDropdown from '@/components/CategoryDropdown.vue'
import axios from 'axios'

const props = defineProps({
  travelId: {
    type: String,
    required: true,
  },
})

const expenses = ref([])
const selectedCategory = ref(null)

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

const filteredExpenses = computed(() => {
  const filteredByTravelId = expenses.value.filter((e) => e.travelId === props.travelId)

  const sortedExpenses = [...filteredByTravelId].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })

  return !selectedCategory.value
    ? sortedExpenses
    : sortedExpenses.filter((e) => e.category === selectedCategory.value)
})

onMounted(fetchExpenses)
</script>

<template>
  <div class="content">
    <div class="container">
      <StatsChart :travelId="travelId" :expenses="expenses" />
      <div class="expenses">
        <h3>지출 내역</h3>
        <div class="filters">
          <CategoryDropdown v-model="selectedCategory" />
          <select>
            <option>최신순</option>
          </select>
        </div>
        <div class="scrollable-expenses">
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
  </div>
</template>

<style scoped>
.container {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  width: 90%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-right: auto;
  margin-left: auto;
}
.expenses {
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.expenses h3 {
  margin-bottom: 0;
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
  border: 1px solid #ccc;
}
</style>
