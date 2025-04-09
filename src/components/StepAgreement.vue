<template>
  <div>
    <h2>1. 약관 동의</h2>
    <label>
      <input type="checkbox" v-model="agreed" />
      약관에 동의합니다.
    </label>
    <button :disabled="!agreed" @click="$emit('next')">다음</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  agreed: Boolean,
})

const emit = defineEmits(['next'])
</script>
