<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import TravelDetailHeader from '@/components/TravelDetailHeader.vue'
import TravelChecklist from '@/components/TravelChecklist.vue'
import TravelBudget from '@/components/TravelBudget.vue'
import TravelOverview from '@/components/TravelOverview.vue'

const route = useRoute()
const travelId = route.params.id // URL에서 travelId 가져오기

const travel = ref(null)
const activeTab = ref('overview')
const checklistItems = ref([])

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/travel/${travelId}`)
    travel.value = res.data

    checklistItems.value = [
      { label: '여권 확인', checked: true },
      { label: '환전하기', checked: true },
      { label: '호텔 예약', checked: false },
      { label: '충전기', checked: false },
    ]
  } catch (err) {
    console.error('여행 데이터를 불러오지 못했습니다:', err)
  }
})

const currentTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'overview':
      return TravelOverview
    case 'budget':
      return TravelBudget
    case 'checklist':
      return TravelChecklist
    default:
      return TravelOverview
  }
})
</script>
<template>
  <div class="content">
    <div class="p-4 bg-light min-vh-100">
      <!-- 상단 여행 정보 헤더 -->
      <TravelDetailHeader
        :travel="travel"
        @change-tab="activeTab = $event"
        :active-tab="activeTab"
      />

      <!-- travel 로드되었을 때만 하위 컴포넌트를 렌더링 -->
      <component
        v-if="travel"
        :is="currentTabComponent"
        :travel-id="travel.id"
        @change-tab="activeTab = $event"
      />
    </div>
  </div>
</template>
<style scoped>
.content {
  flex-grow: 1;
  width: 100%; /* ← 이게 더 안정적 */
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
