<template>
  <div class="configuration-area">
    <div class="search-area">
      <p>搜索词</p>
      <hr />
      <label for="multiKeywordSearch">
        <input type="checkbox" id="multiKeywordSearch" v-model="isMultiKey" />
        多关键词搜索模式
      </label>
      <input
        type="text"
        id="searchInput"
        placeholder="请输入搜索内容"
        v-show="!isMultiKey"
        v-model="searchKey"
      />
      <div for="multyKeysFile" class="file-upload" v-show="isMultiKey">
        <span>{{ multiKeysFile }}</span>
        <input
          type="file"
          id="multyKeysFile"
          @change="handleFileChange($event, 'multiKeys')"
        />
      </div>
    </div>
    <div class="filter-area">
      <p>筛选依据</p>
      <hr />
      <label>
        <input
          type="radio"
          name="filter"
          value="综合"
          v-model="selectedFilter"
        />
        综合
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          value="最新"
          v-model="selectedFilter"
        />
        最新
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          value="最热"
          v-model="selectedFilter"
        />
        最热
      </label>
    </div>
    <div class="category-area">
      <p>分类依据</p>
      <hr />
      <label>
        <input
          type="radio"
          name="category"
          value="混合采集"
          v-model="selectedCategory"
        />
        混合采集
      </label>
      <label>
        <input
          type="radio"
          name="category"
          value="采集图文"
          v-model="selectedCategory"
        />
        采集图文
      </label>
      <label>
        <input
          type="radio"
          name="category"
          value="采集视频"
          v-model="selectedCategory"
        />
        采集视频
      </label>
      <label>
        <input
          type="radio"
          name="category"
          value="先图文后视频"
          v-model="selectedCategory"
        />
        先图文后视频
      </label>
    </div>
    <div class="task-setting-area">
      <p>任务参数设置</p>
      <hr />
      <div class="task-row">
        <label> 目标任务量 </label>
        <input
          type="number"
          id="taskCount"
          v-model="taskCount"
          placeholder="最高设置1000单位"
          step="1"
          pattern="\d*"
          min="1"
          max="1000"
        />
      </div>
      <div class="task-row">
        <label
          ><input type="checkbox" id="loopMode" v-model="isCyclicMode" />
          循环模式
        </label>
        <input
          type="number"
          id="waitTime"
          placeholder="等待时间(分)"
          v-model="waitTime"
          v-show="isCyclicMode"
          step="1"
          pattern="\d*"
          min="1"
          max="10080"
        />
      </div>
      <div class="task-row">
        <label>
          <input type="checkbox" id="handLike" v-model="isToLike" /> 顺手点赞
        </label>
        <label>
          <input type="checkbox" id="handCollect" v-model="isToCollect" />
          顺手收藏
        </label>
        <label>
          <input type="checkbox" id="handFollow" v-model="isToFollow" />
          顺手关注
        </label>
      </div>
      <div class="task-row">
        <label>
          <input type="checkbox" id="isComment" v-model="isComment" /> 是否评论
        </label>
      </div>

      <div class="task-row" v-show="isComment">
        <label>
          <input
            type="radio"
            name="commentMode"
            value="默认模式"
            v-model="commentMode"
          />
          默认模式
        </label>
        <label>
          <input
            type="radio"
            name="commentMode"
            value="跳过已收藏"
            v-model="commentMode"
          />
          跳过已收藏
        </label>
        <label>
          <input
            type="radio"
            name="commentMode"
            value="再评论再收藏"
            v-model="commentMode"
          />
          再评论再收藏
        </label>
      </div>
      <div class="task-row" v-show="isComment">
        <label>
          <input
            type="checkbox"
            id="randomRareWords"
            v-model="isRandomRareWords"
          />
          随机生僻字
        </label>
        <input
          type="number"
          id="rareWordsCount"
          placeholder="生僻字数量(最大50)"
          v-model="rareWordsCount"
          v-show="isRandomRareWords"
          step="1"
          pattern="\d*"
          min="0"
          max="50"
        />
      </div>
      <div class="task-row" v-show="isComment">
        <label>
          <input type="checkbox" id="checkFailure" v-model="isCheckFailure" />
          检查失败
        </label>
        <label v-show="isCheckFailure">
          <input
            type="checkbox"
            id="retryAfterFailure"
            v-model="isRetryAfterFailure"
            v-show="isCheckFailure"
          />
          失败后重试</label
        >
        <input
          type="number"
          id="retryTimes"
          placeholder="重试次数(最大5次)"
          v-show="isRetryAfterFailure && isCheckFailure"
          v-model="retryTimes"
          step="1"
          pattern="\d*"
          min="0"
          max="5"
        />
      </div>
    </div>
    <div class="time-setting-area">
      <p>链环节时间设置</p>
      <hr />
      <label>
        <input
          type="checkbox"
          id="isRandomIntervalTime"
          v-model="isRandomIntervalTime"
        />
        间隔时间随机
      </label>
      <input
        type="number"
        id="intervalTime"
        placeholder="设置任务间隔时间(秒)"
        v-model="intervalTime"
        step="1"
        pattern="\d*"
        min="1"
        max="300"
      />
    </div>
    <div for="commentFile" class="file-upload">
      <span>{{ commentsFile }}</span>
      <input
        type="file"
        id="commentFile"
        @change="handleFileChange($event, 'comments')"
      />
    </div>
    <div class="qr-code-area" v-show="showQrCode">
      <div class="qr-code-mask" @click="closeMask"></div>
      <div class="qr-code-content">
        <img
          v-if="qrCodeUrl"
          :src="qrCodeUrl"
          alt="二维码"
          class="qr-code-image"
        />
        <div class="qr-code-tips" v-show="showQrCodeState">
          {{ qrCodeState }}
        </div>
      </div>
    </div>
    <div class="button-area">
      <button id="saveConfigure" @click="saveConfigure">保存当前配置</button>
      <button id="generateRobot" @click="generalSpider">生成机器爬虫</button>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import axios from "axios";
import EventBus from "../js/eventBus";
axios.defaults.headers.common["Content-Type"] =
  "multipart/form-data;charset=UTF-8";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "POST,GET,PUT,DELETE,OPTIONS";
axios.defaults.headers.common["Access-Control-Allow-Headers"] =
  "token,Content-Type";

const apiUrl = process.env.VUE_APP_API_URL;

export default {
  name: "ConfigurationArea",
  data() {
    return {
      isMultiKey: false,
      searchKey: "",
      selectedFilter: "最新",
      selectedCategory: "采集图文",
      taskCount: 200,
      isCyclicMode: true,
      waitTime: 5,
      isToLike: false,
      isToCollect: false,
      isToFollow: false,
      isComment: true,
      commentMode: "默认模式",
      isRandomRareWords: false,
      rareWordsCount: 3,
      isCheckFailure: true,
      isRetryAfterFailure: true,
      retryTimes: 3,
      isRandomIntervalTime: true,
      intervalTime: 5,
      run: false,
      qrCodeUrl: "",
      showQrCode: false,
      showQrCodeState: false,
      qrCodeState: "",
      secureSession: "",
      session: "",
      userId: "",
      comments: "",
      multiKeysFile: "请选择多关键词文件",
      commentsFile: "请选择评论文案",
    };
  },
  watch: {},
  mounted() {
    this.loadConfigure();
  },
  methods: {
    loadConfigure() {
      axios
        .get(`${apiUrl}configure/get`)
        .then((response) => {
          const data = response.data.data;
          this.isMultiKey = data.isMultiKey;
          this.searchKey = data.searchKey;
          this.selectedFilter = data.selectedFilter;
          this.selectedCategory = data.selectedCategory;
          this.taskCount = data.taskCount;
          this.isCyclicMode = data.isCyclicMode;
          this.waitTime = data.waitTime;
          this.isToLike = data.isToLike;
          this.isToCollect = data.isToCollect;
          this.isToFollow = data.isToFollow;
          this.isComment = data.isComment;
          this.commentMode = data.commentMode;
          this.isRandomRareWords = data.isRandomRareWords;
          this.rareWordsCount = data.rareWordsCount;
          this.isCheckFailure = data.isCheckFailure;
          this.isRetryAfterFailure = data.isRetryAfterFailure;
          this.retryTimes = data.retryTimes;
          this.isRandomIntervalTime = data.isRandomIntervalTime;
          this.intervalTime = data.intervalTime;
          this.comments = data.comments;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    saveConfigure() {
      const configure = {
        isMultiKey: this.isMultiKey,
        searchKey: this.searchKey,
        selectedFilter: this.selectedFilter,
        selectedCategory: this.selectedCategory,
        taskCount: this.taskCount,
        isCyclicMode: this.isCyclicMode,
        waitTime: this.waitTime,
        isToLike: this.isToLike,
        isToCollect: this.isToCollect,
        isToFollow: this.isToFollow,
        isComment: this.isComment,
        commentMode: this.commentMode,
        isRandomRareWords: this.isRandomRareWords,
        rareWordsCount: this.rareWordsCount,
        isCheckFailure: this.isCheckFailure,
        isRetryAfterFailure: this.isRetryAfterFailure,
        retryTimes: this.retryTimes,
        isRandomIntervalTime: this.isRandomIntervalTime,
        intervalTime: this.intervalTime,
        comments: this.comments,
      };
      axios
        .post(`${apiUrl}configure/set`, configure)
        .then((result) => {
          const response = result.data;
          if (response.success && response.msg == "保存配置成功") {
            alert("保存配置成功");
          } else {
            alert("保存配置失败");
          }
        })
        .catch((err) => {
          alert("保存配置失败" + err);
        });
    },
    generalSpider() {
      const fieldsText = {
        searchKey: "搜索词",
        comments: "评论内容",
      };
      for (const filed in fieldsText) {
        if (Object.hasOwnProperty.call(this.$data, filed)) {
          const element = this.$data[filed];
          if (!element || element.trim() == "") {
            alert("提示： " + fieldsText[filed] + " 不能为空，当心bug哦！");
            return;
          }
        }
      }
      this.getQrCodeUrl();
    },
    createSpider() {
      axios
        .post(`${apiUrl}create`, this.$data)
        .then((result) => {
          const data = Object.assign({}, result.data.data, this.$data);
          EventBus.$emit("spider", data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getQrCodeUrl() {
      axios
        .get(`${apiUrl}qrcode`)
        .then((result) => {
          console.log(result.data);
          var that = this;
          const url = result.data.data.url;
          const code = result.data.data.code;
          const qrId = result.data.data.qr_id;
          QRCode.toDataURL(url, (err, qrCodeUrl) => {
            if (err) {
              console.error(err);
            } else {
              this.qrCodeUrl = qrCodeUrl;
              this.showQrCode = true;

              const timerID = setInterval(() => {
                axios
                  .get(`${apiUrl}qrcode/state?qrId=${qrId}&code=${code}`)
                  .then((result) => {
                    const state = result.data.msg;
                    if (
                      state == "等待扫码" ||
                      state == "二维码已过期" ||
                      state == "登录成功"
                    ) {
                      that.qrCodeState = state;
                      that.showQrCodeState = true;
                    }
                    if (state == "登录成功" || state == "二维码已过期") {
                      clearInterval(timerID);
                      that.qrCodeState = state;
                      that.showQrCodeState = false;
                      that.showQrCode = false;
                    }
                    if (state == "登录成功") {
                      this.secureSession = result.data.data.secure_session;
                      this.session = result.data.data.session;
                      this.userId = result.data.data.user_id;
                      this.createSpider();
                    }
                  })
                  .catch((err) => {
                    clearInterval(timerID);
                    this.showQrCode = false;
                    that.showQrCodeState = false;
                    console.log(err);
                  });
              }, 3000);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleFileChange(event, type) {
      const file = event.target.files[0];
      if (!file || !file.name.endsWith(".txt")) {
        alert("请选择一个 .txt 格式的文件");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        const keywords = contents.split("\n").map((keyword) => keyword.trim());
        if (type === "multiKeys") {
          this.searchKey = keywords.join("|");
          this.multiKeysFile = file.name;
        } else if (type === "comments") {
          this.comments = keywords.join("|");
          this.commentsFile = file.name;
        }
      };
      reader.readAsText(file);
    },
    closeMask() {
      this.showQrCode = false;
      this.showQrCodeState = false;
    },
  },
};
</script>

<style scoped src="../styles/ConfigurationArea.css">
/* 在这里添加样式 */
</style>
