<script setup>

import { onMounted, ref } from 'vue'
import axios from 'axios'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = authStore.user.email
const nickname = authStore.user.nickname
const phone = authStore.user.phone
const passwd = authStore.user.password
const name = authStore.user.name

const modalCheck = ref(false)
const user = ref(null)
const travelNoti = ref(null)

onMounted(async () => {
  try {
    const userId = authStore.user.id
    const userRes = await axios.get(`http://localhost:3000/users/${userId}`)
    user.value = userRes.data
    console.log(user.value)

    travelNoti.value = user.value.travelToggle

    console.log(travelNoti.value + "@@@@@@@")
  } catch (error) {
    console.error('사용자 데이터 로딩 실패:', error)
  }
})


const toggleTravelNoti = async () => {
  try {
    const userId = authStore.user.id
    console.log('Travel Noti Before:', travelNoti.value);
    travelNoti.value = !travelNoti.value

    await axios.patch(`http://localhost:3000/users/${userId}`, {
      travelToggle: travelNoti.value,
    })

    console.log('여행 알림 상태 업데이트 완료', travelNoti.value)
  } catch (error) {
    console.error('업데이트 실패', error)
    travelNoti.value = !travelNoti.value
  }
}

// 모달 열기
function modalOpen() {
  modalCheck.value = true
}

// 모달 닫기
function modalClose() {
  modalCheck.value = false
}



</script>

<template>
  <div class="content">
    <div class="page-title">마이페이지</div>
    <div class="top">
      <div class="first-info">
        <img src="https://placehold.co/100x100" alt="profile">
        <div class="top-info">
          <div class="top-nickname">{{ nickname }}</div>
          <!--          <div class="register-date">가입일: 2023.02.02</div>-->
        </div>
      </div>
      <hr>
      <div class="info second-info">
        <div class="info-title">이름</div>
        <div class="info-content">{{ name }}</div>
      </div>
      <hr>
      <div class="info third-info">
        <div class="info-title">이메일</div>
        <div class="info-content">{{ email }}</div>
      </div>
      <hr>
      <div class="info fourth-info">
        <div class="info-title">전화번호</div>
        <div class="info-content">{{ phone }}</div>
      </div>
      <hr>
      <div class="info fifth-info">
        <div class="info-title">비밀번호</div>
        <div class="info-content">{{ passwd }}</div>
      </div>
      <hr>
      <div class="btn-info">
        <router-link to="/my_page/update">
          <button class="btn-info-update">정보 수정</button>
        </router-link>
        <button class="btn-pwd-update" @click="modalOpen()">비밀번호 변경</button>
      </div>
    </div>
    <div class="middle">
      <div class="setting-title"> 알림 설정</div>
      <div class="noti-box">
        <div>
          <div class="noti-title">여행 일정 알림</div>
          <div class="noti-content">여행 시작일이 다가오면 알림</div>
        </div>
        <input
          role="switch"
          type="checkbox"
          class="noti-toggle"
          v-model="travelNoti"
          @click="toggleTravelNoti"
        />
      </div>
      <!--      <div class="noti-box">
              <div>
                <div class="noti-title">예산 경고 알림</div>
                <div class="noti-content">여행 예산의 80% 이상 사용시 알림</div>
              </div>
              <input role="switch" type="checkbox" class="noti-toggle" />
            </div>
            <div class="noti-box">
              <div>
                <div class="noti-title">저축 목표 알림</div>
                <div class="noti-content">저축 목표 달성률 90% 도달시 알림</div>
              </div>
              <input role="switch" type="checkbox" class="noti-toggle" />
            </div>-->
    </div>
    <div class="bottom">
      <div>
        <div class="logout-title">로그아웃</div>
        <div class="logout-content">계정에서 로그아웃합니다.</div>
      </div>
      <button class="btn-logout">로그아웃</button>
    </div>


    <!-- 모달창 ui -->
    <div v-show="modalCheck" class="modal-overlay" @click="modalClose">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <div class="modal-title">비밀번호 변경</div>
          <div>
            <div class="modal-content">현재 비밀번호</div>
            <input class="modal-input" type="text" v-model="pwd" />
            <div class="modal-content">새 비밀번호</div>
            <input class="modal-input" type="text" v-model="newPwd" />
            <div class="modal-content">새 비밀번호 확인</div>
            <input class="modal-input" type="text" v-model="newPwdAgain" />
          </div>
        </div>
        <div class="modal-btn">
          <button class="cancel" @click="modalClose">취소</button>
          <button class="save" @click="updatePwd">변경</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* ========== 기본 구조 ========== */
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

/* ========== 공통 스타일 ========== */
img {
  border-radius: 50%;
}

.top, .middle, .bottom {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 80%;
  margin: 0 auto 50px;
}

.info {
  margin: 20px 10px;
}

.info-title,
.noti-title,
.logout-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.info-content,
.noti-content {
  font-size: 15px;
}

.top-nickname {
  font-size: 22px;
  font-weight: bold;
}

.setting-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.top-info {
  margin-left: 30px;
}

.first-info {
  display: flex;
  align-items: center;
}

.noti-box, .bottom {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

/* ========== 버튼 스타일 ========== */
button {
  cursor: pointer;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
}

.btn-info-update {
  background: #8B6F5C;
  color: white;
  flex: 1;
  margin-right: 10px;
}

.btn-pwd-update {
  background: white;
  color: #8B6F5C;
  border: 1px #8B6F5C solid;
  flex: 1;
}

.btn-logout {
  border: 1px #7b5c4a solid;
  padding: 4px 15px;
  background: white;
}

/* ========== 토글 스위치 ========== */
[type="checkbox"] {
  appearance: none;
  position: relative;
  width: 2.25em;
  height: 1.25em;
  border: max(2px, 0.1em) solid gray;
  border-radius: 1.25em;
}

[type="checkbox"]::before {
  content: "";
  position: absolute;
  left: 0;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: gray;
  transform: scale(0.8);
  transition: left 250ms linear;
}

[type="checkbox"]:checked {
  background-color: #8B6F5C;
  border-color: #7B5E48;
}

[type="checkbox"]:checked::before {
  background-color: white;
  left: 1em;
}

[type="checkbox"]:disabled {
  border-color: lightgray;
  opacity: 0.7;
  cursor: not-allowed;
}

[type="checkbox"]:disabled::before {
  background-color: lightgray;
}

[type="checkbox"]:disabled + span {
  opacity: 0.7;
  cursor: not-allowed;
}

[type="checkbox"]:focus-visible {
  outline: max(2px, 0.1em) solid #7b5c4a;
  outline-offset: max(2px, 0.1em);
}

[type="checkbox"]:enabled:hover {
  box-shadow: 0 0 0 max(4px, 0.2em) lightgray;
}

/* ========== 모달 ========== */
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.modal-content {
  margin-bottom: 10px;
}

.modal-input {
  margin-bottom: 15px;
}

.modal-content input[type="text"] {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.modal-btn {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-btn button {
  flex: 1;
  padding: 8px 16px;
}

.cancel {
  background: #F4F0ED;
  color: #8B6F5C;
}

.save {
  background: #8B6F5C;
  color: white;
}

/* ========== 글로벌 스타일 ========== */
body {
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

fieldset {
  border: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

</style>
