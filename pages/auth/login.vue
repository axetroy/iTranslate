<template>
  <div class="login-container">
    <div id="login-form">
      <h3>登陆</h3>
      <el-form :model="form" status-icon :rules="loginFormRules" ref="loginForm" label-width="0">
        <el-form-item prop="username" required>
          <el-input type="input" v-model="form.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pass" required>
          <el-input type="password" v-model="form.pass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="submitForm('loginForm')">登陆</el-button>
          <el-button type="text" size="small">
            <nuxt-link to="/auth/signup">还没账户? 马上注册</nuxt-link>
          </el-button>
          <el-button type="text" size="small">
            <nuxt-link to="/auth/forgot">忘记密码?</nuxt-link>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { query } from "~/utils/graphql";
import { Message } from "element-ui";
export default {
  layout: "entry",
  data() {
    const validateusername = (rule, value, callback) => {
      value === "" ? callback(new Error("请输入用户名")) : callback();
    };
    const validatePass = (rule, value, callback) => {
      value === "" ? callback(new Error("请输入密码")) : callback();
    };
    return {
      form: {
        username: "",
        pass: ""
      },
      loginFormRules: {
        username: [{ validator: validateusername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  computed: {
    profile: function() {
      return this.$store.state.user;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("login", {
              username: this.form.username,
              password: this.form.pass
            })
            .then(() => {
              Message({
                type: "success",
                message: "登陆成功..."
              });
              this.$router.push({ name: "index" });
            })
            .catch(err => {
              Message({
                type: "error",
                message: err.message
              });
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>

#login-form {
  top: 0;
  right: 5rem;
  width: 42rem;
  padding: 3.5rem 3.5rem 1.5rem 3.5rem;
  margin: 2rem auto;
  background-color: #fff;
  border-radius: 0.5rem;
  h3 {
    text-align: center;
    color: #303030;
    margin-bottom: 1rem;
  }
}
</style>
