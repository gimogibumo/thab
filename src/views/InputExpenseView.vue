<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { convertCurrency } from '@/utils/exchangeConverter'

// 10000000000000000
const router = useRouter()
const categories = ['숙박', '식비', '교통', '관광', '쇼핑', '기타']
const showCategories = ref(false)
const currencyJson = ref(null)
const showCurrencyDropdown = ref(false)
const selectedCurrency = ref('')
const moneyByWon = ref('')

function toggleCurrencyDropdown() {
  showCurrencyDropdown.value = !showCurrencyDropdown.value
}

function selectCurrency(currency) {
  selectedCurrency.value = currency
  showCurrencyDropdown.value = false
}

function toggleCategories() {
  showCategories.value = !showCategories.value
}
const expense = reactive({
  travelsKey: '',
  inputName: '',
  expenseName: '',
  category: '',
  customCategory: '',
  amount: 0,
  memo: '',
  date: '',
})

const travels = ref([])
const selectedTravel = ref('')

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/travels')
    travels.value = res.data
  } catch (err) {
    console.error(err)
  }
  try {
    const response = await fetch('/exchangeRates.json')
    currencyJson.value = await response.json()
  } catch (err) {
    console.error(err)
  }
})

watch(selectedTravel, (newTravel) => {
  if (newTravel) {
    expense.inputName = newTravel.title
    expense.travelsKey = newTravel.id
    expense.date = ''
  }
})
watch([() => expense.amount, selectedCurrency], ([newAmount, newCurrency]) => {
  if (newCurrency && currencyJson.value) {
    const rateObj = currencyJson.value.find((item) => item.cur_unit === newCurrency)
    if (rateObj) {
      const rate = parseFloat(rateObj.deal_bas_r.replace(',', ''))
      moneyByWon.value = (newAmount ? newAmount * rate : 0).toFixed(2)
      moneyByWon.value = parseInt(moneyByWon.value)
    }
  }
})

function validateAmount() {
  if (expense.amount !== '') {
    expense.amount = Math.floor(Number(expense.amount))
    if (expense.amount < 1) expense.amount = 1
  }
}

function selectCategory(cat) {
  expense.category = cat
}

async function submitForm() {
  if (!expense.inputName) return alert('여행을 선택해주세요!')
  if (!expense.expenseName) return alert('지출 항목을 입력해주세요!')
  if (!expense.category) return alert('카테고리를 선택해주세요!')
  if (!expense.date) return alert('여행 날짜를 선택해주세요!')
  if (expense.amount === 0) return alert('금액을 입력해주세요!')

  if (moneyByWon.value) {
    expense.amount = moneyByWon.value
  }
  try {
    await axios.post('http://localhost:3000/expense', expense)
    alert('지출 내역이 저장되었습니다!')
    router.push('/expense_list')
  } catch (err) {
    console.error(err)
  }
}

function cancelForm() {
  if (confirm('정말로 취소하시겠습니까? (작성한 내용들은 모두 사라집니다!)')) {
    router.push('/')
  }
}
</script>

<template>
  <div class="content">
    <h1>지출 입력</h1>
    <form @submit.prevent="submitForm">
      <div class="main">
        <div class="container">
          <div class="selectTravel">
            <label for="inputName">여행 선택</label>
            <select id="inputName" v-model="selectedTravel">
              <option selected hidden value="">여행을 선택하세요</option>
              <option
                v-for="travel in travels"
                :key="travel.id"
                :value="travel"
                style="overflow-x: auto; white-space: nowrap"
              >
                {{ travel.title }}
              </option>
            </select>
          </div>

          <div class="selectDate">
            <label for="expenseDate">여행 날짜</label>
            <input
              id="expenseDate"
              type="date"
              v-model="expense.date"
              :min="selectedTravel?.startDate"
              :max="selectedTravel?.endDate"
              :disabled="!selectedTravel"
            />
          </div>

          <div class="selectItemName">
            <label for="expenseName">지출 항목</label>
            <input
              type="text"
              id="expenseName"
              v-model="expense.expenseName"
              placeholder="지출 항목을 입력해주세요"
              style="overflow-x: auto; white-space: nowrap"
            />
          </div>

          <div class="selectCategory">
            <label>카테고리</label>
            <div class="categoryBar" @click="toggleCategories">
              <span>{{ expense.category || '카테고리를 선택하세요' }}</span>
              <button type="button" class="categoryButton" :class="{ open: showCategories }">
                ▼
              </button>
            </div>
            <transition name="dropdown">
              <div v-if="showCategories" class="category-buttons">
                <button
                  v-for="cat in categories"
                  :key="cat"
                  type="button"
                  :class="['category-button', expense.category === cat ? 'selected' : '']"
                  @click="(selectCategory(cat), (showCategories = false))"
                >
                  {{ cat }}
                </button>
              </div>
            </transition>
          </div>

          <div class="selectAccount">
            <label for="amount">금액</label>
            <input
              type="number"
              id="amount"
              v-model="expense.amount"
              :min="1"
              step="1"
              @input="validateAmount"
              style="overflow-x: auto; white-space: nowrap"
              :disabled="!selectedCurrency"
            />
          </div>
          <div class="selectCurrency">
            <label></label>
            <div class="currencyBar" @click="toggleCurrencyDropdown">
              <span>{{ selectedCurrency || '선택' }}</span>
              <button type="button" class="currencyButton" :class="{ open: showCurrencyDropdown }">
                ▼
              </button>
            </div>
            <transition name="dropdown">
              <div v-if="showCurrencyDropdown" class="currency-dropdown">
                <button
                  v-for="currency in currencyJson"
                  :key="currency.cur_unit"
                  type="button"
                  class="currency-option"
                  @click="selectCurrency(currency.cur_unit)"
                >
                  {{ currency.cur_unit }}
                </button>
              </div>
            </transition>
          </div>

          <div class="resultWonContainer">
            <label>KRW</label>
            <div class="resultWon" style="overflow-x: auto; white-space: nowrap">
              {{ moneyByWon ? moneyByWon + ' 원' : '' }}
            </div>
          </div>

          <div class="inputMemo">
            <label for="memo">메모</label>
            <input
              type="text"
              id="memo"
              v-model="expense.memo"
              style="overflow-y: auto; resize: none"
            />
          </div>
        </div>

        <div class="buttons">
          <button type="button" @click="cancelForm" class="cancel-button">취소</button>
          <button type="submit" class="save-button">저장하기</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #222;
}

.container {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  border-radius: 1rem;
  gap: 1.5rem;
  padding: 2rem;
}

.container select,
.container input {
  width: 100%;
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 0.3rem;
  padding: 0 15px;
  margin: 5px 0;
  color: #333;
  background: #f9f9f9;
}

.buttons {
  text-align: right;
}

.buttons button {
  border-radius: 0.5rem;
  width: 120px;
  height: 50px;
  margin: 10px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-button:hover,
.save-button:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.selectTravel,
.selectDate,
.selectItemName,
.selectCategory,
.inputMemo {
  width: 100%;
}

.selectItemName {
  width: 60%;
}

.selectCategory {
  width: 36%;
  margin-left: auto;
  position: relative;
}

.selectCategory > .categoryBar {
  width: 100%;
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 0.3rem;
  padding: 0 15px;
  margin: 5px 0;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.inputMemo input {
  height: 96px;
}

.selectAccount {
  width: 50%;
}

.category-buttons {
  position: absolute;
  top: 100%;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.category-button {
  padding: 10px 0;
  border: 2px solid #c8b4a8;
  border-radius: 10px;
  background-color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  height: 48px;
}

.category-button.selected {
  background-color: #a87c6a;
  color: white;
  border-color: #a87c6a;
}
.save-button {
  background-color: #a47764;
  border: 1px solid #fff;
  color: #fff;
}
.cancel-button {
  background-color: #fff;
  border: 1px solid #a47764;
  color: #5c3a2f;
}
.categoryBar {
  cursor: pointer;
}
.categoryButton {
  background: none;
  border: none;
  font-size: 1.2rem;
  transform: rotate(0deg);
  transition: transform 0.3s;
}
.categoryButton.open {
  transform: rotate(180deg);
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
option {
  background: #fff;
  color: #333;
  font-size: 16px;
  padding: 10px;
}
.content {
  padding: 3% 5%;
}
.selectCurrency {
  width: 13%;
  position: relative;
}

.currencyBar {
  width: 100%;
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 0.3rem;
  padding: 0 15px;
  margin: 5px 0;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.currencyButton {
  background: none;
  border: none;
  font-size: 1.2rem;
  transform: rotate(0deg);
  transition: transform 0.3s;
}
.currencyButton.open {
  transform: rotate(180deg);
}

.currency-dropdown {
  position: absolute;
  top: 100%;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.currency-option {
  width: 100%;
  height: 48px;
  padding: 10px;
  border: none;
  background: white;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.currency-option:hover {
  background: #f0f0f0;
}
.resultWonContainer {
  width: 32%;
  margin-left: auto;
}
.resultWon {
  width: 100%;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #333;
  height: 50px;
}
</style>
