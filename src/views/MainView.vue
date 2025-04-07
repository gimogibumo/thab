<template>
  <div class="content">
    <div class="page-title">여행 관리</div>
    <div class="main-content">
      <TravelCard />
      <ExpenseSummary />
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.main-content {
  display: flex;
  justify-content: space-between;
}
</style>
