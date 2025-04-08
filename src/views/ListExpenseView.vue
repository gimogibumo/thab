<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import axios from 'axios'

const filter = reactive({
  selectCategory: '',
  searchTitle: '',
  selectedTravelJson: undefined,
})
const expenseList = ref([])
const editingId = ref(null) // ⭐ 현재 수정 중인 ID 저장
const editedExpense = ref({}) // ⭐ 수정할 값 임시 저장
const travels = ref([])
const isModalOpen = ref(false)
const modalData = ref({})
const editingTravelDateRange = computed(() => {
  if (!editedExpense.value || !editedExpense.value.travelsKey) return {}

  const foundTravel = travels.value.find((travel) => travel.id === editedExpense.value.travelsKey)

  if (foundTravel) {
    return {
      start: foundTravel.startDate,
      end: foundTravel.endDate,
    }
  } else {
    return {}
  }
})
watch(filter, (newValue, oldValue) => {
  console.log(filter)
  listExpense()
})
onMounted(() => {
  listExpense()
  findByTravel()
})

async function findByTravel() {
  try {
    const res = await axios.get('http://localhost:3000/travels')
    travels.value = res.data
    console.log(travels.value)
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

    if (filter.selectCategory) {
      query.category = filter.selectCategory
    }

    if (filter.searchTitle) {
      query.inputName_like = filter.searchTitle
    }

    const queryString = new URLSearchParams(query).toString()
    const url = `http://localhost:3000/expense${queryString ? `?${queryString}` : ''}`

    const res = await axios.get(url)
    let result = res.data
    const keyword = filter.searchTitle.trim()
    if (keyword !== '') {
      result = result.filter((item) =>
        item.expenseName.toLowerCase().includes(keyword.toLowerCase()),
      )
    }
    expenseList.value = result
    console.log('서버에서 가져온 데이터', expenseList.value)
  } catch (err) {
    console.log(err)
  }
}
async function deleteExpense(id) {
  try {
    if (confirm('정말 삭제하시겠습니까?')) {
      const res = await axios.delete(`http://localhost:3000/expense/${id}`)
      listExpense()
    }
  } catch (err) {
    console.log(err)
  }
}
function startEditing(item) {
  if (confirm('지출 내역을 수정하시겠습니까?')) {
    editingId.value = item.id
    editedExpense.value = { ...item } // 복사해서 수정 시작
  }
}

async function saveExpense(id) {
  if (confirm('수정된 내용을 저장하시겠습니까?')) {
    try {
      await axios.put(`http://localhost:3000/expense/${id}`, editedExpense.value)
      editingId.value = null
      listExpense() // 저장 후 다시 목록 불러오기
    } catch (err) {
      console.log(err)
    }
  }
}

function cancelEditing(title) {
  if (confirm('지출 내역 수정을 취소하시겠습니까? (작성한 내용들은 저장되지 않고 사라집니다)')) {
    editingId.value = null
  }
}

function changeKeyword(e) {
  filter.searchTitle = e.target.value
}

function openModal(item) {
  modalData.value = { ...item } // 선택한 item 복사
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}
</script>
<template>
  <div class="content">
    <h1>지출 내역</h1>
    <select v-model="filter.selectedTravelJson">
      <option selected :value="undefined">전체 여행</option>
      <option v-for="travel in travels" :key="travel.id" :value="travel">
        {{ travel.title }}
      </option></select
    ><br />
    <select v-model="filter.selectCategory">
      <option selected value="">전체 카테고리</option>
      <option>숙박</option>
      <option>식비</option>
      <option>교통</option>
      <option>쇼핑</option>
      <option>관광</option>
      <option>기타</option></select
    ><br />
    <input
      type="text"
      placeholder="검색어를 입력하세요"
      v-model="filter.searchTitle"
      @input="changeKeyword"
    />
    <div v-for="item in expenseList" :key="item.id" class="expense-card">
      <div v-if="editingId === item.id">
        <!-- 수정 모드 -->
        <input type="text" v-model="editedExpense.expenseName" placeholder="지출 이름 입력" />
        <input type="number" v-model="editedExpense.amount" placeholder="금액 입력" />원
        <select v-model="editedExpense.category">
          <option>숙박</option>
          <option>식비</option>
          <option>교통</option>
          <option>쇼핑</option>
          <option>관광</option>
          <option>기타</option>
        </select>
        <input
          type="date"
          v-model="editedExpense.date"
          :min="editingTravelDateRange.start"
          :max="editingTravelDateRange.end"
        />
        <input type="text" v-model="editedExpense.memo" />
      </div>

      <div v-else>
        <!-- 일반 모드 -->
        <h3 class="expense-name">{{ item.expenseName }}</h3>
        <p class="expense-amount">{{ item.amount.toLocaleString() }}원</p>
        <p class="expense-category">{{ item.category }}</p>
        <p class="expense-date">
          {{ item.date }}
        </p>
      </div>

      <div>
        <button v-if="editingId === item.id" @click="saveExpense(item.id)">저장</button>
        <button v-if="editingId === item.id" @click="cancelEditing">취소</button>

        <template v-else>
          <button @click="openModal(item)">조회</button>
          <button @click="startEditing(item)">수정</button>
          <button @click="deleteExpense(item.id)">삭제</button>
        </template>

        <div v-if="isModalOpen" class="modal-overlay">
          <div class="modal-content">
            <h2>지출 상세 정보</h2>
            <p><strong>여행 항목 </strong></p>
            <div>{{ modalData.inputName }}</div>
            <p><strong>지출 내용 </strong></p>
            <div>{{ modalData.expenseName }}</div>
            <p><strong>금액 </strong></p>
            <div>{{ modalData.amount.toLocaleString() }}원</div>
            <p><strong>카테고리 </strong></p>
            <div>{{ modalData.category }}</div>
            <p><strong>날짜 </strong></p>
            <div>{{ modalData.date }}</div>
            <p><strong>메모 </strong></p>
            <div>{{ modalData.memo }}</div>
            <button @click="closeModal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
