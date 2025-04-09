<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const income = ref([])
const travels = ref(null)

const selectedId = ref(null)
const selectedIncome = ref(null)
const modalCheck = ref(false)
const inputBudget = ref('')
const inputMemo = ref('')
const selectedDetailIndex = ref(null) // 몇 번째를 수정할 건지 추적
const categories = [
      { id: 1, name: '식비' },
      { id: 2, name: '교통' },
      { id: 3, name: '숙박' },
      { id: 4, name: '쇼핑' },
      { id: 5, name: '관광' },
      { id: 6, name: '기타' }
    ]

onMounted(async () => {
  try {
    const [travelRes, incomeRes] = await Promise.all([
      axios.get('http://localhost:3000/travel'),
      axios.get('http://localhost:3000/income')
    ])

    const travelList = travelRes.data.map(travel => {
      const matchedIncome = incomeRes.data.find(i => i.travelId === travel.id)
      const totalSaved = matchedIncome ? matchedIncome.saved : 0
      const details = matchedIncome ? matchedIncome.details : []

      return {
        ...travel,
        saved: totalSaved,
        details
      }
    })

    travels.value = travelList
    income.value = incomeRes.data
  } catch (err) {
    console.error('데이터 불러오기 실패:', err)
  }
})


// 저축하기
async function addIncome() {
  const amount = parseInt(inputBudget.value.replace(/[^0-9]/g, ''))
  const memo = inputMemo.value

  if (!amount || amount <= 0) {
    alert('유효한 금액을 입력해주세요.')
    return
  }

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.')

  if (!selectedIncome.value) {
    alert('선택된 여행이 없습니다.')
    return
  }

  const existing = income.value.find(i => i.travelId === selectedIncome.value.id)

  if (selectedDetailIndex.value !== null) {
    // 수정 모드일 때
    const oldDetail = selectedIncome.value.details[selectedDetailIndex.value]

    // 저장 금액 업데이트
    selectedIncome.value.saved -= oldDetail.amount
    selectedIncome.value.saved += amount

    const updatedDetail = {
      ...oldDetail,
      title: memo,
      amount,
      date: oldDetail.date // 날짜는 유지
    }

    selectedIncome.value.details[selectedDetailIndex.value] = updatedDetail
    selectedDetailIndex.value = null

    // 기존 income에도 반영
    if (existing) {
      existing.details = [...selectedIncome.value.details]
      existing.saved = selectedIncome.value.saved

      try {
        await axios.patch(`http://localhost:3000/income/${existing.id}`, {
          details: existing.details,
          saved: existing.saved
        })
      } catch (err) {
        console.error('수정 저장 실패:', err)
      }
    }

  } else {
    // 새로 추가하는 경우
    const newDetail = {
      date: today,
      title: memo,
      category: '저축',
      amount
    }

    if (existing) {
      existing.saved += amount
      // existing.details.unshift(newDetail)

      try {
        await axios.patch(`http://localhost:3000/income/${existing.id}`, {
          details: existing.details,
          saved: existing.saved
        })
      } catch (err) {
        console.error('저축 수정 실패:', err)
      }

      selectedIncome.value.details.unshift(newDetail)
      selectedIncome.value.saved += amount

    } else {
      const newIncome = {
        travelId: selectedIncome.value.id,
        saved: amount,
        details: [newDetail]
      }

      try {
        const res = await axios.post('http://localhost:3000/income', newIncome)
        income.value.push(res.data)
      } catch (err) {
        console.error('새 저축 추가 실패:', err)
      }

      selectedIncome.value.details = [newDetail]
      selectedIncome.value.saved = amount
    }
  }

  const travelItem = travels.value.find(t => t.id === selectedIncome.value.id)
  if (travelItem) {
    travelItem.saved = selectedIncome.value.saved
  }

  // 초기화
  inputBudget.value = ''
  inputMemo.value = ''
  modalClose()
}

// 모달 열기
function modalOpen(income) {
  modalCheck.value = true
  selectedIncome.value = income
}

// 모달 닫기
function modalClose() {
  modalCheck.value = false
  inputBudget.value = ''
  inputMemo.value = ''
}

// 목표 예산 카드 선택하기
function selectCard(id) {
  if (selectedId.value === id) {
    selectedId.value = null
    selectedIncome.value = null
  } else {
    selectedId.value = id
    selectedIncome.value = travels.value.find((income) => income.id === id) || null
  }
}

function editDetail(index) {
  const item = selectedIncome.value.details[index]
  inputBudget.value = item.amount.toString()
  inputMemo.value = item.title
  selectedDetailIndex.value = index
  modalCheck.value = true
}

async function deleteDetail(index) {
  if (!selectedIncome.value) return

  // 실제 삭제
  selectedIncome.value.details.splice(index, 1)

  // 저장액 재계산
  selectedIncome.value.saved = selectedIncome.value.details.reduce((sum, d) => sum + d.amount, 0)

  // income에도 반영
  const existing = income.value.find(i => i.travelId === selectedIncome.value.id)
  if (existing) {
    existing.details = [...selectedIncome.value.details]
    existing.saved = selectedIncome.value.saved

    try {
      await axios.patch(`http://localhost:3000/income/${existing.id}`, {
        details: existing.details,
        saved: existing.saved
      })
    } catch (err) {
      console.error('삭제 후 저장 실패:', err)
    }
  }
  const travelItem = travels.value.find(t => t.id === selectedIncome.value.id)
  if (travelItem) {
    travelItem.saved = selectedIncome.value.saved
  }
}


</script>
<template>
  <div class="content">
    <div class="page-title">예산 모으기</div>
    <div class="goal-wrap" v-for="travel in travels" :key="travel.id">
      <div class="goal-card"
           :class="[
               { active: selectedId === travel.id },
               selectedId !== null ? 'shrinked' : '']"
           @click="selectCard(travel.id)">
        <div class="top">
          <div>
            <div class="title">{{ travel.title }}</div>
            <div class="date">목표일: {{ travel.startDate }}</div>
          </div>
          <div class="amount">
            <div class="saved">{{ travel.saved.toLocaleString() }}원</div>
            <div class="target">목표: {{ travel.totalBudget.toLocaleString() }}원</div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress"
               :style="{ width: Math.floor((travel.saved / travel.totalBudget) * 100) + '%' }"></div>
        </div>
        <div class="bottom">
          <div>{{ Math.floor((travel.saved / travel.totalBudget) * 100) }}% 달성</div>
          <div>잔여: {{ (travel.totalBudget - travel.saved).toLocaleString() }}원</div>
        </div>
      </div>
    </div>

    <!-- 사이드 패널 -->
    <div class="slide-panel" :class="{ active: selectedId !== null }">
      <button class="slide-close-btn" @click="selectCard(null)">×</button>
      <div v-if="selectedIncome">
        <div class="title">{{ selectedIncome.title }} 저축 내역</div>
        <div class="list-content"
             v-for="(item, index) in selectedIncome.details"
             :key="item.date + item.title">
          <div>
            <div class="input-date">{{ item.date }}</div>
            <div class="input-title">{{ item.title }}</div>
          </div>
          <div class="input">+{{ item.amount }}원</div>
          <div class="category">{{ item.category }}</div>
          <div class="icons">
            <button @click="editDetail(index)">✏️</button>
            <button @click="deleteDetail(index)">🗑️</button>
          </div>
        </div>
        <button class="open-modal-btn" @click="modalOpen(selectedIncome)">저축하기</button>
      </div>
    </div>

    <!-- 모달 -->
   <!-- 모달 -->
<div v-show="modalCheck" class="modal-overlay" @click="modalClose">
  <div class="modal-container" @click.stop>
    <div class="modal-content">
      <div class="modal-title">{{ selectedIncome?.title }}에 저축하기</div>
      <div>
        <div class="modal-content">저축 금액</div>
        <input class="modal-input" type="text" v-model="inputBudget"
               placeholder="금액을 입력하세요" />

        <div class="modal-content">카테고리</div>
        <select class="modal-input" v-model="selectedCategory">
          <option disabled value="">카테고리를 선택하세요</option>
          <option v-for="category in categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>

        <div class="modal-content">메모</div>
        <input class="modal-input" type="text" v-model="inputMemo"
               placeholder="메모를 입력하세요" />
      </div>
    </div>
    <div class="modal-btn">
      <button class="cancel" @click="modalClose">취소</button>
      <button class="save" @click="addIncome">저축하기</button>
    </div>
  </div>
</div>

  </div>
</template>

<style scoped>
.content {
  padding: 3% 5%;
}

.content::-webkit-scrollbar {
  display: none;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
}

/* ===== 목표 예산 ===== */
.goal-wrap {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  margin-bottom: 40px;
}

.goal-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 1000px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.goal-card:hover {
  border: 0.1rem #7B5E48 solid;
}

.goal-card.active {
  border: 0.1rem #7B5E48 solid;
  background: rgba(122, 94, 72, 0.2);
  max-width: 800px;
}

.goal-card.shrinked {
  max-width: 800px;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.title {
  font-weight: bold;
  font-size: 16px;
}

.date {
  font-size: 13px;
  color: #888;
}

.amount {
  text-align: right;
}

.saved {
  font-weight: bold;
  font-size: 15px;
  color: #7B5E48;
}

.target {
  font-size: 13px;
  color: #aaa;
}

.progress-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.progress {
  height: 100%;
  background: #7B5E48;
  transition: width 0.3s ease;
}

.bottom {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
}

/* ===== 저축 내역 ===== */
.budget-list .title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.list-content {
  background: #F8F9FD;
  display: flex;
  justify-content: space-between;
  padding: 14px;
  font-size: 14px;
  border-radius: 12px;
  margin-top: 16px;
}

.input {
  font-weight: bold;
  font-size: 16px;
  color: #7B5E48;
}

.input-title {
  font-size: 14px;
  margin-top: 10px;
}

.input-date {
  font-size: 12px;
  color: #888;
}

/* ===== 모달 ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2200;
}

.modal-container {
  background: #fff;
  border-radius: 10px;
  width: 400px;
  padding: 30px 20px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-content {
  margin-bottom: 10px;
}

.modal-input {
  margin-bottom: 15px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.modal-content input[type="text"] {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

/* ===== 모달 버튼 ===== */
.modal-btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-btn button {
  flex: 1;
  margin: 0 auto;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.modal-btn {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.cancel {
  background: #F4F0ED;
  color: #8B6F5C;
}

.save {
  background: #8B6F5C;
  color: white;
}

.modal-input-memo, .modal-input-money {
  margin-top: 10px;
}

.modal-memo {
  margin-top: 20px;
}

/* ===== 저축하기 버튼 ===== */
.open-modal-btn {
  background: #7B5E48;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

/* ===== 슬라이드 패널 ===== */
.slide-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 30px 20px;
  z-index: 2000;
  transition: transform 0.3s ease;
  transform: translateX(100%);
}

.slide-panel.active {
  transform: translateX(0);
}

.slide-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  cursor: pointer;
  background: none;
  border: none;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icons button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* 태블릿 대응 (768px 이하) */
@media (max-width: 768px) {
  .goal-wrap {
    flex-direction: column;
    gap: 20px;
  }

  .goal-card,
  .budget-list {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    float: none;
  }

  .budget-list {
    margin-left: 0;
    margin-top: 20px;
  }

  .modal-container {
    width: 90%;
    padding: 20px 15px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-btn {
    flex-direction: column;
    gap: 10px;
  }

  .modal-btn button {
    width: 100%;
  }

  .open-modal-btn {
    width: 100%;
    margin-top: 10px;
  }

  .top,
  .bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .amount {
    text-align: left;
  }

  /* 폰트 사이즈 축소 */
  .page-title {
    font-size: 20px;
  }

  .title {
    font-size: 15px;
  }

  .date,
  .target,
  .bottom {
    font-size: 12px;
  }

  .saved {
    font-size: 14px;
  }

  .input-title {
    font-size: 13px;
  }

  .input {
    font-size: 15px;
  }

  .list-content {
    font-size: 13px;
  }
}

/* 모바일 대응 (480px 이하) */
@media (max-width: 480px) {
  .modal-title {
    font-size: 16px;
  }

  .page-title {
    font-size: 18px;
    text-align: center;
  }

  .title {
    font-size: 14px;
  }

  .saved {
    font-size: 13px;
  }

  .target,
  .date,
  .bottom,
  .input,
  .input-title {
    font-size: 12px;
  }

  .modal-btn button {
    font-size: 14px;
    padding: 10px 12px;
  }

  .open-modal-btn {
    font-size: 14px;
    padding: 10px;
  }

  .goal-card {
    padding: 16px;
  }

  .budget-list {
    padding: 16px;
  }

  .list-content {
    padding: 10px;
  }
}

</style>
