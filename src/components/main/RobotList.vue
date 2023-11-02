<template>
  <div class="robot-list-wrapper">
    <ul class="robot-list" :class="{ collapsed: !showList, expand: showList }">
      <div class="robot-list-title">
        <h2>爬虫列表</h2>
        <div
          @click="toggleList"
          :class="{ collapsed: !showList, expand: showList }"
        ></div>
      </div>
      <hr />

      <li v-for="(spider, index) in spiders" :key="spider.userId">
        <span @click="selectSpider(spider.userId)">{{ index + 1 }}</span>
        <span class="robot-id" @click="selectSpider(spider.userId)">{{
          spider.userId
        }}</span>
        <div
          class="pause-robot"
          :class="{ run: spider.run }"
          @click="toggleRun(spider)"
        ></div>
        <button class="delete-robot" @click="deleteRobot(spider)"></button>
      </li>
    </ul>
  </div>
</template>

<script>
import EventBus from "../../js/eventBus";
import api from "../../js/api";

export default {
  name: "RobotList",
  data() {
    return {
      showList: false,
      spiders: [],
    };
  },
  created() {
    EventBus.$on("spider", this.handleDataUpdate);
  },
  beforeDestroy() {
    EventBus.$off("spider", this.handleDataUpdate);
  },
  mounted() {
    this.$parent.$on("logged-in", () => {
      this.loadSpiders();
    });
    document.querySelector(".robot-list").classList.add("collapsed");
    this.emitOffsetInfo(1);
  },
  methods: {
    selectSpider(userId) {
      EventBus.$emit("selectSpiderUserId", userId);
    },
    loadSpiders() {
      api
        .get(`/spider/load`)
        .then((result) => {
          this.spiders = result.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDataUpdate(spider) {
      this.spiders.push(spider);
    },
    toggleRun(spider) {
      spider.run = !spider.run;
      api
        .post(`/spider/set_state`, spider)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRobot(spider) {
      api
        .get(`/spider/delete`, {
          params: { userId: spider.userId },
        })
        .then((result) => {
          this.spiders = result.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toggleList() {
      this.showList = !this.showList;
      this.emitOffsetInfo();
    },
    emitOffsetInfo(msg = 0) {
      const element = document.getElementsByClassName("robot-list")[0];
      const offsetLeft = element.offsetLeft;
      const listWidth = element.offsetWidth;
      EventBus.$emit("offsetLeft", offsetLeft * -1, listWidth, msg);
    },
  },
};
</script>

<style scoped src="..//../styles/RobotList.css"></style>
