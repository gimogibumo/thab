<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
const authStore = useAuthStore()
const router = useRouter()
const categories = ['숙박', '식비', '교통', '관광', '쇼핑', '기타']
const showCategories = ref(false)
const currencyJson = ref(null)
const showCurrencyDropdown = ref(false)
const selectedCurrency = ref('')
const moneyByWon = ref('')
const showTravelDropdown = ref(false)

const travels = ref([])
const selectedTravel = ref()

const expense = reactive({
  travelId: '',
  inputName: '',
  expenseName: '',
  category: '',
  amount: 0,
  memo: '',
  date: '',
  userEmail: authStore.user.email,
})

function toggleTravelDropdown() {
  showTravelDropdown.value = !showTravelDropdown.value
}

function selectTravel(travel) {
  selectedTravel.value = travel
  showTravelDropdown.value = false
}

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

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/travel?userEmail=${authStore.user.email}`)
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
    expense.travelId = newTravel.id
    expense.date = ''
  }
})

watch([() => expense.amount, selectedCurrency], ([newAmount, newCurrency]) => {
  if (!newAmount || !newCurrency || !currencyJson.value) return

  const rateObj = currencyJson.value.find((item) => item.cur_unit === newCurrency)
  if (rateObj) {
    let rate = parseFloat(rateObj.deal_bas_r.replace(',', ''))

    // (100) 붙은 통화는 100으로 나눔
    if (newCurrency.includes('(100)')) {
      rate = rate / 100
    }

    moneyByWon.value = (newAmount * rate).toFixed(2)
    moneyByWon.value = parseInt(moneyByWon.value)

    if (moneyByWon.value >= 1000000000) {
      alert('금액이 너무 높습니다 다시 입력해주세요!')
      expense.amount = 0
      moneyByWon.value = ''
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
  showCategories.value = false
}

async function submitForm() {
  if (!expense.inputName) return alert('여행을 선택해주세요!')
  if (!expense.expenseName) return alert('지출 항목을 입력해주세요!')
  if (!expense.category) return alert('카테고리를 선택해주세요!')
  if (!expense.date) return alert('여행 날짜를 선택해주세요!')
  if (expense.amount === 0 || expense.amount == '') return alert('금액을 입력해주세요!')

  const payload = {
    ...expense,
    currency: selectedCurrency.value,
    // convertedAmount: moneyByWon.value || null,
  }

  try {
    await axios.post('http://localhost:3000/expense', payload)
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
    <div class="container-fluid py-4 px-3 px-md-5">
      <h1 class="mb-4 fw-bold">지출 입력</h1>
      <form @submit.prevent="submitForm">
        <div class="main">
          <div class="card shadow-sm mb-4">
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">여행 선택</label>
                  <div class="dropdown">
                    <button
                      class="form-select d-flex justify-content-between align-items-center"
                      type="button"
                      @click="toggleTravelDropdown"
                    >
                      <span>{{ selectedTravel?.title || '여행을 선택하세요' }}</span>
                      <i
                        class="bi"
                        :class="showTravelDropdown ? 'bi-chevron-up' : 'bi-chevron-down'"
                      ></i>
                    </button>
                    <ul
                      class="dropdown-menu w-100"
                      :class="{ show: showTravelDropdown }"
                      style="max-height: 200px; overflow-y: auto"
                    >
                      <li v-for="travel in travels" :key="travel.id">
                        <button type="button" class="dropdown-item" @click="selectTravel(travel)">
                          {{ travel.title }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="col-12">
                  <label for="expenseDate" class="form-label">지출 날짜</label>
                  <input
                    id="expenseDate"
                    type="date"
                    class="form-control"
                    v-model="expense.date"
                    :disabled="!selectedTravel"
                  />
                </div>

                <div class="col-md-8">
                  <label for="expenseName" class="form-label">지출 항목</label>
                  <input
                    type="text"
                    id="expenseName"
                    class="form-control"
                    v-model="expense.expenseName"
                    placeholder="지출 항목을 입력해주세요"
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label">카테고리</label>
                  <div class="dropdown">
                    <button
                      class="form-select d-flex justify-content-between align-items-center"
                      type="button"
                      id="categoryDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      @click="toggleCategories"
                    >
                      <span>{{ expense.category || '카테고리를 선택하세요' }}</span>
                      <i
                        class="bi"
                        :class="showCategories ? 'bi-chevron-up' : 'bi-chevron-down'"
                      ></i>
                    </button>
                    <ul
                      class="dropdown-menu w-100"
                      :class="{ show: showCategories }"
                      aria-labelledby="categoryDropdown"
                    >
                      <li v-for="cat in categories" :key="cat">
                        <button
                          type="button"
                          class="dropdown-item"
                          :class="{ active: expense.category === cat }"
                          @click="(selectCategory(cat), (showCategories = false))"
                        >
                          {{ cat }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="amount" class="form-label">금액</label>
                  <div class="input-group">
                    <input
                      type="number"
                      id="amount"
                      class="form-control"
                      v-model="expense.amount"
                      :min="1"
                      step="1"
                      @input="validateAmount"
                      :disabled="!selectedCurrency"
                    />
                    <div class="dropdown">
                      <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        id="currencyDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        @click="toggleCurrencyDropdown"
                      >
                        {{ selectedCurrency || '선택' }}
                      </button>
                      <ul
                        class="dropdown-menu dropdown-menu-end"
                        :class="{ show: showCurrencyDropdown }"
                        style="max-height: 200px; overflow-y: auto"
                        aria-labelledby="currencyDropdown"
                      >
                        <li v-for="currency in currencyJson" :key="currency.cur_unit">
                          <button
                            type="button"
                            class="dropdown-item"
                            @click="selectCurrency(currency.cur_unit)"
                          >
                            {{ currency.cur_unit }}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">KRW</label>
                  <div class="form-control bg-light same-height">
                    {{ moneyByWon ? moneyByWon + ' 원' : '' }}
                  </div>
                </div>

                <div class="col-12">
                  <label for="memo" class="form-label">메모</label>
                  <textarea
                    id="memo"
                    class="form-control"
                    v-model="expense.memo"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" @click="cancelForm" class="btn btn-outline-secondary">
              취소
            </button>
            <button type="submit" class="btn btn-primary">저장하기</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Bootstrap 5 will handle most styling, but we can add custom styles here */
.dropdown-item.active,
.dropdown-item:active {
  background-color: #a87c6a;
}

.btn-primary {
  background-color: #a47764;
  border-color: #a47764;
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: #8c6354;
  border-color: #8c6354;
}

.btn-outline-secondary {
  color: #5c3a2f;
  border-color: #a47764;
}

.btn-outline-secondary:hover,
.btn-outline-secondary:focus {
  background-color: #f8f9fa;
  color: #5c3a2f;
  border-color: #a47764;
}
.same-height {
  min-height: 38px; /* 부트스트랩 input 기본 높이 */
  display: flex;
  align-items: center; /* 가운데 정렬 */
}
</style>
