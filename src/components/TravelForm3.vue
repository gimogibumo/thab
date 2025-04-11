<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import CreateTravelHeader from '@/components/CreateTravelHeader.vue'
import StepIndicator from '@/components/StepIndicator.vue'

const router = useRouter()

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'next', 'back'])

const localForm = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const totalBudget = computed(() => {
  const b = localForm.value.budget
  return (
    Number(b.stay || 0) +
    Number(b.transport || 0) +
    Number(b.food || 0) +
    Number(b.tour || 0) +
    Number(b.shopping || 0) +
    Number(b.etc || 0)
  )
})


function handleCreateTravel() {
  const travelData = {
    ...localForm.value,
    totalBudget: totalBudget.value,
  }

  axios.post('http://localhost:3000/travel', travelData)
    .then(() => {
      alert('여행이 성공적으로 저장되었습니다!')
      router.push('/travel_manage')
    })
    .catch((error) => {
      console.error('저장 실패:', error)
      alert('여행 저장에 실패했습니다.')
    })
}

const isBudgetValid = computed(() => totalBudget.value > 0)

function preventNegative(category) {
  if (localForm.value.budget[category] < 0) {
    localForm.value.budget[category] = 0
  }
}
</script>
<template>
    <div class="step-wrapper">
      <!-- 카드 -->
      <div class="card shadow">
        <!-- 폼 내용 -->
        <div class="card-body">
          <StepIndicator :currentStep="3" :stepLabel="'예산 설정'" />
          <!-- 총 예산 표시 -->
          <div class="mb-3 p-3 rounded" style="background-color: #CFDDE8;">
            <label class="form-label">총 예산</label>
            <div class="text-end mt-1 fw-bold" style="color: #205781;">{{ totalBudget }}원</div>
            <div class="progress" style="height: 6px; background-color: #205781;">
              <div class="progress-bar" :style="{ width: '100%', backgroundColor: '#205781' }"></div>
            </div>
          </div>
          <!-- 개별 예산 입력 -->
          <div class="row g-3 mb-4">
            <div class="col-6 col-md-4">
              <label class="form-label">숙박</label>
              <input
                type="number"
                class="form-control"
                v-model.number="localForm.budget.stay"
                min="0"
                @input="preventNegative('stay')"
              />            
            </div>
            <div class="col-6 col-md-4">
              <label class="form-label">교통</label>
              <input
                type="number"
                class="form-control"
                v-model.number="localForm.budget.transport"
                min="0"
                @input="preventNegative('transport')"
              />            
            </div>
            <div class="col-6 col-md-4">
              <label class="form-label">식비</label>
              <input
                type="number"
                class="form-control"
                v-model.number="localForm.budget.food"
                min="0"
                @input="preventNegative('food')"
              />            
            </div>
            <div class="col-6 col-md-4">
              <label class="form-label">관광</label>
              <input
                type="number"
                class="form-control"
                v-model.number="localForm.budget.tour"
                min="0"
                @input="preventNegative('tour')"
              />            
            </div>
            <div class="col-6 col-md-4">
              <label class="form-label">쇼핑</label>
              <input
                type="number"
                class="form-control"
                v-model.number="localForm.budget.shopping"
                min="0"
                @input="preventNegative('shopping')"
              />            
            </div>
            <div class="col-6 col-md-4">
              <label class="form-label">기타</label>
              <input
                type="number"
                class="form-control"
                v-model.number="localForm.budget.etc"
                min="0"
                @input="preventNegative('etc')"
              />            
            </div>
          </div>
          <!-- 버튼들 -->
          <div class="d-flex justify-content-between">
            <button @click="$emit('back')" class="btn btn-outline-secondary">이전</button>
              <button
                @click="handleCreateTravel"
                class="btn text-white"
                :disabled="!isBudgetValid"
                style="background-color: #0F2E47;"
              >
                여행 만들기
            </button>            
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