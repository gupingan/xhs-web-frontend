<template>
  <div class="monitoring-area" ref="monitorPanel">
    <div class="upper-part">
      <p>数据监控</p>
      <div class="robot-info">
        <div class="info-row">
          <span><strong>用户ID：</strong>{{ fixedMonitorInfo.userId }}</span>
          <span><strong>状态：</strong>{{ fixedMonitorInfo.state }}</span>
        </div>
        <div class="info-row">
          <span
            ><strong>创建时间：</strong>{{ fixedMonitorInfo.create_time }}</span
          >
          <span
            ><strong>暂停时间：</strong>{{ fixedMonitorInfo.pause_time }}</span
          >
        </div>
        <div class="info-row">
          <span
            ><strong>工作时长：</strong>{{ fixedMonitorInfo.work_time }}</span
          >
          <span
            ><strong>抓链进度：</strong>{{ fixedMonitorInfo.fetch_progress }} /
            {{ fixedMonitorInfo.task_count }}</span
          >
          <span
            ><strong>任务进度：</strong>{{ fixedMonitorInfo.task_progress }} /
            {{ fixedMonitorInfo.task_count }}</span
          >
        </div>
        <div class="info-row">
          <span
            ><strong>评论成功数量：</strong
            >{{ fixedMonitorInfo.success_comment }}</span
          >
          <span
            ><strong>评论失败数量：</strong
            >{{ fixedMonitorInfo.failure_comment }}</span
          >
        </div>
        <div class="info-row">
          <span
            ><strong>任务地址：</strong
            ><a :href="fixedMonitorInfo.task_url" target="_blank">{{
              fixedMonitorInfo.task_url
            }}</a></span
          >
        </div>
        <div class="info-row">
          <span
            ><strong>评论内容：</strong
            >{{ fixedMonitorInfo.task_comment }}</span
          >
        </div>
      </div>
    </div>

    <div class="lower-part">
      <div class="info-row paticular">
        <p>重要日志区</p>
        <button class="clear-logs" @click="clearDynamicLogs">清空日志</button>
      </div>
      <div class="log-display-wrapper" ref="logWrapper" @scroll="handleScroll">
        <div class="log-display-area">
          <div v-for="(log, index) in dynamicLogs" :key="index">
            <span v-html="formatLog(log)"></span>
          </div>
        </div>
      </div>

      <button class="scroll-bottom" @click="scrollToBottom">滚动到底部</button>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import EventBus from "../../js/eventBus";
import api from "../../js/api";

const websocketUrl = process.env.VUE_APP_WEBSOCKET_URL;

export default {
  name: "MonitoringArea",
  data() {
    return {
      ws: null,
      fixedMonitorInfo: {
        userId: "",
        state: "",
        create_time: "",
        pause_time: "",
        work_time: "",
        fetch_progress: 0,
        task_progress: 0,
        success_comment: 0,
        failure_comment: 0,
        task_url: "",
        task_comment: "",
        task_count: 0,
      },
      dynamicLogs: [],
      shouldScrollToBottom: true,
      selectSpiderUserId: null,
      sensitiveWords: [],
    };
  },
  created() {
    EventBus.$on("offsetLeft", this.handleMonitorLeft);
    EventBus.$on("selectSpiderUserId", this.handleSelectSpider);
    this.ws = io.connect(websocketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      upgrade: false,
      forceNew: true,
      reconnection: false,
    });
    this.ws.on("connect", () => {
      console.log("Socket.IO Connected.");
    });
    setInterval(() => {
      const data = this.selectSpiderUserId;
      if (data != null) {
        this.ws.emit("updateFixed", data);
        this.ws.emit("updateDynamic", data);
      }
    }, 1000);
    this.ws.on("updateFixed", (data) => {
      this.fixedMonitorInfo = data.fixedMonitorInfo;
    });
    this.ws.on("updateDynamic", (data) => {
      if (data.dynamicMonitorInfo != "") {
        this.dynamicLogs.push(data.dynamicMonitorInfo);
      }
    });
    console.log("login after");
    this.$parent.$on("logged-in", () => {
      this.getSensitiveWords();
    });
  },
  beforeDestroy() {
    EventBus.$off("offsetLeft", this.handleMonitorLeft);
    EventBus.$off("selectSpiderUserId", this.handleSelectSpider);
    this.ws.close();
  },
  methods: {
    formatLog(log) {
      const regex = new RegExp(this.sensitiveWords.join("|"), "gi");
      log = log.replace(regex, '<span style="color: red;">$&</span>');
      return log.replace(
        /(https:\/\/\S+)/g,
        '<a href="$1" target="_blank">$1</a>'
      );
    },
    handleSelectSpider(userId) {
      this.selectSpiderUserId = userId;
    },
    // 滚动到底部
    scrollToBottom() {
      this.shouldScrollToBottom = true;
      this.$refs.logWrapper.scrollTop = this.$refs.logWrapper.scrollHeight;
    },
    // 处理滚动事件
    handleScroll() {
      const logWrapper = this.$refs.logWrapper;
      // 如果滚动条位置在底部，就设置 shouldScrollToBottom 为 true
      this.shouldScrollToBottom =
        logWrapper.scrollTop + logWrapper.clientHeight >=
        logWrapper.scrollHeight;
    },
    clearDynamicLogs() {
      this.dynamicLogs.splice(0, this.dynamicLogs.length);
    },
    handleMonitorLeft(offsetLeft, listWidth, msg) {
      if (msg == 0) {
        this.$refs.monitorPanel.style.marginLeft =
          listWidth * 0.2 + 20 + offsetLeft + "px";
      } else {
        this.$refs.monitorPanel.style.marginLeft = listWidth * 0.2 + 20 + "px";
      }
    },
    getSensitiveWords() {
      api
        .get(`/spider/sensitive_words`)
        .then((result) => {
          this.sensitiveWords = result.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    // 监听动态日志数组的变化
    dynamicLogs() {
      // 如果 shouldScrollToBottom 为 true，就滚动到底部
      if (this.shouldScrollToBottom) {
        this.$nextTick(() => {
          this.$refs.logWrapper.scrollTop = this.$refs.logWrapper.scrollHeight;
        });
      }
    },
  },
};
</script>

<style scoped src="../../styles/MonitoringArea.css"></style>
