<template>
  <div class="login-container">
    <div id="login-form">
      <h3>注册</h3>
      <el-form :model="loginForm" status-icon :rules="loginFormRules" ref="loginForm2" label-width="12rem">
        <el-form-item prop="username" label="用户名" required>
          <el-input type="input" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="电子邮箱" required>
          <el-input type="email" v-model="loginForm.email" auto-complete="off" placeholder="电子邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="pass" label="密码" required>
          <el-input type="password" v-model="loginForm.pass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="pass2" label="确认密码" required>
          <el-input type="password" v-model="loginForm.pass2" auto-complete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="submitForm('loginForm2')">立即注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { query } from "~/utils/graphql";

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
      loginForm: {
        username: "",
        pass: ""
      },
      loginFormRules: {
        username: [{ validator: validateusername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  fetch({ store, redirect }) {
    if (store.state.user) {
      return redirect("/main");
    }
  },
  computed: {
    profile: function() {
      return this.$store.state.user;
    }
  },
  methods: {
    submitForm(formName) {
      const form = this.loginForm;
      this.$refs[formName].validate(valid => {
        if (valid) {
          query(
            `
            mutation register($argv: RegistryArgv){
              public{
                registry(argv: $argv){
                  uid
                  username
                  createdAt
                  updatedAt
                }
              }
            }
          `,
            {
              argv: {
                username: form.username,
                password: form.pass,
                email: form.email
              }
            }
          )
            .then(() => {
              this.$success("注册成功...");
            })
            .catch(err => {
              this.$error(err.message);
            });
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
