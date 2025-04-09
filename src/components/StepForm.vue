<template>
    <div>
      <h2>2. 정보 입력</h2>
      <input v-model="formData.name" placeholder="이름 입력" />
      <input v-model="formData.email" placeholder="이메일 입력" />
      <button :disabled="!isFormValid" @click="$emit('next')">다음</button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { defineProps } from 'vue';
  
  const props = defineProps({
    formData: Object
  });
  
  const emit = defineEmits(['next']);
  
  const isFormValid = computed(() => {
    return props.formData.name !== '' && props.formData.email !== '';
  });
  </script>
  