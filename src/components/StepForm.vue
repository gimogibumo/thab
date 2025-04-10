<template>
  <div class="card shadow-sm p-4 signup-form">
    <h2 class="text-center mb-4">2. 정보 입력</h2>

    <div class="mb-3">
      <label class="form-label">이름</label>
      <input v-model="formData.name" class="form-control" placeholder="이름 입력" />
    </div>

    <div class="mb-3">
      <label class="form-label">닉네임</label>
      <input v-model="formData.nickname" class="form-control" placeholder="닉네임 입력" />
      <div v-if="nickname && !isNicknameValid" class="form-text text-danger">
        닉네임은 2~10자의 한글, 영문 또는 숫자여야 합니다.
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">전화번호</label>
      <input v-model="formData.phone" class="form-control" placeholder="010-1234-5678" />
      <div v-if="phone && !isPhoneValid" class="form-text text-danger">
        유효한 전화번호 형식을 입력해주세요. (예: 010-1234-5678)
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">이메일</label>
      <input v-model="formData.email" class="form-control" placeholder="이메일 입력" />
      <div v-if="email && !isEmailValid" class="form-text text-danger">
        유효한 이메일을 입력해주세요.
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">비밀번호</label>
      <input
        v-model="formData.password"
        type="password"
        class="form-control"
        placeholder="비밀번호 입력"
      />
      <div v-if="password && password.length < 6" class="form-text text-danger">
        비밀번호는 6자 이상이어야 합니다.
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">비밀번호 확인</label>
      <input
        v-model="formData.passwordCheck"
        type="password"
        class="form-control"
        placeholder="비밀번호 확인"
      />
      <div v-if="passwordCheck && password !== passwordCheck" class="form-text text-danger">
        비밀번호가 일치하지 않습니다.
      </div>
    </div>

    <button :disabled="!isFormValid" class="btn btn-brown w-100 mt-3" @click="$emit('next')">
      다음
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  formData: Object,
})
const emit = defineEmits(['next'])

const email = computed(() => props.formData.email)
const password = computed(() => props.formData.password)
const passwordCheck = computed(() => props.formData.passwordCheck)
const nickname = computed(() => props.formData.nickname)
const phone = computed(() => props.formData.phone)

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const isPasswordValid = computed(() => password.value && password.value.length >= 6)
const isPasswordMatched = computed(() => password.value === passwordCheck.value)
const isNicknameValid = computed(() => /^[a-zA-Z0-9가-힣]{2,10}$/.test(nickname.value))
const isPhoneValid = computed(() => /^01[0-9]-\d{3,4}-\d{4}$/.test(phone.value))

const isFormValid = computed(() => {
  return (
    props.formData.name &&
    isNicknameValid.value &&
    isPhoneValid.value &&
    isEmailValid.value &&
    isPasswordValid.value &&
    isPasswordMatched.value
  )
})
</script>

<style scoped>
.signup-form {
  max-width: 400px;
  margin: 40px auto;
  background-color: #fff7f0;
  border: 1px solid #e4d3c1;
  border-radius: 12px;
}

.btn-brown {
  background-color: #8b6f5c;
  color: white;
  border: none;
}

.btn-brown:hover {
  background-color: #7b5c4a;
}

.form-text {
  font-size: 0.85rem;
}
</style>
