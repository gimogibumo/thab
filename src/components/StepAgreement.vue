<template>
  <div>
    <h2>1. 약관 동의</h2>
    <label>
      <input type="checkbox" checked="agreed" @change="onChange" />
      약관에 동의합니다.
    </label>
    <button :disabled="!agreed" @click="$emit('next')">다음</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  agreed: Boolean,
})

const emit = defineEmits(['next', 'update:agreed'])

const onChange = (e) => {
  emit('update:agreed', e.target.checked)
}
</script>
