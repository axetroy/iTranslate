<template>
  <div class="org-setting">
    <div class="org-header">
      <div class="logo">
        <img class="avatar" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d?s=290" alt="">
      </div>
      <nuxt-link class="org-name" :to="'/' + owner.name">{{owner.name}}</nuxt-link>
    </div>
    <div>
      <el-menu mode="horizontal" :default-active="$route.path" :unique-opened="true">
        <el-menu-item v-for="menu in orgMenus" :key="menu.name" :index="'/org/' + owner.name + '/' + menu.path">
          <nuxt-link :to="menu.prefix + '/' + owner.name + menu.path">{{menu.title}}</nuxt-link>
        </el-menu-item>
      </el-menu>
    </div>
    <el-row style="margin-top: 2rem;">
      <el-col :span="4">
        <aside-menu title="组织设置" :menus="menus" />
      </el-col>
      <el-col :span="20">
        <div style="margin-left: 2rem;">
          <nuxt-child :owner="owner"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
$width: 99rem;
$borderColor: #e1e4e8;

.org-setting {
  width: $width;
  margin: 0 auto;
  .org-meta,
  .logo {
    display: inline-block;
  }
  .org-header {
    font-size: 0;
  }
  .org-name {
    font-size: 2rem;
    font-weight: 400;
    color: #24292e;
  }
  .org-name,
  .logo {
    vertical-align: middle;
  }
  .logo {
    font-size: 1.6rem;
    margin-right: 1rem;
    img {
      width: 3rem;
      height: 3rem;
    }
  }
  .org-meta {
    font-size: 1.6rem;
    vertical-align: top;
    margin-left: 2rem;
    > div {
      &:first-child {
        margin-top: 0;
      }
      margin: 1rem 0;
    }
    .org-detail {
      color: #666;
    }
  }
}
</style>

<script>
import { get } from "lodash";

/**
 * 获取组织详情
 */
function getOrgDetail(orgName) {
  return async function(graphql) {
    const res = await graphql(
      `
        query getPublicOrg($name: String!) {
          public {
            organization(name: $name) {
              name
              createdAt
              updatedAt
            }
          }
        }
      `,
      { name: orgName }
    );

    return get(res, ["data", "public", "organization"]);
  };
}

export default {
  async asyncData({ $graphql, params }) {
    const owner = params.owner;
    const orgInfo = await getOrgDetail(owner)($graphql);
    return { owner: orgInfo };
  },
  data() {
    const route = this.$route;

    return {
      owner: {},
      menus: [
        {
          name: "index",
          path: "",
          title: "基本设置"
        },
        {
          name: "hooks",
          path: "/hooks",
          title: "管理 Web 钩子"
        }
      ].map(v => {
        v.prefix = "/org/" + route.params.owner + "/setting";
        return v;
      }),
      orgMenus: [
        {
          name: "Repositories",
          prefix: "",
          path: "",
          title: "项目"
        },
        {
          name: "People",
          prefix: "/org",
          path: "/people",
          title: "成员"
        },
        {
          name: "Setting",
          prefix: "/org",
          path: "/setting",
          title: "设置"
        }
      ]
    };
  }
};
</script>

