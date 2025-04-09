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
      <hr>
      <div class="info second-info">
        <div class="info-title">이름</div>
        <div class="info-content">THAB</div>
      </div>
      <hr>
      <div class="info third-info">
        <div class="info-title">이메일</div>
        <div class="info-content">thab@gmail.com</div>
      </div>
      <hr>
      <div class="info fourth-info">
        <div class="info-title">전화번호</div>
        <div class="info-content">010-5036-7875</div>
      </div>
      <hr>
      <div class="info fifth-info">
        <div class="info-title">비밀번호</div>
        <div class="info-content">123456</div>
      </div>
      <hr>
      <div class="btn-info">
        <button class="btn-info-update">정보 수정</button>
        <button class="btn-pwd-update">비밀번호 변경</button>
      </div>
    </div>
    <div class="middle">
      <div class="setting-title"> 알림 설정</div>
      <div class="noti-box">
        <div>
          <div class="noti-title">여행 일정 알림</div>
          <div class="noti-content">여행 시작일이 다가오면 알림</div>
        </div>
        <input role="switch" type="checkbox" class="noti-toggle" />
      </div>
      <div class="noti-box">
        <div>
          <div class="noti-title">예산 경고 알림</div>
          <div class="noti-content">여행 예산의 80% 이상 사용시 알림</div>
        </div>
        <input role="switch" type="checkbox" class="noti-toggle" />
      </div>
      <div class="noti-box">
        <div>
          <div class="noti-title">저축 목표 알림</div>
          <div class="noti-content">저축 목표 달성률 90% 도달시 알림</div>
        </div>
        <input role="switch" type="checkbox" class="noti-toggle" />
      </div>
    </div>
    <div class="bottom">
      <div>
        <div class="logout-title">로그아웃</div>
        <div class="logout-content">계정에서 로그아웃합니다.</div>
      </div>
      <button class="btn-logout">로그아웃</button>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 3% 5%;
}

.content::-webkit-scrollbar {
  display: none;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
}

.top-name-title {
  font-size: 22px;
  font-weight: bold;
}

.setting-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

img {
  border-radius: 50%;
}

.top, .middle, .bottom {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 80%;
  margin: 0 auto 50px;
}

.first-info {
  display: flex;
  align-items: center;
}

.top-info {
  margin-left: 30px;
}

.info {
  margin: 20px 10px;
}

.info-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.info-content {
  font-size: 17px;
}

.noti-title, .logout-title {
  font-size: 17px;
  font-weight: bold;
}

.noti-content {
  font-size: 15px;
}

.noti-box, .bottom {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.btn-logout {
  border: 1px #7b5c4a solid;
  padding: 4px 15px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.btn-info > button {
  flex: 1;
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-info > .btn-pwd-update {
  background: white;
  color: #8B6F5C;
  border: 1px #8B6F5C solid;
}

.btn-info > .btn-info-update {
  background: #8B6F5C;
  color: white;
}

label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

[type="checkbox"] {
  appearance: none;
  position: relative;
  border: max(2px, 0.1em) solid gray;
  border-radius: 1.25em;
  width: 2.25em;
  height: 1.25em;
}

[type="checkbox"]::before {
  content: "";
  position: absolute;
  left: 0;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  transform: scale(0.8);
  background-color: gray;
  transition: left 250ms linear;
}

[type="checkbox"]:checked {
  background-color: #8B6F5C;
  border-color: #7B5E48;
}

[type="checkbox"]:checked::before {
  background-color: white;
  left: 1em;
}

[type="checkbox"]:disabled {
  border-color: lightgray;
  opacity: 0.7;
  cursor: not-allowed;
}

[type="checkbox"]:disabled:before {
  background-color: lightgray;
}

[type="checkbox"]:disabled + span {
  opacity: 0.7;
  cursor: not-allowed;
}

[type="checkbox"]:focus-visible {
  outline-offset: max(2px, 0.1em);
  outline: max(2px, 0.1em) solid #7b5c4a;
}

[type="checkbox"]:enabled:hover {
  box-shadow: 0 0 0 max(4px, 0.2em) lightgray;
}

/* Global CSS */
body {
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

fieldset {
  border: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
