<template>
  <div>
    <h2>3. 가입 완료 🎉</h2>
    <p>이름: {{ formData.name }}</p>
    <p>이메일: {{ formData.email }}</p>
    <button @click="$emit('reset')">처음으로</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  formData: Object,
})

const emit = defineEmits(['reset'])
</script>
