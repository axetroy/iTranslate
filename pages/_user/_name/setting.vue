<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-menu :default-active="$route.path" :unique-opened="true">
          <el-menu-item v-for="menu in menus" :key="menu.name" :index="'/admin/dragonB/setting' + menu.path" @click="$router.replace('/' + repo.owner.username + '/' + repo.name + '/setting' + menu.path)">
            {{menu.title}}
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div style="margin-left: 2rem">
          <nuxt-child :repo="repo"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  async asyncData({ $graphql, params, redirect }) {
    if (!params.name) {
      return redirect("/404");
    }
    const data = await $graphql(
      `
      query detail($name: String!){
        me {
          repository(name: $name) {
            id
            name
            owner{
              username
            }
            description
            languages
          }
        }
      }
    `,
      { name: params.name }
    );

    const repo = get(data, ["data", "me", "repository"]);

    if (!repo) {
      return redirect("/404");
    }

    return {
      repo
    };
  },
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

<style lang="less">
.pannel {
  padding: 2rem;
  border: 1px solid #e5e5e5;
  margin-bottom: 3rem;
  &.danger {
    border: 1px solid #f0c36d;
    .pannel-header {
      background-color: #f9edbe;
    }
    .danger-content {
      overflow: hidden;
      margin: 2rem 0;
    }
    .danger-content-left {
      float: left;
    }
    .danger-content-right {
      float: right;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
  .pannel-header {
    background-color: #f0f0f0;
    margin: -2rem -2rem 2rem -2rem;
    .pannel-title {
      padding-left: 2rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
      font-size: 1.5rem;
      color: #000;
    }
  }
}
</style>

