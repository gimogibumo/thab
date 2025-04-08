<template>
  <div class="content">
    <main class="flex-grow-1 bg-light p-4 overflow-auto" style="min-height: 100vh;">
      <component
        :is="currentStepComponent"
        v-model="formData"
        @next="nextStep"
        @back="prevStep"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TravelForm1 from '@/layout/TravelForm1.vue'
import TravelForm2 from '@/layout/TravelForm2.vue'
import TravelForm3 from '@/layout/TravelForm3.vue'
 
const step = ref(1)

const formData = ref({
  title: '',
  startDate: '',
  endDate: '',
  budget: {
    stay: 0,
    transport: 0,
    food: 0,
    tour: 0,
    shopping: 0,
    etc: 0
  }
})

const nextStep = () => {
  if (step.value < 3) step.value++
}
const prevStep = () => {
  if (step.value > 1) step.value--
}

const currentStepComponent = computed(() => {
  switch (step.value) {
    case 1: return TravelForm1
    case 2: return TravelForm2
    case 3: return TravelForm3
    default: return TravelForm1
  }
})
</script>
<style scoped>
.content{
  flex-grow: 1;
}
.page-container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 250px;
  background-color: #8b6a55;
}
.main-content {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f8f9fa;
}
</style>
