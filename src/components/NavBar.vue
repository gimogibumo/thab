<template>
  <!-- 모바일용 햄버거 메뉴 -->
  <div class="d-lg-none p-2 bg-brown text-white">
    <button
      class="btn btn-outline-light"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasNav"
      aria-controls="offcanvasNav"
    >
      <i class="bi bi-list"></i> 메뉴
    </button>
  </div>

  <!-- 데스크탑용 NavBar -->
  <div class="sidebar d-none d-lg-flex flex-column bg-brown text-white">
    <div class="text-center py-4 border-bottom">
      <div class="fs-2 fw-bold">THAB</div>
      <div class="profile-circle mx-auto mt-3"></div>
      <div class="mt-2 fw-semibold">김이윤박</div>
      <div class="text-muted small">도쿄 여행 중 (2/5)</div>
    </div>

    <!-- 스크롤 가능한 네비게이션 메뉴 -->
    <div class="flex-grow-1 overflow-auto">
      <div class="px-3 py-2">
        <div class="mb-3">
          <router-link to="/" class="nav-btn"> <i class="bi bi-house-door"></i> 홈 </router-link>
        </div>

        <!-- 대분류: 일정 관리 -->
        <div class="text-muted px-3">일정 관리</div>
        <div>
          <router-link to="/travel_manage" class="nav-btn">
            <i class="bi bi-square"></i> 여행
          </router-link>
        </div>

        <!-- 대분류: 가계부 -->
        <div class="text-muted px-3 mt-3">가계부</div>
        <div>
          <router-link to="/expense_input" class="nav-btn">
            <i class="bi bi-plus"></i> 지출 입력
          </router-link>
          <router-link to="/expense_list" class="nav-btn">
            <i class="bi bi-list"></i> 지출 내역
          </router-link>
          <router-link to="/budget_input" class="nav-btn">
            <i class="bi bi-graph-up"></i> 수입 입력
          </router-link>
        </div>

        <!-- 대분류: 리포트 -->
        <div class="text-muted px-3 mt-3">리포트</div>
        <div>
          <router-link to="/stats" class="nav-btn">
            <i class="bi bi-bar-chart"></i> 통계
          </router-link>
        </div>

        <!-- 대분류: 설정 -->
        <div class="text-muted px-3 mt-3">설정</div>
        <div>
          <router-link to="/settings" class="nav-btn">
            <i class="bi bi-gear"></i> 환율 설정
          </router-link>
        </div>
      </div>
    </div>

    <!-- 로그아웃 버튼 -->
    <div class="px-3 mb-3">
      <button class="btn btn-danger w-100 d-flex align-items-center gap-2">
        <i class="bi bi-box-arrow-right"></i> 로그아웃
      </button>
    </div>
  </div>

  <!-- 모바일용 Offcanvas 메뉴 -->
  <div class="offcanvas offcanvas-start bg-brown text-white" tabindex="-1" id="offcanvasNav">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">메뉴</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <ul class="list-unstyled">
        <li v-for="item in navItems" :key="item.name">
          <router-link :to="item.path" class="nav-btn">
            <i :class="item.icon"></i> {{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navItems = ref([
  { name: '홈', path: '/', icon: 'bi bi-house-door' },
  { name: '여행', path: '/travel_manage', icon: 'bi bi-square' },
  { name: '지출 입력', path: '/expense_input', icon: 'bi bi-plus' },
  { name: '지출 내역', path: '/expense_list', icon: 'bi bi-list' },
  { name: '통계', path: '/stats', icon: 'bi bi-bar-chart' },
  { name: '환율 설정', path: '/settings', icon: 'bi bi-gear' },
])
</script>

<style scoped>
.sidebar {
  width: 270px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  background-color: #8b6f5c;
}

.profile-circle {
  width: 80px;
  height: 80px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #8b6f5c;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  margin: 2px 0;
  background-color: transparent;
  color: white;
  text-decoration: none;
}

.nav-btn:hover,
.nav-btn.active {
  background-color: #8b6f5c;
  border-radius: 6px;
}

.bg-brown {
  background-color: #8b6f5c;
}

.offcanvas {
  width: 270px;
}
</style>
