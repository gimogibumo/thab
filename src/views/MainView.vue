<template>
  <div class="content">
    <div class="main-container text-center">
      <!-- 상단 헤더 -->
      <section class="hero-section text-white py-5">
        <h1 class="title">THAB</h1>
        <p class="subtitle">여행의 모든 순간을 스마트하게 기록하세요</p>
        <button class="btn btn-outline-light btn-lg mt-4 px-5 py-2 rounded-pill shadow-sm">
          시작하기
        </button>
      </section>

      <!-- 주요 기능 카드 -->
      <section class="feature-cards container py-5">
        <div class="row justify-content-center gap-4">
          <div
            class="col-12 col-sm-6 col-md-4 col-lg-3"
            v-for="card in featureCards"
            :key="card.title"
          >
            <div class="card feature-card shadow h-100">
              <div class="card-body d-flex flex-column justify-content-center">
                <h5 class="card-title mb-3 fw-bold">{{ card.title }}</h5>
                <p class="card-text text-muted">{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 특별 기능 소개 -->
      <section class="special-section py-5 bg-light">
        <h2 class="mb-4 fw-bold">여행을 더 특별하게</h2>
        <div class="special-content d-flex flex-wrap justify-content-center gap-4 mb-5">
          <div class="special-item bg-white p-4 rounded shadow-sm">✨ 스마트한 예산 설정</div>
          <div class="special-item bg-white p-4 rounded shadow-sm">🧾 간편한 지출 기록</div>
        </div>

        <!-- CTA 박스: 하단 중앙에 배치 -->
        <div class="d-flex justify-content-center">
          <div class="call-to-action bg-dark-brown text-white p-4 rounded shadow-lg">
            <h4 class="fw-bold">지금 시작하세요</h4>
            <p>THAB과 함께 더 스마트한 여행을 경험하세요</p>
            <button class="btn btn-light btn-lg rounded-pill mt-2 px-4 py-2">
              무료로 시작하기
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const featureCards = ref([
  { title: '스마트한 여행 가계부', description: '여행 경비를 실시간으로 기록하고 관리하세요' },
  { title: '다양한 통화 지원', description: '전 세계 모든 통화를 실시간 환율로 변환' },
  { title: '여행 일정 관리', description: '지출과 함께 소중한 여행 순간도 기록' },
])
</script>

<style scoped>
.main-container {
  color: #4e4e4e;
}

.hero-section {
  background-color: #8b6f5c;
}

.title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
}

.feature-cards .card {
  border-radius: 12px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.feature-cards .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.special-section {
  background-color: #f8f9fa;
}

.special-item {
  min-width: 220px;
  text-align: center;
  font-size: 1.1rem;
  border-radius: 8px;
  font-weight: 500;
  color: #5c4639;
}

.call-to-action {
  max-width: 400px;
  text-align: center;
  background-color: #4f382f;
  padding: 24px;
}

.call-to-action h4 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.call-to-action p {
  font-size: 1rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.call-to-action button {
  font-size: 1rem;
}

.btn-outline-light {
  border-color: #fff;
  color: #fff;
}

.btn-outline-light:hover {
  background-color: #fff;
  color: #8b6f5c;
}

.bg-dark-brown {
  background-color: #4f382f;
}

@media (max-width: 1024px) {
  .title {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .call-to-action {
    width: 100%;
  }
}
</style>
