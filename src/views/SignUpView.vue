<template>
  <div class="signup-flow">
    <StepAgreement v-if="step === 1" v-model:agreed="agreed" @next="nextStep" />
    <StepForm v-else-if="step === 2" :formData="formData" @next="nextStep" />
    <StepComplete v-else-if="step === 3" :formData="formData" @reset="reset" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StepAgreement from '@/components/StepAgreement.vue'
import StepForm from '@/components/StepForm.vue'
import StepComplete from '@/components/StepComplete.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref(1)
const agreed = ref(false)
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
})

const nextStep = () => {
  step.value += 1
}

const reset = () => {
  //db에 푸시
  router.push('/login')
}
</script>

<style scoped>
.signup-flow {
  /* margin: 50px auto; */
  text-align: center;
}
</style>
