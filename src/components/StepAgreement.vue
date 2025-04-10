<template>
  <div class="fullscreen-wrapper d-flex justify-content-center align-items-center">
    <!-- 좌측 일러스트 -->
    <div class="side-illustration d-none d-md-block">
      <img src="@/assets/img/travel_left.png" alt="travel" class="img-fluid" />
    </div>

    <!-- 약관 카드 -->
    <div class="agreement-card">
      <h2 class="fw-bold text-center mb-3">약관에 동의해주세요</h2>
      <p class="text-muted text-center small mb-4">
        서비스를 시작하기 전에 아래 약관을 확인해주세요. 모든 항목은 필수입니다.
      </p>

      <div class="form-check mb-3">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="allChecked"
          @change="toggleAll"
          id="checkAll"
        />
        <label class="form-check-label fw-semibold" for="checkAll">모든 약관에 동의합니다</label>
      </div>

      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" v-model="terms.service" id="checkService" />
        <label class="form-check-label" for="checkService">
          (필수) 서비스 이용 약관
          <a
            href="#"
            class="text-primary text-decoration-underline"
            @click.prevent="showModal = true"
            >전문 보기</a
          >
        </label>
      </div>

      <div class="form-check mb-4">
        <input class="form-check-input" type="checkbox" v-model="terms.privacy" id="checkPrivacy" />
        <label class="form-check-label" for="checkPrivacy">
          (필수) 개인정보 수집 및 이용 동의
        </label>
      </div>

      <button class="btn w-100 mb-3" :disabled="!isAgreed" @click="$emit('next')">다음</button>

      <p class="text-center text-muted small">THAB은 여러분의 안전한 여행을 응원합니다 ✈️</p>
    </div>

    <!-- 우측 일러스트 -->
    <div class="side-illustration d-none d-md-block">
      <img src="@/assets/img/travel_right.png" alt="travel" class="img-fluid" />
    </div>

    <!-- 약관 전문 모달 -->
    <div class="modal fade show" tabindex="-1" style="display: block" v-if="showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">서비스 이용 약관</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <p>여기에 실제 약관 내용이 들어갑니다. Lorem ipsum dolor sit amet...</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showModal = false">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const allChecked = ref(false)
const showModal = ref(false)

const terms = ref({
  service: false,
  privacy: false,
})

const isAgreed = computed(() => terms.value.service && terms.value.privacy)

const toggleAll = () => {
  terms.value.service = allChecked.value
  terms.value.privacy = allChecked.value
}
</script>

<style scoped>
.btn {
  background-color: #4f382f;
  border-color: black;
  color: white;
}
.fullscreen-wrapper {
  min-height: 100vh;
  background-color: #fff8f2;
  padding: 60px 20px;
  margin: 0%;
}

.agreement-card {
  background-color: #faede1;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.side-illustration {
  max-width: 200px;
  padding: 20px;
}

.form-check-input {
  margin-right: 10px;
}

.modal {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
</style>
