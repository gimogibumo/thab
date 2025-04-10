<template>
  <div
    class="login-wrapper d-flex flex-column flex-lg-row align-items-center justify-content-center"
  >
    <!-- 왼쪽: 소개 섹션 -->
    <div
      class="intro-section text-white text-center p-5 d-none d-lg-flex flex-column justify-content-center"
    >
      <h1 class="display-4 fw-bold mb-3">THAB</h1>
      <p class="lead">여행의 모든 순간을 <br />더 똑똑하게 기록하세요 ✈️</p>
      <ul class="feature-list text-start mt-4">
        <li>✔️ 스마트한 여행 가계부</li>
        <li>✔️ 실시간 환율 계산</li>
        <li>✔️ 일정과 지출을 한번에 관리</li>
      </ul>
    </div>

    <!-- 오른쪽: 로그인 카드 -->
    <div class="login-container d-flex align-items-center justify-content-center p-4">
      <div class="login-card card shadow p-4 w-100">
        <h2 class="text-center mb-4">로그인</h2>
        <div class="mb-3">
          <label for="email" class="form-label">이메일</label>
          <input type="email" class="form-control" id="email" v-model="email" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">비밀번호</label>
          <input type="password" class="form-control" id="password" v-model="password" />
        </div>
        <button class="btn btn-brown w-100 mb-2" @click="login">로그인</button>
        <button class="btn btn-outline-secondary w-100" @click="signup">회원가입</button>
        <p class="text-danger mt-2 text-center" v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  try {
    const res = await axios.get('http://localhost:3000/users', {
      params: { email: email.value, password: password.value },
    })

    if (res.data.length > 0) {
      authStore.login(res.data[0])
      router.push('/')
    } else {
      error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
    }
  } catch (err) {
    console.error(err)
    error.value = '로그인 중 오류가 발생했습니다.'
  }
}

const signup = () => {
  router.push('/signup')
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background-color: #fff8f2;
}

/* 왼쪽 소개 영역 */
.intro-section {
  width: 50%;
  min-height: 100vh;
  background-color: #8b6f5c;
  color: white;
}

.feature-list {
  list-style: none;
  padding-left: 0;
  font-size: 1.1rem;
  line-height: 2;
}

/* 오른쪽 로그인 */
.login-container {
  width: 100%;
  max-width: 500px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #e4d3c1;
}

.btn-brown {
  background-color: #8b6f5c;
  color: white;
  border: none;
}

.btn-brown:hover {
  background-color: #7b5c4a;
}
</style>
