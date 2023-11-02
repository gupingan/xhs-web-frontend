<!-- App.vue -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: "Roboto", Arial, sans-serif;
}
body {
  background-color: #fcfcfc;
  display: flex;
  height: 100vh;
  margin: 0;
}
</style>
