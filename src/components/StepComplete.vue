<template>
  <div class="complete-wrapper d-flex justify-content-center align-items-center text-center">
    <div class="complete-card shadow p-4 rounded">
      <h2 class="mb-3 fw-bold text-success">🎉 가입 완료!</h2>
      <p class="mb-3">THAB에 오신 것을 환영합니다!<br />아래 정보를 확인해주세요.</p>

      <div class="user-info text-start mb-4">
        <p><strong>이름:</strong> {{ formData.name }}</p>
        <p><strong>이메일:</strong> {{ formData.email }}</p>
      </div>

      <button class="btn btn-brown w-100" @click="$emit('reset')">로그인 하러 가기</button>
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
.complete-wrapper {
  min-height: 100vh;
  background-color: #fff8f2;
  padding: 40px 20px;
}

.complete-card {
  max-width: 400px;
  background-color: #fff;
  border: 1px solid #e4d3c1;
  border-radius: 16px;
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
