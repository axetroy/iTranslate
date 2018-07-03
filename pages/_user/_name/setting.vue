<template>
  <el-row>
    <el-col :span="4">
      <el-menu :default-active="$route.path" :unique-opened="true">
        <el-menu-item v-for="menu in menus" :key="menu.name" :index="'/admin/dragonB/setting' + menu.path" @click="$router.replace('/' + $route.params.user + '/' + $route.params.name + '/setting' + menu.path)">
          {{menu.title}}
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <div style="margin-left: 2rem">
        <nuxt-child :repo="repo" :owner="owner"/>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { get } from "lodash";

export default {
  props: ["repo", "owner"],
  data() {
    return {
      menus: [
        {
          name: "index",
          path: "",
          title: "基本设置"
        },
        {
          name: "collaboration",
          path: "/collaboration",
          title: "管理协作者"
        },
        {
          name: "hooks",
          path: "/hooks",
          title: "管理 Web 钩子"
        }
      ]
    };
  }
};
</script>