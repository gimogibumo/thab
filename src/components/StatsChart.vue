<template>
  <div class="stats-wrapper">
    <div class="chart-box">
      <h3>일별 지출 추이</h3>
      <Bar :data="barData" :options="barOptions" />
    </div>
    <div class="chart-box">
      <h3>총 카테고리별 지출</h3>
      <Doughnut :data="doughnutData" :options="doughnutOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const props = defineProps({
  travelId: {
    type: String,
    required: true,
  },
  expenses: {
    type: Array,
    required: true,
  },
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}월 ${day}일`
}

const dailyExpenses = computed(() => {
  return props.expenses.reduce((acc, expense) => {
    const formattedDate = formatDate(expense.date)
    if (!acc[formattedDate]) {
      acc[formattedDate] = 0
    }
    acc[formattedDate] += expense.amount
    return acc
  }, {})
})

const barData = computed(() => ({
  labels: Object.keys(dailyExpenses.value),
  datasets: [
    {
      label: '지출(원)',
      data: Object.values(dailyExpenses.value),
      backgroundColor: '#815f43',
      borderRadius: 6,
    },
  ],
}))

const categoryExpenses = computed(() => {
  return props.expenses.reduce((acc, expense) => {
    const category = expense.category
    if (!acc[category]) {
      acc[category] = 0
    }
    acc[category] += expense.amount
    return acc
  }, {})
})

const doughnutData = computed(() => ({
  labels: Object.keys(categoryExpenses.value),
  datasets: [
    {
      data: Object.values(categoryExpenses.value),
      backgroundColor: ['#8B6F5C', '#A47764', '#d3b8a3', '#C09E8C', '#D5BFB3', '#E6D5CC'],
    },
  ],
}))

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (val) => `${val / 10000}만`,
        font: {
          size: 12,
        },
      },
    },
  },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 14,
        },
      },
    },
  },
}
</script>

<style scoped>
.stats-wrapper {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 20px;
}

.chart-box {
  flex: 1;
  min-width: 300px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  height: auto;
}

.chart-box h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

:deep(canvas) {
  width: 100% !important;
  height: 250px !important;
}
</style>
