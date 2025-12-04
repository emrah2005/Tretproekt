<template>
  <div class="app">
    <h1>Tretproekt - Influencer Platform</h1>
    <p>Frontend connected to Laravel backend!</p>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  padding: 20px;
}
</style>
