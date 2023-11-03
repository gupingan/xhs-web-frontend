<template>
  <div class="robot-list-wrapper" @click="hideMenu">
    <ul class="robot-list" :class="{ collapsed: !showList, expand: showList }">
      <div class="self-section">
        <div class="self-info">
          <div class="avatar-wrapper" @click.stop="toggleMenu($event)">
            <img
              class="avatar"
              src="../../assets/header.jpg"
              alt="User Avatar"
            />
          </div>
          <div class="username">{{ username }}</div>
        </div>
        <div
          class="menu"
          v-if="showMenu"
          :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }"
        >
          <button class="menu-item" @click="changePassword">修改密码</button>
          <div class="hr"></div>
          <button class="menu-item" @click="logout">退出</button>
        </div>
      </div>
      <div class="robot-list-title">
        <h2>列表（{{ spiders.length }} / {{ max_limit }}）</h2>
        <div
          @click="toggleList"
          :class="{ collapsed: !showList, expand: showList }"
        ></div>
      </div>
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
      showMenu: false,
      menuPosition: {
        x: 0,
        y: 0,
      },
      username: "",
      max_limit: 0,
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
      this.loadUserInfo();
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
    toggleMenu(event) {
      this.menuPosition.x = event.clientX;
      this.menuPosition.y = event.clientY;
      this.showMenu = !this.showMenu;
    },
    hideMenu() {
      this.showMenu = false;
    },
    logout() {
      api
        .get("/user/logout")
        .then((result) => {
          console.log(result);
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.hideMenu();
        });
    },
    changePassword() {
      this.hideMenu();
      this.showMenu = false;
    },
    loadUserInfo() {
      api
        .get("/user/info")
        .then((result) => {
          this.username = result.data.user.uname;
          this.max_limit = result.data.user.max_limit;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped src="..//../styles/RobotList.css"></style>
