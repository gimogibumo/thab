<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// props로 travelId 받기
const props = defineProps({
    travelId: String
})
console.log('받은 travelId:', props.travelId)

const checklistItems = ref([])
const newItem = ref('')

const defaultItems = ['여권', '슬리퍼', '비행기 티켓 확인', '호텔 예약', '짐싸기']

onMounted(async () => {
  if (!props.travelId) return

  const res = await axios.get(`http://localhost:3000/travelChecklist?travelId=${props.travelId}`)
  if (res.data.length === 0) {
    const newChecklist = {
        travelId: props.travelId,
      checklist: defaultItems.map(label => ({
        label,
        checked: false
      }))
    }
    const created = await axios.post(`http://localhost:3000/travelChecklist`, newChecklist)
    checklistItems.value = created.data
  } else {
    checklistItems.value = res.data[0]
  }
})

watch(
  () => checklistItems.value.checklist,
  async (newVal) => {
    if (!checklistItems.value?.id) return
    await axios.patch(`http://localhost:3000/travelChecklist/${checklistItems.value.id}`, {
      checklist: newVal
    })
  },
  { deep: true }
)

// 모달 열기
const openModal = () => {
  const modalEl = document.getElementById('addChecklistModal')
  if (modalEl) {
    const modalInstance = new bootstrap.Modal(modalEl)
    modalInstance.show()
  }
}

// 모달 닫기 (공통)
const closeModal = () => {
  const modalEl = document.getElementById('addChecklistModal')
  if (modalEl) {
    let modalInstance = bootstrap.Modal.getInstance(modalEl)
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalEl)
    }
    modalInstance.hide()

    // 백드롭 제거 및 body 초기화
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
      document.body.classList.remove('modal-open')
      document.body.style.removeProperty('padding-right')
      document.body.style.removeProperty('overflow')
    }, 300) // 애니메이션 시간 고려
  }
}

const submitNewItem = async () => {
  if (!newItem.value.trim()) return

  checklistItems.value.checklist.push({
    label: newItem.value,
    checked: false
  })

  await axios.patch(`http://localhost:3000/travelChecklist/${checklistItems.value.id}`, {
    checklist: checklistItems.value.checklist
  })

  newItem.value = ''
  closeModal()
}

const deleteItem = async (index) => {
  checklistItems.value.checklist.splice(index, 1)
  await axios.patch(`http://localhost:3000/travelChecklist/${checklistItems.value.id}`, {
    checklist: checklistItems.value.checklist
  })
}
</script>

<template>
  <div class="p-4">
    <h5 class="fw-bold mb-3">여행 준비 체크리스트</h5>

    <div class="bg-white shadow-sm rounded-4 p-4 mb-3">
      <div class="row gy-3">
        <div
          v-for="(item, index) in checklistItems.checklist"
          :key="index"
          class="col-12 col-md-6"
        >
          <div class="d-flex align-items-center justify-content-between border rounded-3 px-3 py-2">
            <div class="form-check m-0 d-flex align-items-center gap-2">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="item.checked"
                :id="'item-' + index"
              />
              <label class="form-check-label" :for="'item-' + index">
                {{ item.label }}
              </label>
            </div>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteItem(index)"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 버튼 오른쪽 정렬 -->
    <div class="d-flex justify-content-end">
      <button
        class="btn text-white px-4 py-2 rounded-3"
        style="background-color: #7b5e47;"
        @click="openModal"
      >
        + 항목 추가
      </button>
    </div>

    <!-- 모달 -->
    <div class="modal fade" id="addChecklistModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4">
          <h5 class="fw-bold mb-3">체크리스트 항목 추가</h5>

          <div class="mb-3">
            <label class="form-label fw-semibold">항목 이름</label>
            <input
              type="text"
              class="form-control"
              v-model="newItem"
              placeholder="예: 여권 확인"
            />
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              class="btn px-4 py-2 rounded-3"
              style="background-color: #f5f0ed;"
              @click="closeModal"
            >
              취소
            </button>
            <button
              type="button"
              class="btn px-4 py-2 rounded-3 text-white"
              style="background-color: #7b5e47;"
              @click="submitNewItem"
            >
              추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
