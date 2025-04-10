<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { convertCurrency } from '@/utils/exchangeConverter'
import axios from 'axios'

const props = defineProps({
  expense: {
    type: Object,
    required: true,
  },
  travelId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete'])

const isEditing = ref(false)
const editedExpense = ref({ ...props.expense })
const convertedAmount = ref(0)
const travelCurrency = ref('KRW')

const displayCurrency = computed(() => {
  return travelCurrency.value.split('(')[0]
})

const categories = ['숙박', '식비', '교통', '관광', '쇼핑', '기타']

onMounted(() => {
  fetchTravelCurrency()
})

const fetchTravelCurrency = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/travel/${props.travelId}`)
    const travelData = response.data

    travelCurrency.value = travelData.currency || 'KRW'
    updateConvertedAmount()
  } catch (error) {
    console.error('Error fetching travel data or setting currency:', error)
  }
}

const updateConvertedAmount = () => {
  convertedAmount.value = convertCurrency(props.expense.amount, 'KRW', travelCurrency.value)
}

watch(
  () => editedExpense.value.amount,
  (newVal) => {
    convertedAmount.value = convertCurrency(newVal, 'KRW', travelCurrency.value)
  },
)

updateConvertedAmount()

const startEditing = () => {
  const date = new Date(props.expense.date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  editedExpense.value.date = `${year}-${month}-${day}`
  isEditing.value = true
}

const cancelEdit = () => {
  editedExpense.value = { ...props.expense }
  updateConvertedAmount()
  isEditing.value = false
}

const saveEdit = () => {
  editedExpense.value.amount = editedExpense.value.amount
  emit('edit', { ...editedExpense.value })
  updateConvertedAmount()
  isEditing.value = false
  convertedAmount.value = convertCurrency(editedExpense.value.amount, 'KRW', travelCurrency.value)
}
</script>

<template>
  <div class="expense-card" :class="{ editing: isEditing }">
    <div class="date">
      <template v-if="isEditing">
        <input type="date" v-model="editedExpense.date" />
      </template>
      <template v-else>
        {{ expense.date }}
      </template>
    </div>
    <div class="category-chip">
      <template v-if="isEditing">
        <div class="select-container">
          <select v-model="editedExpense.category">
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </template>
      <template v-else>
        {{ expense.category }}
      </template>
    </div>
    <div class="info">
      <template v-if="isEditing">
        <input v-model="editedExpense.expenseName" placeholder="입력자" />
        <input v-model="editedExpense.memo" placeholder="항목명" />
      </template>
      <template v-else>
        <div class="name">{{ expense.expenseName }}</div>
        <div class="expense-name memo">{{ expense.memo }}</div>
      </template>
    </div>
    <div class="money-info">
      <template v-if="isEditing">
        <div>
          <input type="number" v-model.number="editedExpense.amount" />
          <span>KRW</span>
        </div>
        <div>
          <input type="number" :value="convertedAmount" disabled />
          <span>{{ displayCurrency }}</span>
        </div>
      </template>
      <template v-else>
        <div class="amount">{{ expense.amount.toLocaleString() }} KRW</div>
        <div class="converted">{{ convertedAmount.toLocaleString() }} {{ displayCurrency }}</div>
      </template>
    </div>
    <div class="actions">
      <template v-if="isEditing">
        <button class="edit-btn" @click="saveEdit">완료</button>
        <button class="delete-btn" @click="cancelEdit">취소</button>
      </template>
      <template v-else>
        <button class="edit-btn" @click="startEditing">수정</button>
        <button class="delete-btn" @click="$emit('delete', expense.id)">삭제</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.expense-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 2.3rem;
  margin-bottom: 1rem;
  background-color: #fff;
  gap: 2rem;
  transition: background-color 0.3s;
  max-width: 100%;
  box-sizing: border-box;
}

/* 수정 중일 때 스타일 */
.expense-card.editing {
  background-color: #f3eeea;
  border: 1px solid #8b6f5c;
  padding: 40px;
}

.expense-card.editing input {
  background-color: #fdfbf9;
  border: 1px solid #8b6f5c;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  color: #333;
  border: none;
}

.expense-card.editing input[type='date'] {
  font-size: 0.7rem;
  padding: 0.3rem 0.1rem;
  width: 120%;
}

.select-container select {
  background-color: #f1e9e3;
  color: #a47c59;
  border: none;
  border-radius: 999px;
  padding: 0.2rem 1.5rem 0.2rem 0.7rem;
  font-size: 0.8rem;
  font-weight: bold;
  appearance: none;
  cursor: pointer;
  text-align: center;
}

.select-container {
  position: relative;
  display: inline-block;
  width: fit-content;
}

.select-container::after {
  content: '▼';
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.6rem;
  color: #a47c59;
  pointer-events: none;
}

.expense-card.editing select::after {
  content: '▼';
  font-size: 0.6rem;
  color: #a47c59;
  margin-left: 0.5rem;
}

.date {
  width: 90px;
  color: #555;
  font-size: 0.9rem;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.money-info {
  display: inline-flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.money-info input {
  width: 100px;
  height: 2rem;
  text-align: right;
  padding: 0.3rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  max-width: 120px;
  min-width: 80px;
}

.money-info span {
  font-size: 0.9rem;
  color: #555;
  margin-left: 0.5rem;
}

.category-chip {
  display: inline-block;
  background-color: #f1e9e3;
  color: #a47c59;
  border-radius: 999px;
  padding: 0.2rem 0.7rem;
  font-size: 0.8rem;
  font-weight: bold;
  width: fit-content;
}

.name {
  font-size: 1rem;
  font-weight: 600;
}

.memo {
  font-size: 0.85rem;
  color: #777;
}

.amount {
  font-weight: bold;
  font-size: 1rem;
}

.converted {
  font-size: 0.85rem;
  color: #888;
}

.actions {
  display: flex;
  gap: 0.3rem;
}

.edit-btn,
.delete-btn {
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.edit-btn {
  background-color: #a47c59;
  color: #fff;
}

.delete-btn {
  background-color: #ffffff;
  color: #555;
  border: solid 0.5px #8b6f5c;
}
</style>
