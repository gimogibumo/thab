<script setup>
import { computed } from 'vue'
import CreateTravelHeader from '@/components/CreateTravelHeader.vue'
import StepIndicator from '@/components/StepIndicator.vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'next'])

const localForm = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 🔸 날짜 유효성
const isInvalidDate = computed(() => {
  return (
    localForm.value.startDate &&
    localForm.value.endDate &&
    new Date(localForm.value.endDate) < new Date(localForm.value.startDate)
  )
})

// 🔸 입력값이 모두 유효한지 확인
const isValid = computed(() => {
  return (
    localForm.value.title.trim() !== '' &&
    localForm.value.startDate &&
    localForm.value.endDate &&
    !isInvalidDate.value
  )
})

// 🔸 유효할 때만 다음 스텝 emit
const handleNext = () => {
  if (isValid.value) {
    emit('next')
  } else {
    alert('제목과 날짜를 모두 입력해주세요!')
  }
}
</script>

<template>
  <div class="step-wrapper">
    <div class="card shadow">
      <div class="card-body">
        <StepIndicator :currentStep="1" :stepLabel="'기본 정보'" />

        <div class="mb-3">
          <label class="form-label">여행 제목</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="잊지 못할 이 여행의 제목을 지어보세요"
            v-model="localForm.title"
          />
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">시작일</label>
            <input 
              type="date"
              class="form-control"
              v-model="localForm.startDate"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">종료일</label>
            <input 
              type="date" 
              class="form-control"
              v-model="localForm.endDate"
              :min="localForm.startDate"  
            />
          </div>
        </div>

        <!-- 다음 버튼 -->
        <div class="d-flex justify-content-end">
          <button
            @click="handleNext"
            :disabled="!isValid"
            class="btn text-white"
            :class="{ 'btn-disabled': !isValid }"
            style="background-color: #8B6F5C;"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
