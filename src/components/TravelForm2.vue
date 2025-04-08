<script setup>
import { computed } from 'vue'
import CreateTravelHeader from '@/components/CreateTravelHeader.vue'
import StepIndicator from '@/components/StepIndicator.vue'


// Props와 emit 설정
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'next', 'back'])

// 양방향 바인딩을 위한 로컬 변수
const localForm = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="step-wrapper">
    <CreateTravelHeader title="새로운 여행 만들기" subtitle="나의 특별한 여행" />
    <div class="card shadow">
      <div class="card-body">
        <StepIndicator :currentStep="2" :stepLabel="'여행 상세'" />
        <!-- 여행지 -->
        <div class="mb-3">
          <label class="form-label">여행지</label>
          <input
            type="text"
            class="form-control"
            placeholder="여행할 도시나 국가를 입력해주세요."
            v-model="localForm.destination"
          />
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

