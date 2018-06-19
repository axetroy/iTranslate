<template>
  <div class="container">
    <nuxt-link class="owner" :to="'/' + repo.owner.username">{{repo.owner.username}}</nuxt-link>/<nuxt-link class="repo" :to="'/' + repo.owner.username + '/' + repo.name">{{repo.name}}</nuxt-link>
    <div class="meta">
      <span class="desc">{{repo.description || '暂无描述'}}</span>
    </div>

    <el-menu mode="horizontal" :default-active="$route.path" :unique-opened="true">
      <el-menu-item v-for="menu in menus" :key="menu.name" :index="'/admin/dragonB' + menu.path" @click="$router.replace('/' + repo.owner.username + '/' + repo.name + menu.path)">
        {{menu.title}}
      </el-menu-item>
    </el-menu>

    <div class="child">
      <nuxt-child :repo="repo"/>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  async asyncData(context) {
    const { $graphql, params, redirect } = context;
    if (!params.name) {
      return redirect("/404");
    }

    const promise = $graphql(
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

    context.promise = promise;

    const data = await promise;

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
      repo: {},
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
  },
  methods: {}
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
    // margin: 1rem 0;
    color: #333333;
  }
}

.child {
  margin-top: 2rem;
}
</style>

