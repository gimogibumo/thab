<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: '새로운 여행 만들기'
  },
  subtitle: {
    type: String,
    default: '나의 특별한 여행'
  },
  backgroundImage: {
    type: String,
    default: ''
  }
})

// 실제 표시할 이미지
const loadedImage = ref(props.backgroundImage)

// 이미지가 바뀔 때 로드 완료될 때까지 대기
watch(() => props.backgroundImage, (newUrl) => {
  if (!newUrl) return
  const img = new Image()
  img.src = newUrl
  img.onload = () => {
    loadedImage.value = newUrl
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
      <!-- 수정된 버튼 부분 -->
      <button
        class="btn me-2 text-white"
        style="background-color: #0F2E47; border: none; border-radius: 0.5rem;"
        @click="goToManage"
      >
        <i class="bi bi-arrow-left"></i>
      </button>
      <h5 class="m-0">{{ title }}</h5>
    </div>

    <!-- 커버 이미지 -->
    <div 
      class="header-image position-relative overflow-hidden rounded mb-4"
      style="height: 300px;"
    >
      <!-- 배경 이미지로 쓰는 이미지 태그 -->
      <img
        v-if="loadedImage"
        :src="loadedImage"
        class="position-absolute w-100 h-100 object-fit-cover"
        style="z-index: 0; top: 0; left: 0;"
        alt="background"
      />
      <div class="overlay"></div>
      <div class="header-text d-flex align-items-center justify-content-center h-100 text-white">
        <h1 class="display-6 m-0 text-shadow">{{ subtitle }}</h1>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header-image {
  position: relative;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 1;
}
.header-text {
  position: relative;
  z-index: 2;
}
.object-fit-cover {
  object-fit: cover;
}
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6); /* 더 잘 보이게 */
}
</style>
