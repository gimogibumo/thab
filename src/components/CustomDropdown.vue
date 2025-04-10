<template>
    <div class="dropdown w-100 position-relative">
      <!-- 드롭다운 버튼 -->
      <button
        class="dropdown-toggle w-100 text-start btn btn-outline-secondary"
        type="button"
        @click="toggleDropdown"
      >
        {{ selectedCategoryLabel }}
      </button>
  
      <!-- 드롭다운 메뉴 -->
      <div
        v-if="showDropdown"
        class="dropdown-menu show shadow rounded mt-2 w-100 p-3"
        style="z-index: 1000;"
      >
        <!-- 닫기 버튼 -->
        <button
          class="btn-close position-absolute"
          style="top: 10px; right: 10px;"
          @click="closeDropdown"
          aria-label="Close"
        ></button>
  
        <!-- 제목 -->
        <div class="fw-bold text-secondary mb-2">전체 카테고리</div>
  
        <!-- 카테고리 버튼들 -->
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category"
            @click="toggleCategory(category)"
            class="category-btn"
            :class="{ selected: selectedCategories.includes(category) }"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>
</template>  
<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  
  const emit = defineEmits(['update:category'])
  
  const categories = ['숙박', '식비', '교통', '관광', '쇼핑', '기타']
  const selectedCategories = ref([])
  const showDropdown = ref(false)
  
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
  }
  
  const closeDropdown = () => {
    showDropdown.value = false
  }
  
  const toggleCategory = (category) => {
    const index = selectedCategories.value.indexOf(category)
    if (index === -1) {
      selectedCategories.value.push(category)
    } else {
      selectedCategories.value.splice(index, 1)
    }
    emit('update:category', [...selectedCategories.value])
  }
  
  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown')) {
      showDropdown.value = false
    }
  }
  
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
  
const selectedCategoryLabel = computed(() => {
    if (
        selectedCategories.value.length === 0 || 
        selectedCategories.value.length === categories.length
    ) {
        return '전체 카테고리'
    }
    return selectedCategories.value.join(', ')
})
</script>
  
<style scoped>
  .category-btn {
    border: 1px solid #7c4a2d;
    color: #7c4a2d;
    background-color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .category-btn:hover {
    background-color: #f3e8e2;
  }
  
  .category-btn.selected {
    background-color: #7c4a2d;
    color: white;
  }
  
  .btn-close {
    background-color: transparent;
    border: none;
    opacity: 0.7;
  }
  </style>
  