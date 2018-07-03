<template>
  <div class="container">
    <nuxt-link class="owner" :to="'/' + owner.username">{{owner.username}}</nuxt-link>/<nuxt-link class="repo" :to="'/' + owner.username + '/' + repo.name">{{repo.name}}</nuxt-link>
    <div class="meta">
      <span class="desc">{{repo.description || '暂无描述'}}</span>
    </div>

    <el-menu mode="horizontal" :default-active="$route.path" :unique-opened="true">
      <el-menu-item v-for="menu in menus" :key="menu.name" :index="'/admin/dragonB' + menu.path" @click="$router.replace('/' + owner.username + '/' + repo.name + menu.path)">
        {{menu.title}}
      </el-menu-item>
    </el-menu>

    <div class="child">
      <nuxt-child :repo="repo" :owner="owner"/>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  async asyncData({ $graphql, params, redirect }) {
    const ownerName = params.user;
    const repoName = params.name;

    if (!params.name) {
      return redirect("/404");
    }

    const response = await $graphql(
      `
        query detail($owner: String!, $name: String!){
          public {
            repository(owner: $owner, name: $name) {
              id
              name
              owner{
                username
              }
              org{
                name
              }
              description
              languages
            }
          }
        }
    `,
      { owner: ownerName, name: repoName }
    );

    const repo = get(response, ["data", "public", "repository"]);
    const owner = repo.owner || repo.org;
    owner.username = owner.username || owner.name;

    if (!repo || !owner) {
      return redirect("/404");
    }

    return {
      isUser: !!repo.owner,
      repo,
      owner
    };
  },
  data() {
    return {
      isUser: true,
      repo: {},
      owner: {},
      menus: [
        {
          name: "index",
          path: "",
          title: "字段"
        },
        {
          name: "issue",
          path: "/issue",
          title: "工单管理"
        },
        {
          name: "wiki",
          path: "/wiki",
          title: "Wiki"
        },
        {
          name: "export",
          path: "/export",
          title: "导出"
        },
        {
          name: "setting",
          path: "/setting",
          title: "设置"
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.owner,
.repo {
  font-size: 3rem;
  text-decoration: none;
}

.container {
  width: 98rem;
  margin: 0 auto;
}

.meta {
  margin: 1rem 0;
  .desc {
    color: #333333;
  }
}

.child {
  margin-top: 2rem;
}
</style>

