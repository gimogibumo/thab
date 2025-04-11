<template>
  <div class="emotion-wrapper d-flex justify-content-center align-items-center">
    <div class="emotion-overlay" />

    <div class="card signup-form animate__animated animate__fadeInUp">
      <h2 class="text-center fw-bold mb-4 text-dark fs-3">2. 정보 입력</h2>

      <div class="mb-3">
        <label class="form-label fw-semibold">이름</label>
        <input v-model="formData.name" class="form-control" placeholder="이름 입력" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">닉네임</label>
        <input v-model="formData.nickname" class="form-control" placeholder="닉네임 입력" />
        <transition name="fade">
          <div v-if="nickname && !isNicknameValid" class="form-text text-danger">
            닉네임은 2~10자의 한글, 영문 또는 숫자여야 합니다.
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">전화번호</label>
        <input v-model="formData.phone" class="form-control" placeholder="010-1234-5678" />
        <transition name="fade">
          <div v-if="phone && !isPhoneValid" class="form-text text-danger">
            유효한 전화번호 형식을 입력해주세요.
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">이메일</label>
        <input v-model="formData.email" class="form-control" placeholder="이메일 입력" />
        <transition name="fade">
          <div v-if="email && !isEmailValid" class="form-text text-danger">
            유효한 이메일을 입력해주세요.
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">비밀번호</label>
        <input
          v-model="formData.password"
          type="password"
          class="form-control"
          placeholder="비밀번호 입력"
        />
        <transition name="fade">
          <div v-if="password && password.length < 6" class="form-text text-danger">
            비밀번호는 6자 이상이어야 합니다.
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">비밀번호 확인</label>
        <input
          v-model="formData.passwordCheck"
          type="password"
          class="form-control"
          placeholder="비밀번호 확인"
        />
        <transition name="fade">
          <div v-if="passwordCheck && password !== passwordCheck" class="form-text text-danger">
            비밀번호가 일치하지 않습니다.
          </div>
        </transition>
      </div>

      <button
        :disabled="!isFormValid"
        class="btn btn-brown w-100 py-2 fw-semibold mt-3"
        @click="$emit('next')"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  formData: Object,
})
props.formData.budget = false
props.formData.travel = false
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
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.emotion-wrapper {
  position: relative;
  min-height: 100vh;
  background-color: #0f2e47;
  display: flex;
  padding: 40px 20px;
  overflow: hidden;
}

.emotion-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/img/emotion_bg.png'); /* 감성적인 일러스트 배경 */
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: 0;
}

.signup-form {
  position: relative;
  z-index: 10;
  max-width: 460px;
  width: 100%;
  background-color: #70a0c8;
  border: 1px solid #0f2e47;
  border-radius: 24px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  padding: 40px 32px;
}

.form-control:focus {
  border-color: #8b6f5c;
  box-shadow: 0 0 0 0.15rem rgba(139, 111, 92, 0.3);
}

.btn-brown {
  background-color: #0f2e47;
  color: white;
  border: none;
  transition: all 0.25s ease;
}

.btn-brown:hover {
  background-color: #0f2e47;
  transform: scale(1.02);
}

.btn-brown:disabled {
  background-color: #c1a695;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.form-text {
  font-size: 0.85rem;
  margin-top: 4px;
}
</style>
