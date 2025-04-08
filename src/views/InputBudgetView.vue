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

// const isSelected = ref(false)
const selectedId = ref(null)

function selectCard(id) {
  selectedId.value = selectedId.value === id ? null : id
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
        <div class="budget-list" v-if="selectedId === goal.id">
          <div class="title">{{ goal.title }} 저축 내역</div>
          <div class="list-content"
               v-for="item in goal.details"
               :key="item.date + item.title">
            <div>
              <div class="input-date">{{ item.date }}</div>
              <div class="input-title">{{ item.title }}</div>
            </div>
            <div class="input">+{{ item.amount.toLocaleString() }}원</div>
          </div>
        </div>
      </div>
      <div class="btn-save">저축하기</div>
    </div>
  </div>
</template>

<style scoped>
.btn-save {
  background: #8B6F5C;
  border-radius: 8px;
  text-align: center;
  color: white;
  padding: 15px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
}

.goal-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  width: 1000px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
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

.goal-card:hover {
  border: 0.1rem #7B5E48 solid;
}

/* 예산 카드 클릭 시 */
.goal-card.active {
  border: 0.1rem #7B5E48 solid;
  background: rgba(122, 94, 72, 0.2);
  max-width: 800px;
}

.goal-wrap {
  //position: relative;
  display: flex;
  align-items: flex-start; /* 위쪽 정렬 */
  gap: 40px;
}

.budget-list {
  //position: absolute;
  display: block;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  width: 300px;
  margin-left: 100px;
  float: right;
}

.list-content {
  background: #F8F9FD;
  display: flex;
  justify-content: space-between;
  padding: 14px;
  font-size: 14px;
  border-radius: 12px;
  margin-top: 20px;
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

</style>
