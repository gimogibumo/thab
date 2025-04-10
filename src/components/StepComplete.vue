<template>
  <div class="complete-wrapper d-flex justify-content-center align-items-center text-center">
    <div class="complete-card shadow-lg p-5 rounded-4 animate__animated animate__fadeInUp">
      <h2 class="mb-3 fw-bold text-success fs-3">🎉 가입 완료!</h2>
      <p class="mb-4 text-secondary fs-6">
        THAB에 오신 것을 환영합니다!<br />아래 정보를 확인해주세요.
      </p>

      <div class="user-info text-start mb-4 fs-6">
        <p><strong>이름:</strong> {{ formData.name }}</p>
        <p><strong>이메일:</strong> {{ formData.email }}</p>
      </div>

      <button class="btn btn-brown w-100 py-2 fw-semibold fs-6" @click="$emit('reset')">
        로그인 하러 가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import axios from 'axios'

const props = defineProps({
  formData: Object,
})

axios.post('http://localhost:3000/users', props.formData)

const emit = defineEmits(['reset'])
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.complete-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom, #fff8f2, #f6eee9);
  padding: 40px 20px;
}

.complete-card {
  max-width: 420px;
  width: 100%;
  background-color: #fff;
  border: 1px solid #e4d3c1;
  border-radius: 24px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}

.btn-brown {
  background-color: #8b6f5c;
  color: white;
  border: none;
  transition: all 0.2s ease;
}

.btn-brown:hover {
  background-color: #7b5c4a;
  transform: scale(1.02);
}

.btn-brown:active {
  transform: scale(0.98);
}
</style>
