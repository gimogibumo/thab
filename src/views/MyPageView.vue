<script setup>

</script>

<template>
  <div class="content">
    <div class="page-title">마이페이지</div>
    <div class="top">
      <div class="first-info">
        <img src="https://placehold.co/100x100" alt="profile">
        <div class="top-info">
          <div class="top-name-title">THAB</div>
          <div class="register-date">가입일: 2023.02.02</div>
        </div>
      </div>
      <div class="info second-info">
        <div class="info-title">이름</div>
        <div class="info-content">THAB</div>
      </div>
      <div class="info third-info">
        <div class="info-title">이메일</div>
        <div class="info-content">thab@gmail.com</div>
      </div>
      <div class="info fourth-info">
        <div class="info-title">전화번호</div>
        <div class="info-content">010-5036-7875</div>
      </div>
      <div class="info fifth-info">
        <div class="info-title">비밀번호</div>
        <div class="info-content">123456</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 50px;
}

.content::-webkit-scrollbar {
  display: none;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
}

img {
  border-radius: 50%;
}

.top {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 30px;
}

.first-info {
  display: flex;
  align-items: center;
}

.top-info {
  margin-left: 30px;
}

.info {
  margin: 30px 10px;
}

.info-title {
  font-size: 16px;
  font-weight: bold;
}

.info-content {
  font-size: 18px;
}

</style>
