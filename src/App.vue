<template>
  <div id="app">
    <RobotList />
    <MonitoringArea />
    <ConfigurationArea />
    <ParticlesBackground />
  </div>
</template>

<script>
import RobotList from "./components/RobotList.vue";
import MonitoringArea from "./components/MonitoringArea.vue";
import ConfigurationArea from "./components/ConfigurationArea.vue";
import ParticlesBackground from "./components/ParticlesBackground.vue";
export default {
  name: "App",
  components: {
    RobotList,
    MonitoringArea,
    ConfigurationArea,
    ParticlesBackground,
  },
};
</script>

<style>
#app {
  display: flex;
  font-family: "Roboto", Arial, sans-serif;
}
body {
  background-color: #fcfcfc;
  display: flex;
  height: 100vh;
  margin: 0;
}
</style>
