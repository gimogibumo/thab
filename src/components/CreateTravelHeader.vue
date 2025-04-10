<!-- components/CreateTravelHeader.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  title: {
    type: String,
    default: '새로운 여행 만들기'
  },
  subtitle: {
    type: String,
    default: '나의 특별한 여행'
  }
})

const goToManage = () => {
  router.back()
}
</script>
<template>
  <div>
    <!-- 상단 제목 -->
    <div class="d-flex align-items-center mb-3">
      <button
        class="btn me-2 text-white"
        style="background-color: #8B6F5C; border: none; border-radius: 0.5rem;"
        @click="goToManage"
      >        
        <i class="bi bi-arrow-left"></i>
      </button>
      <h5 class="m-0">{{ title }}</h5>
    </div>

    <!-- 커버 이미지 -->
    <div class="bg-cover text-white text-center d-flex align-items-center justify-content-center card-body"
         style="height: 200px; background-color: #8B6F5C;">
      <h1 class="display-6 opacity-75">{{ subtitle }}</h1>
    </div>
  </div>
</template>
