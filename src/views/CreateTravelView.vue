<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import CreateTravelHeader from '@/components/CreateTravelHeader.vue'
import TravelForm1 from '@/components/TravelForm1.vue'
import TravelForm2 from '@/components/TravelForm2.vue'
import TravelForm3 from '@/components/TravelForm3.vue'

// 🧩 스토어 및 상태
const authStore = useAuthStore()
const step = ref(1)

// ✍️ 여행 폼 데이터
const formData = ref({
  userEmail : authStore.user?.email || '',
  title: '',
  startDate: '',
  endDate: '',
  destination: '', // 도시
  description: '',
  currency: '',
  budget: {
    stay: 0,
    transport: 0,
    food: 0,
    tour: 0,
    shopping: 0,
    etc: 0
  },
  totalBudget: '',
  income: 0,
  totalSpent: 0
})

// 🔁 스텝 변경
const nextStep = () => {
  if (step.value < 3) step.value++
}
const prevStep = () => {
  if (step.value > 1) step.value--
}

// ⬆️ 현재 스텝에 맞는 컴포넌트
const currentStepComponent = computed(() => {
  switch (step.value) {
    case 1: return TravelForm1
    case 2: return TravelForm2
    case 3: return TravelForm3
    default: return TravelForm1
  }
})

// 🖼️ 도시 이미지 백그라운드
const backgroundImage = ref('')
const PIXABAY_API_KEY = '49696568-789720e76db658f1dff80e68c' // ⛔ 여기에 너의 키를 넣어줘

const fetchCityImage = async (city) => {
  if (!city) return
  try {
    const res = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(city)}&image_type=photo&orientation=horizontal&category=places`)
    const data = await res.json()
    backgroundImage.value = data.hits?.[0]?.largeImageURL || ''
  } catch (e) {
    console.error('이미지 가져오기 실패:', e)
    backgroundImage.value = ''
  }
}

// 🚨 도시 바뀔 때 이미지 새로 로드
watch(() => formData.value.destination, (newCity) => {
  fetchCityImage(newCity)
})

// ✅ 초기값은 서울로
onMounted(() => {
  fetchCityImage(formData.value.destination || '서울')
})
</script>
<template>
  <div class="content">
    <div class="p-4 bg-light min-vh-100">
      <!-- ✅ 헤더도 container로 감싸기 -->
      <div class="container-fluid px-4">
        <div class="mx-auto w-100 px-3">
          <CreateTravelHeader
            title="새로운 여행 만들기"
            subtitle="나의 특별한 여행"
            :backgroundImage="backgroundImage"
          />
        </div>
      </div>
      <!-- 본문 영역 -->
      <main class="container-fluid px-4">
        <div class="mx-auto w-100 px-3">
          <component
            :is="currentStepComponent"
            v-model="formData"
            @next="nextStep"
            @back="prevStep"
          />
        </div>
      </main>
    </div>
  </div>
</template>
<style scoped>
.content {
  flex-grow: 1;
}
.card {
  border: none;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
}
</style>
