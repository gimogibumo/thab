<template>
  <div class="d-flex">
    <NavBar />
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import Header from '@/components/Header.vue'
</script>

<style scoped>
.content {
  flex-grow: 1;
  margin-left: 270px;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
}
.colors {
  background-color: #8b6f5c;
}
</style>
