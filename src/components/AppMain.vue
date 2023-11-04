<template>
  <div id="app">
    <RobotList />
    <MonitoringArea />
    <ConfigurationArea />
    <ParticlesBackground />
  </div>
</template>

<script>
import RobotList from "./main/RobotList.vue";
import MonitoringArea from "./main/MonitoringArea.vue";
import ConfigurationArea from "./main/ConfigurationArea.vue";
import ParticlesBackground from "./main/ParticlesBackground.vue";
import api from "../js/api";

export default {
  name: "AppMain",
  components: {
    RobotList,
    MonitoringArea,
    ConfigurationArea,
    ParticlesBackground,
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        this.$router.push("/login");
      } else {
        api
          .get("/user/login/state")
          .then((result) => {
            if (result.data.msg === "已登录" && result.data.success) {
              this.$emit("logged-in");
            } else {
              this.$router.push("/login");
            }
          })
          .catch((err) => {
            if (!err.response) {
              console.log("网络无响应");
            } else {
              this.$router.push("/login");
            }
          });
      }
    },
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

@media screen and (max-width: 992px) {
  #app {
    flex-direction: column;
  }
}
</style>
