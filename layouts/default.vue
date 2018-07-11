<template>
  <el-container>
    <el-header id="header">
      <div id="menu">
        <el-menu :default-active="$router.path" mode="horizontal" router>
          <template v-if="!$store.state.user">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/explorer">发现</el-menu-item>
            <el-menu-item index="/help">帮助</el-menu-item>
            <el-menu-item class="pull-right" index="/auth/signup">注册</el-menu-item>
            <el-menu-item class="pull-right" index="/auth/login">登陆</el-menu-item>
          </template>
          <template v-else>
            <el-menu-item index="/">控制面板</el-menu-item>
            <el-menu-item index="/explorer">发现</el-menu-item>
            <el-menu-item index="/help">帮助</el-menu-item>
            <div class="pull-right">
              <el-dropdown @command="createCommandHandler" class="user-meta" trigger="click">
                <span class="el-dropdown-link">
                  新建<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="newRepo">创建新的仓库</el-dropdown-item>
                  <el-dropdown-item command="newOrg">创建新的组织</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="metaCommandHandler" class="user-meta" trigger="click">
                <span class="el-dropdown-link">
                  <img class="avatar" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d"><i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>已登陆用户 {{$store.state.user.username}}</el-dropdown-item>
                  <nuxt-link :to="'/' + $store.state.user.username">
                    <el-dropdown-item divided>
                      个人信息
                    </el-dropdown-item>
                  </nuxt-link>
                  <nuxt-link to="/setting/profile">
                    <el-dropdown-item divided>
                      用户设置
                    </el-dropdown-item>
                  </nuxt-link>
                  <el-dropdown-item>帮助</el-dropdown-item>
                  <el-dropdown-item>管理面板</el-dropdown-item>
                  <el-dropdown-item divided command="logout">登出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-menu>
      </div>
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer>
      <div id="footer">
        Copyright 2018 by Axetroy
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    createCommandHandler(command) {
      switch (command) {
        case "newRepo":
          this.$router.replace({ path: "/repo/create" });
          break;
        case "newOrg":
          this.$router.replace({ path: "/org/create" });
          break;
      }
    },
    metaCommandHandler(command) {
      switch (command) {
        case "logout":
          this.$store.dispatch("logout");
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
$width: 99rem;

#header {
  height: 6rem;
  background-color: #fff;
  line-height: 6rem;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 1px 1px 1px solid #303030;
  #menu {
    width: $width;
    margin: 0 auto;
  }
}

#footer {
  width: $width;
  margin: 0 auto;
  text-align: center;
}

.avatar {
  width: 26px;
  height: 26px;
  vertical-align: middle;
}

.user-meta {
  margin-left: 2rem;
}
</style>
