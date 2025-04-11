<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  expense: {
    type: Object,
    required: true,
  },
})

const currency = computed(() => props.expense.currency || 'KRW')
const emit = defineEmits(['edit', 'delete'])

const isEditing = ref(false)
const editedExpense = ref({ ...props.expense })
const categories = ['숙박', '식비', '교통', '관광', '쇼핑', '기타']

const displayCurrency = computed(() => {
  return currency.value.split('(')[0]
})

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
  isEditing.value = false
}

const saveEdit = () => {
  editedExpense.value.moneyByWon = editedExpense.value.moneyByWon
  emit('edit', { ...editedExpense.value })
  isEditing.value = false
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
          <input type="number" v-model.number="editedExpense.moneyByWon" />
          <span>KRW</span>
        </div>
        <div>
          <input type="number" v-model.number="editedExpense.amount" />
          <span>{{ displayCurrency }}</span>
        </div>
      </template>
      <template v-else>
        <div class="amount">{{ expense.moneyByWon.toLocaleString() }} KRW</div>
        <div class="converted">{{ expense.amount.toLocaleString() }} {{ displayCurrency }}</div>
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
  border: 1px solid #d6dee6;
  border-radius: 12px;
  padding: 2.3rem;
  margin-bottom: 1rem;
  background-color: #fff;
  gap: 2rem;
  transition: background-color 0.3s;
  max-width: 100%;
  box-sizing: border-box;
}

.expense-card.editing {
  background-color: #eef3f8;
  border: 1px solid #205781;
  padding: 40px;
}

.expense-card.editing input {
  background-color: #f5f9fc;
  border: 1px solid #205781;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  color: #0f2e47;
}

.expense-card.editing input[type='date'] {
  font-size: 0.7rem;
  padding: 0.3rem 0.1rem;
  width: 120%;
}

.select-container select {
  background-color: #e1ebf3;
  color: #205781;
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
  color: #205781;
  pointer-events: none;
}

.date {
  width: 90px;
  color: #205781;
  font-size: 0.9rem;
  font-weight: 500;
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
  color: #0f2e47;
}

.money-info span {
  font-size: 0.9rem;
  color: #205781;
  margin-left: 0.5rem;
  font-weight: 500;
}

.category-chip {
  display: inline-block;
  background-color: #e1ebf3;
  color: #205781;
  border-radius: 999px;
  padding: 0.2rem 0.7rem;
  font-size: 0.8rem;
  font-weight: bold;
  width: fit-content;
}

.name {
  font-size: 1rem;
  font-weight: 600;
  color: #0f2e47;
}

.memo {
  font-size: 0.85rem;
  color: #4a5d72;
}

.amount {
  font-weight: bold;
  font-size: 1rem;
  color: #0f2e47;
}

.converted {
  font-size: 0.85rem;
  color: #4a5d72;
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
  font-weight: 500;
}

.edit-btn {
  background-color: #205781;
  color: #fff;
}

.delete-btn {
  background-color: #ffffff;
  color: #205781;
  border: solid 1px #205781;
}
</style>
