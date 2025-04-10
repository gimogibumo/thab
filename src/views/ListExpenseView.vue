<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import CustomDropdown from '@/components/CustomDropdown.vue'
import { convertCurrency } from '@/utils/exchangeConverter.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const authStore = useAuthStore()
const filter = reactive({
  selectCategory: '',
  searchTitle: '',
  selectedTravelJson: undefined,
})

const expenseList = ref([])
const editingId = ref(null)
const editedExpense = ref({})
const travels = ref([])
const convertedAmounts = reactive({})

watch(editedExpense, async (newVal) => {
  if (newVal.amount && newVal.currency) {
    convertedAmount.value = await convertCurrency(newVal.amount, newVal.currency, 'KRW')
  }
})

const categoryList = ['숙박', '식비', '교통', '관광', '쇼핑', '기타']
const selectedCategories = ref([...categoryList])

watch(
  [filter, selectedCategories],
  () => {
    listExpense()
  },
  { deep: true },
)

onMounted(() => {
  listExpense()
  findByTravel()
})

function validateAmount() {
  if (editedExpense.value.amount !== '') {
    editedExpense.value.amount = Math.floor(Number(editedExpense.value.amount))
    if (editedExpense.value.amount < 1) editedExpense.value.amount = 1
  }
}

async function findByTravel() {
  try {
    const res = await axios.get(`http://localhost:3000/travel?userEmail=${authStore.user.email}`)
    travels.value = res.data
  } catch (err) {
    console.log(err)
  }
}

async function listExpense() {
  try {
    const query = {}
    // console.log(filter.selectedTravelJson)
    if (filter.selectedTravelJson) {
      query.travelId = filter.selectedTravelJson.id
    }
    const queryString = new URLSearchParams(query).toString()
    const url = `http://localhost:3000/expense?userEmail=${authStore.user.email}&${queryString ? `${queryString}` : ''}`
    const res = await axios.get(url)
    let result = res.data

    if (selectedCategories.value.length > 0) {
      result = result.filter((item) => selectedCategories.value.includes(item.category))
    }

    const keyword = filter.searchTitle.trim()
    if (keyword !== '') {
      result = result.filter((item) =>
        item.expenseName.toLowerCase().includes(keyword.toLowerCase()),
      )
    }

    expenseList.value = result
    for (const item of result) {
      if (item.amount && item.currency) {
        convertedAmounts[item.id] = await convertCurrency(item.amount, item.currency, 'KRW')
      }
    }
  } catch (err) {
    console.log(err)
  }
}

async function deleteExpense(id) {
  try {
    if (confirm('정말 삭제하시겠습니까?')) {
      await axios.delete(`http://localhost:3000/expense/${id}`)
      listExpense()
    }
  } catch (err) {
    console.log(err)
  }
}

function startEditing(item) {
  if (confirm('지출 내역을 수정하시겠습니까?')) {
    editingId.value = item.id
    editedExpense.value = { ...item }
  }
}

async function saveExpense(id) {
  if (confirm('수정된 내용을 저장하시겠습니까?')) {
    try {
      if (
        editedExpense.value.amount == '' ||
        editedExpense.value.expenseName == '' ||
        editedExpense.value.date == '' ||
        editedExpense.value.category == ''
      ) {
        alert('입력된 값을 확인해주세요!')
        return
      }
      await axios.put(`http://localhost:3000/expense/${id}`, editedExpense.value)
      editingId.value = null
      listExpense()
    } catch (err) {
      console.log(err)
    }
  }
}

function cancelEditing() {
  if (confirm('지출 내역 수정을 취소하시겠습니까?')) {
    editingId.value = null
  }
}

function changeKeyword(e) {
  filter.searchTitle = e.target.value
}
</script>

<template>
  <div class="content">
    <div class="container-fluid py-4 px-3 px-md-5">
      <h1 class="mb-4 fw-bold">지출 내역</h1>
      <div class="card shadow-sm p-4">
        <div class="row g-3 mb-4">
          <div class="dropdown col-md-4">
            <button
              class="btn btn-light dropdown-toggle w-100 text-start border rounded"
              type="button"
              id="travelDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ filter.selectedTravelJson ? filter.selectedTravelJson.title : '전체 여행' }}
            </button>
            <ul class="dropdown-menu show w-100 shadow" aria-labelledby="travelDropdown">
              <li>
                <a
                  class="dropdown-item py-2 text-brown fw-bold"
                  href="#"
                  @click.prevent="filter.selectedTravelJson = undefined"
                  >전체 여행</a
                >
              </li>
              <li v-for="travel in travels" :key="travel.id">
                <a
                  class="dropdown-item py-2"
                  href="#"
                  @click.prevent="filter.selectedTravelJson = travel"
                  >{{ travel.title }}</a
                >
              </li>
            </ul>
          </div>

          <div class="col-md-4">
            <CustomDropdown v-model:category="selectedCategories" />
          </div>

          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="검색어를 입력하세요"
              v-model="filter.searchTitle"
              @input="changeKeyword"
            />
          </div>
        </div>

        <div class="row gy-3">
          <div v-for="item in expenseList" :key="item.id" class="col-12">
            <div class="card shadow-sm p-3">
              <div v-if="editingId === item.id">
                <div class="row g-2 align-items-center">
                  <div class="col-md-3">
                    <input
                      type="text"
                      v-model="editedExpense.expenseName"
                      class="form-control"
                      placeholder="지출 이름 입력"
                    />
                  </div>
                  <div class="col-md-2">
                    <input
                      type="number"
                      v-model="editedExpense.amount"
                      class="form-control"
                      placeholder="금액 입력"
                      :min="1"
                      step="1"
                      @input="validateAmount"
                    />
                  </div>
                  <div class="col-md-2">
                    <select v-model="editedExpense.category" class="form-select">
                      <option v-for="cat in categoryList" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <input type="date" class="form-control" v-model="editedExpense.date" />
                  </div>
                  <div class="col-md-3">
                    <input type="text" v-model="editedExpense.memo" class="form-control" />
                  </div>
                </div>
                <div class="mt-3 text-end">
                  <button class="btn btn-primary me-2" @click="saveExpense(item.id)">저장</button>
                  <button class="btn btn-outline-secondary" @click="cancelEditing">취소</button>
                </div>
              </div>

              <div v-else>
                <div class="d-flex align-items-center justify-content-between flex-wrap">
                  <div class="col-md-2 text-muted small">
                    {{ item.date }}
                  </div>
                  <div class="col-md-1">
                    <span class="badge bg-light text-dark">{{ item.category }}</span>
                  </div>
                  <div class="col-md-3">
                    <div class="fw-bold">{{ item.expenseName }}</div>
                    <div class="text-muted small">{{ item.memo }}</div>
                  </div>
                  <div class="col-md-3 text-end">
                    <div class="fw-bold">
                      {{ item.amount.toLocaleString() }} {{ item.currency }}
                    </div>
                    <div class="text-muted">
                      {{ convertedAmounts[item.id] ? parseInt(convertedAmounts[item.id]) : '-' }}원
                    </div>
                  </div>
                  <div class="col-md-3 text-end">
                    <div class="btn-group">
                      <button
                        class="btn btn-sm text-white"
                        :style="{ backgroundColor: '#8B6F5C' }"
                        @click="startEditing(item)"
                      >
                        수정
                      </button>
                      <button
                        class="btn btn-sm"
                        :style="{
                          border: '1px solid #8B6F5C',
                          color: '#8B6F5C',
                          backgroundColor: 'transparent',
                        }"
                        @click="deleteExpense(item.id)"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-brown {
  color: #7c4a2d;
}
.dropdown-menu {
  border-radius: 0.75rem;
  padding: 0.5rem 0;
}
.dropdown-item {
  font-size: 1rem;
  padding-left: 1.25rem;
}
.dropdown-item:hover,
.dropdown-item:focus {
  background-color: #f8f9fa;
}
</style>
