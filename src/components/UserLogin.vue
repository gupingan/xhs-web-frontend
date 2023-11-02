<!-- UserLogin.vue -->
<template>
  <div class="login-container">
    <form class="login-form">
      <h2>XHS-AUTO 系统</h2>
      <input v-model="username" placeholder="用户名" autocomplete="username" />
      <input
        v-model="password"
        placeholder="密码"
        type="password"
        autocomplete="current-password"
      />
      <button @click="login">登录</button>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import api from "../js/api";
export default {
  data() {
    return {
      username: "",
      password: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      const loginData = {
        uname: this.username,
        upwd: this.password,
      };
      api
        .post("/user/login", loginData)
        .then((result) => {
          localStorage.setItem("token", result.data.token);
          this.successMessage = "登录成功！";
          setTimeout(() => {
            this.successMessage = "";
            this.$router.push("/main");
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          this.errorMessage = "登录失败，请检查您的用户名和密码。";
          setTimeout(() => {
            this.errorMessage = "";
          }, 3000);
        });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
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
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
}

.error-message {
  background-color: #f2dede;
  color: #a94442;
}
</style>
