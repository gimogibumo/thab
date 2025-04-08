<script setup>
import { computed } from 'vue'
import CreateTravelHeader from '@/components/CreateTravelHeader.vue'
import StepIndicator from '@/components/StepIndicator.vue'

// Props와 emit 설정
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'next'])

// 양방향 바인딩을 위한 computed
const localForm = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="step-wrapper">
    <CreateTravelHeader title="새로운 여행 만들기" subtitle="나의 특별한 여행" />
    <!-- 카드 -->
    <div class="card shadow">
      <!-- 폼 내용 -->
      <div class="card-body">
        <!-- Step indicator -->
        <StepIndicator :currentStep="1" :stepLabel="'기본 정보'" />

        <!-- 여행 제목 -->
        <div class="mb-3">
          <label class="form-label">여행 제목</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="잊지 못할 이 여행의 제목을 지어보세요"
            v-model="localForm.title"
          />
        </div>

        <!-- 날짜 입력 -->
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
            />
          </div>
        </div>

        <!-- 다음 버튼 -->
        <div class="d-flex justify-content-end">
          <button @click="$emit('next')" class="btn text-white" style="background-color: #8B6F5C;">다음</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.step-wrapper {
  width: 100%;
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
