<script setup>
import { computed, ref, watch } from 'vue'
import CreateTravelHeader from '@/components/CreateTravelHeader.vue'
import StepIndicator from '@/components/StepIndicator.vue'

// Props와 emit 설정
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'next', 'back'])

const localForm = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 국가 및 도시 데이터
const countries = ref([
  { code: 'JP', name: '일본' },
  { code: 'KR', name: '대한민국' },
  { code: 'US', name: '미국' },
  { code: 'FR', name: '프랑스' },
  { code: 'GB', name: '영국' },
])

const countryCityMap = {
  JP: ['도쿄', '오사카', '후쿠오카'],
  KR: ['서울', '부산', '제주도'],
  US: ['뉴욕', '샌프란시스코', '라스베이거스'],
  FR: ['파리', '리옹', '마르세유'],
  GB: ['런던', '맨체스터', '에든버러'],
}

const countryCurrencyMap = {
  JP: 'JPY',
  KR: 'KRW',
  US: 'USD',
  FR: 'EUR',
  GB: 'GBP',
}

const selectedCountry = ref('')
const cities = ref([])
const selectedCity = ref('')

// 국가 변경 시 도시 목록 설정
watch(selectedCountry, (newCode) => {
  cities.value = countryCityMap[newCode] || []
  selectedCity.value = '' // 도시 초기화
})

// 도시 선택 시 목적지 + 통화코드 반영
watch(selectedCity, (cityName) => {
  localForm.value.destination = cityName
  localForm.value.currency = countryCurrencyMap[selectedCountry.value] || ''
})
</script>


<template>
  <div class="step-wrapper">
    <CreateTravelHeader title="새로운 여행 만들기" subtitle="나의 특별한 여행" />
    <div class="card shadow">
      <div class="card-body">
        <StepIndicator :currentStep="2" :stepLabel="'여행 상세'" />

        <!-- 🌍 국가 선택 -->
        <div class="mb-3">
          <label class="form-label">국가</label>
          <select v-model="selectedCountry" class="form-select">
            <option disabled value="">국가를 선택해주세요</option>
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </select>
        </div>

        <!-- 도시 선택 -->
        <div class="mb-3">
          <label class="form-label">도시</label>
          <select v-model="selectedCity" class="form-select" :disabled="cities.length === 0">
            <option disabled value="">도시를 선택해주세요</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>


        <!-- 여행 설명 -->
        <div class="mb-3">
          <label class="form-label">여행 설명</label>
          <textarea
            class="form-control"
            rows="4"
            placeholder="여행의 간단한 설명을 입력해주세요"
            v-model="localForm.description"
          ></textarea>
        </div>

        <!-- 버튼 -->
        <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
          <button @click="$emit('back')" class="btn btn-outline-secondary">이전</button>
          <button @click="$emit('next')" class="btn text-white" style="background-color: #8B6F5C;">다음</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
</style>
