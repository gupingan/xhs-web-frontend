<!-- UserLogin.vue -->
<template>
  <div class="login-container">
    <transition name="fade">
      <div v-show="showSuccess" class="success-message">
        {{ successMessage }}
      </div>
    </transition>
    <transition name="fade">
      <div v-show="showError" class="error-message">{{ errorMessage }}</div>
    </transition>
    <form class="login-form">
      <h2>XHS-AUTO 系统</h2>
      <input v-model="username" placeholder="用户名" autocomplete="username" />
      <input
        v-model="password"
        placeholder="密码"
        type="password"
        autocomplete="current-password"
      />
      <button @click="login" :disabled="isLoggingIn">登录</button>
    </form>
  </div>
</template>

<script>
import api from "../js/api";
export default {
  data() {
    return {
      isLoggingIn: false,
      username: "",
      password: "",
      successMessage: "",
      errorMessage: "",
      showSuccess: false,
      showError: false,
    };
  },
  mounted() {
    this.checkAlreadyLogin();
  },
  methods: {
    login() {
      if (this.isLoggingIn) {
        return;
      }
      this.isLoggingIn = true;
      const loginData = {
        uname: this.username,
        upwd: this.password,
      };
      api
        .post("/user/login", loginData)
        .then((result) => {
          localStorage.setItem("token", result.data.token);
          this.showSuccess = true;
          this.successMessage = "登录成功！";
          setTimeout(() => {
            this.showSuccess = false;
            this.$router.push("/main");
          }, 2500);
        })
        .catch((err) => {
          this.showError = true;
          if (!err.response) {
            this.errorMessage = "无法连接到服务器，请检查您的网络连接";
          } else if (err.response.status === 400) {
            const login_count = err.response.data.count;
            console.log(login_count);
            this.errorMessage = `登录失败，你还有 ${login_count} 次机会`;
          } else if (err.response.status === 401) {
            this.errorMessage = "登录失败，该用户不存在";
          } else if (err.response.status === 403) {
            const remain_second = err.response.data.remain_second;
            this.errorMessage = `请 ${remain_second} s后重试`;
          } else {
            this.errorMessage = "发生错误，请稍后再试。";
          }
          setTimeout(() => {
            this.showError = false;
          }, 2500);
        })
        .finally(() => {
          this.isLoggingIn = false;
        });
    },
    checkAlreadyLogin() {
      api
        .get("/user/login/state")
        .then((result) => {
          if (result.data.success && result.data.msg === "已登录") {
            this.$router.push("/main");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  user-select: none;
}

.login-form {
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.login-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  box-sizing: border-box;
  transition: transform 0.3s, border-color 0.3s;
  letter-spacing: 1px;
}

.login-form input:focus {
  border-color: #111;
  transform: scale(1.05);
}

.login-form button {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.login-form button:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

.success-message,
.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  z-index: 999;
  pointer-events: none;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
}

.error-message {
  background-color: #f2dede;
  color: #a94442;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
