<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
const authStore = useAuthStore()

const email = authStore.user.email
const nickname = authStore.user.nickname
const phone = authStore.user.phone
const passwd = authStore.user.password
const name = authStore.user.name

const user = ref(null)
const travelNoti = ref(false)
const showPassword = ref(false)

const modalCheck = ref(false)

const pwd = ref('')
const newPwd = ref('')
const newPwdAgain = ref('')

const maskedPwd = computed(() => '*'.repeat(pwd.value.length))
const maskedNewPwd = computed(() => '*'.repeat(newPwd.value.length))
const maskedNewPwdAgain = computed(() => '*'.repeat(newPwdAgain.value.length))

const pwdError = ref('')
const newPwdError = ref('')
const toLogin = () => {
  authStore.logout()
  router.push('/login')
}
onMounted(async () => {
  try {
    const userId = authStore.user.id
    const userRes = await axios.get(`http://localhost:3000/users/${userId}`)
    user.value = userRes.data
    console.log(user.value)

    travelNoti.value = user.value.travel
    console.log(travelNoti.value + '@@@@@@@')
  } catch (error) {
    console.error('사용자 데이터 로딩 실패:', error)
  }
})

const toggleTravelNoti = async () => {
  try {
    const userId = authStore.user.id
    console.log('Travel Noti Before:', travelNoti.value)
    travelNoti.value = !travelNoti.value

    await axios.patch(`http://localhost:3000/users/${userId}`, {
      travel: travelNoti.value,
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

const handlePwdInput = (e) => {
  handleMaskedInput(e, pwd)
}
const handleNewPwdInput = (e) => {
  handleMaskedInput(e, newPwd)
}
const handleNewPwdAgainInput = (e) => {
  handleMaskedInput(e, newPwdAgain)
}

function handleMaskedInput(e, targetRef) {
  const inputValue = e.target.value
  const prevLength = targetRef.value.length
  const nextLength = inputValue.length

  if (nextLength < prevLength) {
    targetRef.value = targetRef.value.slice(0, nextLength)
  } else {
    const newChar = inputValue[nextLength - 1] || ''
    targetRef.value += newChar
  }

  e.target.value = '*'.repeat(targetRef.value.length)
}

const validateCurrentPwd = () => {
  pwdError.value = pwd.value !== authStore.user.password ? '현재 비밀번호가 일치하지 않습니다.' : ''
}

const validateNewPwd = () => {
  newPwdError.value =
    newPwd.value !== newPwdAgain.value ? '새 비밀번호가 서로 일치하지 않습니다.' : ''
}

const updatePwd = async () => {
  validateCurrentPwd()
  validateNewPwd()

  if (pwdError.value || newPwdError.value) return

  try {
    const updatedPassword = {
      password: newPwd.value,
      passwordCheck: newPwd.value,
    }

    const response = await axios.patch(
      `http://localhost:3000/users/${authStore.user.id}`,
      updatedPassword,
    )

    authStore.user.password = newPwd.value
    authStore.user.passwordCheck = newPwd.value

    alert('비밀번호가 성공적으로 변경되었습니다.')
    modalClose()
  } catch (error) {
    console.error('비밀번호 변경 실패:', error)
    alert('비밀번호 변경에 실패했습니다.')
  }
}
</script>

<template>
  <div class="content">
    <div class="page-title">마이페이지</div>
    <div class="top">
      <div class="first-info">
        <img src="https://placehold.co/100x100" alt="profile" />
        <div class="top-info">
          <div class="top-nickname">{{ nickname }}</div>
          <!--          <div class="register-date">가입일: 2023.02.02</div>-->
        </div>
      </div>
      <hr />
      <div class="info second-info">
        <div class="info-title">이름</div>
        <div class="info-content">{{ name }}</div>
      </div>
      <hr />
      <div class="info third-info">
        <div class="info-title">이메일</div>
        <div class="info-content">{{ email }}</div>
      </div>
      <hr />
      <div class="info fourth-info">
        <div class="info-title">전화번호</div>
        <div class="info-content">{{ phone }}</div>
      </div>
      <hr />
      <div class="info fifth-info">
        <div class="info-title">비밀번호</div>
        <div class="input-group info-content">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            :value="passwd"
            readonly
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
          </button>
        </div>
      </div>
      <hr />
      <div class="btn-info">
        <router-link to="/my_page/update">
          <button class="btn-info-update">정보 수정</button>
        </router-link>
        <button class="btn-pwd-update" @click="modalOpen()">비밀번호 변경</button>
      </div>
    </div>
    <div class="middle">
      <div class="setting-title">알림 설정</div>
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
      <button class="btn-logout" @click="toLogin">로그아웃</button>
    </div>

    <!-- 모달창 ui -->
    <div v-show="modalCheck" class="modal-overlay" @click="modalClose">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <div class="modal-title">비밀번호 변경</div>
          <div>
            <div class="modal-content">현재 비밀번호</div>
            <input
              class="modal-input"
              type="text"
              :value="maskedPwd"
              @input="handlePwdInput"
              @blur="validateCurrentPwd"
            />
            <div v-if="pwdError" class="error-msg">{{ pwdError }}</div>
            <div class="modal-content">새 비밀번호</div>
            <input
              class="modal-input"
              type="text"
              :value="maskedNewPwd"
              @input="handleNewPwdInput"
              @blur="validateNewPwd"
            />
            <div class="modal-content">새 비밀번호 확인</div>
            <input
              class="modal-input"
              type="text"
              :value="maskedNewPwdAgain"
              @input="handleNewPwdAgainInput"
              @blur="validateNewPwd"
            />
            <div v-if="newPwdError" class="error-msg">{{ newPwdError }}</div>
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
  color: #0f2e47;
}

/* ========== 공통 스타일 ========== */
img {
  border-radius: 50%;
}

.top,
.middle,
.bottom {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(15, 46, 71, 0.2);
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
  color: #173e5f;
}

.info-content,
.noti-content {
  font-size: 15px;
  color: #205781;
}

.top-nickname {
  font-size: 22px;
  font-weight: bold;
  color: #0f2e47;
}

.setting-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #173e5f;
}

.top-info {
  margin-left: 30px;
}

.first-info {
  display: flex;
  align-items: center;
}

.noti-box,
.bottom {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.input-group .form-control {
  border: none;
  padding: 0;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  color: #0f2e47;
}

.btn.btn-outline-secondary {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

/* ========== 버튼 스타일 ========== */
button {
  cursor: pointer;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
}

.btn-info-update {
  background: #205781;
  color: white;
  flex: 1;
  margin-right: 10px;
}

.btn-pwd-update {
  background: white;
  color: #205781;
  border: 1px solid #205781;
  flex: 1;
}

.btn-logout {
  border: 1px solid #4a7aa4;
  padding: 4px 15px;
  background: white;
  color: #4a7aa4;
}

.btn.btn-outline-secondary i {
  font-size: 1.2rem;
  color: #205781;
  transition: color 0.2s ease;
}

.btn.btn-outline-secondary:hover i {
  color: #4a7aa4;
  opacity: 1;
}

/* ========== 토글 스위치 ========== */
[type='checkbox'] {
  appearance: none;
  position: relative;
  width: 2.25em;
  height: 1.25em;
  border: max(2px, 0.1em) solid #4a7aa4;
  border-radius: 1.25em;
}

[type='checkbox']::before {
  content: '';
  position: absolute;
  left: 0;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: #4a7aa4;
  transform: scale(0.8);
  transition: left 250ms linear;
}

[type='checkbox']:checked {
  background-color: #205781;
  border-color: #173e5f;
}

[type='checkbox']:checked::before {
  background-color: white;
  left: 1em;
}

[type='checkbox']:disabled {
  border-color: lightgray;
  opacity: 0.7;
  cursor: not-allowed;
}

[type='checkbox']:disabled::before {
  background-color: lightgray;
}

[type='checkbox']:disabled + span {
  opacity: 0.7;
  cursor: not-allowed;
}

[type='checkbox']:focus-visible {
  outline: max(2px, 0.1em) solid #205781;
  outline-offset: max(2px, 0.1em);
}

[type='checkbox']:enabled:hover {
  box-shadow: 0 0 0 max(4px, 0.2em) #cfdde8;
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
  box-shadow: 0 4px 20px rgba(15, 46, 71, 0.15);
  position: relative;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #0f2e47;
}

.modal-content {
  margin-bottom: 10px;
  color: #205781;
}

.modal-input {
  margin-bottom: 15px;
}

.modal-content input[type='text'] {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #cfdde8;
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
  background: #cfdde8;
  color: #205781;
}

.save {
  background: #205781;
  color: white;
}

.error-msg {
  color: red;
  font-size: 14px;
  margin-top: -15px;
  margin-bottom: 10px;
}

/* ========== 글로벌 스타일 ========== */
body {
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8fafc;
  color: #0f2e47;
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
