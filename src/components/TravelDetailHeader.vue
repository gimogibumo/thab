<script setup>
const props = defineProps({
  trip: Object,
  activeTab: String
})

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-')
  return `${year}.${month}.${day}`
}
</script>
<template>
  <div v-if="trip" class="bg-light p-4 rounded">
    <div class="mb-2">
      <h5 class="mb-1 fw-bold">{{ trip.title }}</h5>
      <small class="text-muted">{{ formatDate(trip.startDate) }} - {{ formatDate(trip.endDate) }}</small>
    </div>

    <!-- 버튼들을 개별로 배치 -->
    <div class="d-flex gap-2">
      <button
        type="button"
        class="btn"
        :class="activeTab === 'overview' ? 'btn-brown' : 'btn-outline-brown'"
        @click="$emit('change-tab', 'overview')"
      >
        전체 보기
      </button>
      <button
        type="button"
        class="btn"
        :class="activeTab === 'budget' ? 'btn-brown' : 'btn-outline-brown'"
        @click="$emit('change-tab', 'budget')"
      >
        지출 관리
      </button>
      <button
        type="button"
        class="btn"
        :class="activeTab === 'checklist' ? 'btn-brown' : 'btn-outline-brown'"
        @click="$emit('change-tab', 'checklist')"
      >
        체크리스트
      </button>
    </div>
  </div>
</template>
<style scoped>
.btn-brown {
  background-color: #8B6F5C !important;
  border-color: #8B6F5C !important;
  color: white !important;
}

.btn-outline-brown {
  background-color: white !important;
  border: 1px solid #8B6F5C !important;
  color: #8B6F5C !important;
}

.btn-outline-brown:hover {
  background-color: #8B6F5C !important;
  color: white !important;
}
/* hover에서도 색 바뀌게 할지 말지 물어보자 */
</style>
