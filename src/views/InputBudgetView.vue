<script setup>
import { ref, reactive } from 'vue'

const goals = reactive([
  {
    id: 1,
    title: '도쿄 여행',
    date: '2024.01.15',
    saved: 1650000,
    target: 2000000,
    details: [
      { date: '2025.04.08', title: '연말 보너스', amount: 1153000 },
      { date: '2025.04.01', title: '커피값 아낌 ㅎㅎ', amount: 20000 }
    ]
  },
  {
    id: 2,
    title: '파리 여행',
    date: '2024.07.01',
    saved: 500000,
    target: 3000000,
    details: [
      { date: '2025.04.01', title: '부수입', amount: 300000 }
    ]
  }
])

const savedAmount = 1650000
const targetAmount = 2000000

const progressPercent = Math.floor((savedAmount / targetAmount) * 100)
const remainingAmount = targetAmount - savedAmount

const selectedId = ref(null)
const modalCheck = ref(false)
const selectedGoal = ref(null)

function modalOpen(goal) {
  modalCheck.value = true
  selectedGoal.value = goal
}

function modalClose() {
  modalCheck.value = false
}

function selectCard(id) {
  if (selectedId.value === id) {
    selectedId.value = null
    selectedGoal.value = null
  } else {
    selectedId.value = id
    selectedGoal.value = goals.find((goal) => goal.id === id) || null
  }
}

</script>
<template>
  <div class="content">
    <div class="container">
      <div class="page-title">예산 모으기</div>
      <div class="goal-wrap" v-for="goal in goals" :key="goal.id">
        <div class="goal-card"
             :class="[
               { active: selectedId === goal.id },
               selectedId !== null ? 'shrinked' : ''
             ]"
             @click="selectCard(goal.id)">
          <div class="top">
            <div>
              <div class="title">{{ goal.title }}</div>
              <div class="date">목표일: {{ goal.date }}</div>
            </div>
            <div class="amount">
              <div class="saved">{{ goal.saved }}원</div>
              <div class="target">목표: {{ goal.target }}원</div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="bottom">
            <div>{{ progressPercent }}% 달성</div>
            <div>잔여: {{ remainingAmount.toLocaleString() }}원</div>
          </div>
        </div>
        </div>

        <div class="slide-panel" :class="{ active: selectedId !== null }">
          <button class="slide-close-btn" @click="selectCard(null)">×</button>
          <div v-if="selectedGoal">
            <div class="title">{{ selectedGoal.title }} 저축 내역</div>
            <div class="list-content"
                 v-for="item in selectedGoal.details"
                 :key="item.date + item.title">
              <div>
                <div class="input-date">{{ item.date }}</div>
                <div class="input-title">{{ item.title }}</div>
              </div>
              <div class="input">+{{ item.amount.toLocaleString() }}원</div>
            </div>
            <button class="open-modal-btn" @click="modalOpen(selectedGoal)">저축하기</button>
          </div>
      </div>

      <!-- 모달창 ui -->
      <div v-show="modalCheck" class="modal-overlay" @click="modalClose">
        <div class="modal-container" @click.stop>
          <div class="modal-content">
            <div class="modal-title">{{ selectedGoal?.title }}에 저축하기</div>
            <div>
              <div class="save-money">저축 금액</div>
              <input type="text" placeholder="금액을 입력하세요" />
              <div class="save-memo">메모</div>
              <input type="text" placeholder="메모를 입력하세요" />
            </div>
          </div>
          <div class="modal-btn">
            <button @click="modalClose">닫기</button>
            <button @click="modalClose">확인</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Layout ===== */
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

.content {
  padding: 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
}

/* ===== Goal Card ===== */
.goal-wrap {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  margin-bottom: 40px;
}

.goal-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

/* ===== Budget List (Details) ===== */
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

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  border-radius: 10px;
  width: 550px;
  padding: 30px 20px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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

/* ===== Modal Buttons ===== */
.modal-btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-btn button {
  background-color: #7B5E48;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  margin-left: 10px;
  cursor: pointer;
}

/* ===== Button: "저축하기" ===== */
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
