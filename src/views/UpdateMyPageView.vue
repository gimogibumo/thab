<script setup>
import  {useRouter} from 'vue-router'
import {ref} from 'vue'

const router = useRouter()

const name = ref('')
const phone = ref('')

// 저장 버튼 클릭 시 호출
const btnSave = () => {
  console.log('이름:', name.value)
  console.log('전화번호:', phone.value)

  router.push('/my_page')
}

// 취소 버튼 클릭 시 마이페이지로 이동
const btnClose = () => {
  router.push('/my_page')
}
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
      <div class="middle">
        <div class="name">
          <div class="title">이름</div>
          <input type="text" placeholder="THAB" value="THAB">
        </div>
        <div class="phone">
          <div class="title">전화번호</div>
          <input type="text" placeholder="010-1234-5678" value="010-1234-5678">
        </div>
      </div>
        <div class="modal-btn">
          <button class="save" @click="btnSave">저장</button>
          <button class="cancel" @click="btnClose">취소</button>
        </div>
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

img {
  border-radius: 50%;
}

.top {
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

input {
  border: 1px #E5E7EB solid;
  border-radius: 8px;
  padding: 8px;
  margin-top: 8px;
  margin-bottom: 20px;
  width: 100%;
}

/* === 버튼 === */
.modal-btn {
  margin-top: 20px;
}

.modal-btn button {
  flex: 1;
  padding: 8px 30px;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 10px 0 auto;
}

.cancel {
  background: white;
  border: #7b5c4a 1px solid;
  color: #7b5c4a;
}

.save {
  border: #7b5c4a 1px solid;
  background: #7b5c4a;
  color: white;
}
</style>
