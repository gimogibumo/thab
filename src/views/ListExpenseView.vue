<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import axios from 'axios'
import CustomDropdown from '@/components/CustomDropdown.vue'

const filter = reactive({
  selectCategory: '',
  searchTitle: '',
  selectedTravelJson: undefined,
})

const expenseList = ref([])
const editingId = ref(null)
const editedExpense = ref({})
const travels = ref([])
const isModalOpen = ref(false)
const modalData = ref({})

// ✅ 선택된 카테고리 배열
const categoryList = ['숙박', '식비', '교통', '관광', '쇼핑', '기타']
const selectedCategories = ref([...categoryList]) // reactive → ref로 변경

// 여행 날짜 범위 계산
const editingTravelDateRange = computed(() => {
  if (!editedExpense.value || !editedExpense.value.travelsKey) return {}
  const foundTravel = travels.value.find((travel) => travel.id === editedExpense.value.travelsKey)
  return foundTravel ? { start: foundTravel.startDate, end: foundTravel.endDate } : {}
})

// ✅ filter or selectedCategories 변경 시 필터링 실행
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
  if (expense.amount !== '') {
    expense.amount = Math.floor(Number(expense.amount))
    if (expense.amount < 1) expense.amount = 1
  }
}

async function findByTravel() {
  try {
    const res = await axios.get('http://localhost:3000/travels')
    travels.value = res.data
  } catch (err) {
    console.log(err)
  }
}

async function listExpense() {
  try {
    const query = {}

    if (filter.selectedTravelJson) {
      query.travelsKey = filter.selectedTravelJson.id
    }

    const queryString = new URLSearchParams(query).toString()
    const url = `http://localhost:3000/expense${queryString ? `?${queryString}` : ''}`

    const res = await axios.get(url)
    let result = res.data

    // ✅ 카테고리 필터링
    if (selectedCategories.value.length > 0) {
      result = result.filter((item) => selectedCategories.value.includes(item.category))
    }

    // ✅ 키워드 필터링
    const keyword = filter.searchTitle.trim()
    if (keyword !== '') {
      result = result.filter((item) =>
        item.expenseName.toLowerCase().includes(keyword.toLowerCase()),
      )
    }

    expenseList.value = result
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
      console.log(editedExpense)
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

function openModal(item) {
  modalData.value = { ...item }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}
</script>

<template>
  <div class="content">
    <div class="container-fluid py-4 px-3 px-md-5">
      <h1 class="mb-4 fw-bold">지출 내역</h1>
      <div class="card shadow-sm p-4">
        <div class="row g-3 mb-4">
          <!-- 여행 선택 드롭다운 -->
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
            <ul class="dropdown-menu w-100 shadow" aria-labelledby="travelDropdown">
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

          <!-- ✅ 카테고리 드롭다운 연결 -->
          <div class="col-md-4">
            <CustomDropdown v-model:category="selectedCategories" />
          </div>
          <!-- 검색 입력 -->
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

        <!-- 지출 목록 -->
        <div class="row gy-3">
          <div v-for="item in expenseList" :key="item.id" class="col-12">
            <div class="card shadow-sm p-3">
              <div v-if="editingId === item.id">
                <!-- 수정 모드 -->
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
                      <option>숙박</option>
                      <option>식비</option>
                      <option>교통</option>
                      <option>쇼핑</option>
                      <option>관광</option>
                      <option>기타</option>
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
                <!-- 일반 모드 -->
                <div class="d-flex align-items-center justify-content-between flex-wrap">
                  <!-- 날짜 -->
                  <div class="col-md-2 text-muted small">
                    {{ item.date }}
                  </div>

                  <!-- 카테고리 -->
                  <div class="col-md-1">
                    <span class="badge bg-light text-dark">{{ item.category }}</span>
                  </div>

                  <!-- 지출명 / 메모 -->
                  <div class="col-md-3">
                    <div class="fw-bold">{{ item.expenseName }}</div>
                    <div class="text-muted small">{{ item.memo }}</div>
                  </div>

                  <!-- 금액 -->
                  <div class="col-md-3 text-end">
                    <div class="fw-bold">
                      {{ item.amount.toLocaleString() }} {{ item.currency }}
                    </div>
                    <div class="text-muted">{{ item.convertedAmount.toLocaleString() }}원</div>
                  </div>

                  <!-- 버튼 -->
                  <div class="col-md-3 text-end">
                    <div class="btn-group">
                      <!-- <button class="btn btn-outline-secondary btn-sm" @click="openModal(item)">조회</button> -->
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

      <!-- 모달 -->
      <div v-if="isModalOpen" class="modal-backdrop fade show"></div>
      <div
        v-if="isModalOpen"
        class="modal d-block"
        tabindex="-1"
        style="background: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">지출 상세 정보</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <p><strong>여행 항목:</strong> {{ modalData.inputName }}</p>
              <p><strong>지출 내용:</strong> {{ modalData.expenseName }}</p>
              <p>
                <strong>금액:</strong> {{ modalData.amount.toLocaleString() }} JPY /
                {{ (modalData.amount * 10).toLocaleString() }}원
              </p>
              <p><strong>카테고리:</strong> {{ modalData.category }}</p>
              <p><strong>날짜:</strong> {{ modalData.date }}</p>
              <p><strong>메모:</strong> {{ modalData.memo }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal">닫기</button>
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
