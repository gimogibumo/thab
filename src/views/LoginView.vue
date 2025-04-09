<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="login-card card shadow p-4">
      <h2 class="text-center mb-4">로그인</h2>
      <div class="mb-3">
        <label for="email" class="form-label">이메일</label>
        <input type="email" class="form-control" id="email" v-model="email" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">비밀번호</label>
        <input type="password" class="form-control" id="password" v-model="password" />
      </div>
      <button class="btn btn-brown w-100" @click="login">로그인</button>
      <p class="text-danger mt-2" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

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
</script>

<style scoped>
.login-container {
  height: 100vh;
  background-color: #f8f9fa;
}

.login-card {
  width: 100%;
  max-width: 400px;
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
