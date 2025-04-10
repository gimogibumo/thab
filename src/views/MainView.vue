<template>
  <div class="content">
    <div class="page-wrapper">
      <!-- Hero Section -->
      <section class="hero-section text-center py-5 px-3">
        <h1 class="title">THAB</h1>
        <p class="subtitle">여행의 모든 순간을 스마트하게 기록하세요</p>
        <button
          class="btn btn-brown-light btn-lg mt-4 px-5 py-2 rounded-pill shadow-sm"
          @click="toCreate"
        >
          시작하기
        </button>
      </section>

      <!-- 기능 카드 -->
      <section class="section-container text-center py-5 px-3">
        <h2 class="section-title mb-5 fw-bold">주요 기능</h2>
        <div class="container">
          <div class="row justify-content-center g-4">
            <div
              class="col-12 col-sm-6 col-md-4 col-lg-3"
              v-for="card in featureCards"
              :key="card.title"
            >
              <div class="card feature-card h-100 border-0 shadow-sm">
                <div class="card-body d-flex flex-column justify-content-center align-items-center">
                  <div class="emoji fs-2 mb-2">{{ card.emoji }}</div>
                  <h5 class="card-title fw-bold">{{ card.title }}</h5>
                  <p class="card-text text-muted">{{ card.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section text-center py-5 px-3">
        <div class="call-to-action bg-white text-dark p-4 rounded shadow mx-auto">
          <h4 class="fw-bold">지금 시작하세요</h4>
          <p>THAB과 함께 더 스마트한 여행을 경험하세요</p>
          <button class="btn btn-brown btn-lg rounded-pill mt-2 px-4 py-2" @click="toCreate">
            무료로 시작하기
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'
const featureCards = ref([
  { emoji: '📒', title: '여행 가계부', description: '경비를 실시간으로 기록하고 관리해요' },
  { emoji: '💱', title: '통화 지원', description: '여행 중 환율 걱정 없어요' },
  { emoji: '📅', title: '일정 관리', description: '계획과 기록을 함께 관리해요' },
])

const toCreate = () => {
  router.push('/create')
}
</script>

<style scoped>
/* 전체 배경 */
.content {
  padding: 0px;
}
.page-wrapper {
  background-color: #fff4e8;
}

/* Hero */
.hero-section {
  background-color: #fff8f2;
  color: #4e3b32;
}
.title {
  font-size: 3.2rem;
  font-weight: bold;
}
.subtitle {
  font-size: 1.25rem;
  margin-top: 0.5rem;
  opacity: 0.9;
}

/* 카드 */
.section-container {
  background-color: transparent;
}
.feature-card {
  border-radius: 16px;
  background-color: #ffffff;
  transition: transform 0.2s ease;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}
.emoji {
  font-size: 2.5rem;
}
.section-title {
  font-size: 1.8rem;
  color: #4e3b32;
}

/* CTA */
.cta-section {
  background-color: transparent;
}
.call-to-action {
  max-width: 420px;
  border-radius: 20px;
  padding: 28px;
}
.btn-brown {
  background-color: #8b6f5c;
  color: white;
  border: none;
  transition: all 0.2s ease;
}
.btn-brown:hover {
  background-color: #7b5c4a;
  transform: scale(1.03);
}
.btn-brown-light {
  background-color: white;
  color: #8b6f5c;
  border: 2px solid #8b6f5c;
  transition: all 0.2s ease;
}
.btn-brown-light:hover {
  background-color: #8b6f5c;
  color: white;
}

/* 반응형 */
@media (max-width: 768px) {
  .title {
    font-size: 2.3rem;
  }
  .subtitle {
    font-size: 1rem;
  }
}
</style>
