<!-- components/StepIndicator.vue -->
<template>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
        <span
          v-for="n in total"
          :key="n"
          class="badge d-flex align-items-center justify-content-center"
          :class="{
            'text-white': currentStep >= n,
            'bg-light text-dark': currentStep < n
          }"
          :style="badgeStyle(currentStep >= n)"
        >
          {{ n }}
        </span>
      </div>
      <small class="text-muted">{{ stepLabel }}</small>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    currentStep: Number,      // 현재 단계 (1~3)
    total: {
      type: Number,
      default: 3              // 총 단계 수
    },
    stepLabel: {
      type: String,
      default: ''
    }
  })
  
  const badgeStyle = (active) => ({
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    backgroundColor: active ? '#0F2E47' : '',
  })
  </script>