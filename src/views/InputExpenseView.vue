<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

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
const selectedTravel = ref(undefined)
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/travels')
    travels.value = res.data
    console.log(travels.value)
  } catch (err) {
    console.log(err)
  }
})
watch(selectedTravel, (newTravel) => {
  if (newTravel) {
    console.log('여행이 선택되었습니다:', newTravel.title)
    expense.inputName = newTravel.title
    expense.travelsKey = newTravel.id
    expense.date = ''
  }
})

// 양수 정수만 입력되게 검사하는 함수
function validateAmount() {
  if (expense.amount !== '') {
    expense.amount = Math.floor(Number(expense.amount))

    if (expense.amount < 1) {
      expense.amount = 1 // 0이 아니라 1로 고정!
    }
  }
}

async function submitForm() {
  if (!expense) {
    console.error('expense 객체가 없습니다!')
    return
  }

  if (expense.inputName == '') {
    alert('여행을 선택해주세요!')
    return
  } else if (expense.expenseName == '') {
    alert('지출 항목을 입력해주세요!')
    return
  } else if (expense.category == '') {
    alert('카테고리를 선택해주세요!')
    return
  } else if (expense.date == '') {
    alert('여행 날짜를 선택해주세요!')
    return
  }
  try {
    const res = await axios.post('http://localhost:3000/expense', expense)
    console.log('저장 성공', res.data)
  } catch (err) {
    console.log(err)
  }
  alert('지출 내역이 저장되었습니다!')
  router.push('/expense_list')
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
      <label for="inputName">여행 선택</label><br />
      <select id="inputName" v-model="selectedTravel">
        <option v-for="travel in travels" :key="travel.id" :value="travel">
          {{ travel.title }}
        </option>
      </select>

      <label for="expenseDate">여행 날짜</label>
      <input
        id="expenseDate"
        type="date"
        v-model="expense.date"
        :min="selectedTravel?.startDate"
        :max="selectedTravel?.endDate"
        :disabled="!selectedTravel"
      />

      <label for="expenseName">지출 항목</label><br />
      <input
        type="text"
        id="expenseName"
        v-model="expense.expenseName"
        placeholder="지출 항목을 입력해주세요"
      /><br />

      <label for="category">카테고리</label><br />
      <select id="category" v-model="expense.category">
        <option selected hidden value="">카테고리를 선택하세요</option>
        <option>숙박</option>
        <option>식비</option>
        <option>교통</option>
        <option>쇼핑</option>
        <option>관광</option>
        <option>기타</option></select
      ><br />

      <label for="amount">금액</label><br />
      <input
        type="number"
        id="amount"
        v-model="expense.amount"
        :min="1"
        step="1"
        @input="validateAmount"
      /><br />

      <label for="memo">메모</label><br />
      <input type="text" id="memo" v-model="expense.memo" /><br />
      <button @click="cancelForm">취소</button>
      <button type="submit">저장하기</button>
    </form>
  </div>
</template>
<style scoped></style>
