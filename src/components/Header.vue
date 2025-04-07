<template>
  <div class="header d-flex justify-content-end align-items-center p-3">
    <!-- 알림 버튼 -->
    <button class="btn btn-light rounded-circle me-2" @click="onNotificationClick">
      <i class="bi bi-bell"></i>
    </button>
    <!-- 마이페이지 버튼 -->
    <button class="colors btn btn-light rounded-circle mypage" @click="onProfileClick">
      <i class="bi bi-person"></i>
    </button>
  </div>
</template>

<script setup>
const onNotificationClick = () => {
  alert('알림 페이지로 이동합니다.')
}

const onProfileClick = () => {
  alert('마이페이지로 이동합니다.')
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  margin-top: 20px;
  margin-right: 20px;
}

.btn {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mypage {
  background-color: #8b6f5c;
}
</style>
