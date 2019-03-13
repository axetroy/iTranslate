<template>
  <div class="org-setting">
    <div class="org-setting-banner">
      <div class="org-header-wrap">
        <div class="org-header">
          <div class="logo">
            <img class="avatar" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d?s=290" alt="">
          </div>
          <nuxt-link class="org-name" :to="'/' + owner.name">{{owner.name}}</nuxt-link>
        </div>
        <div class="org-header-menu">
          <el-menu mode="horizontal" :default-active="$route.path" :unique-opened="true">
            <el-menu-item v-for="menu in orgMenus" :key="menu.name" :index="'/org/' + owner.name +  menu.path" @click.native="$router.push({path: menu.prefix + '/' + owner.name + menu.path})">
              {{menu.title}}
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
    <div style="margin-top: 2rem;" class="org-setting-child">
      <nuxt-child :owner="owner"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$width: 82rem;
$borderColor: #e1e4e8;

.org-setting {
  width: 100%;
  .org-setting-banner{
    width: 100%;
    background-color: #f3f5f8;
  }
  .org-header-wrap, .org-setting-child{
    width: $width;
    margin: 0 auto;
  }
  .org-meta,
  .logo {
    display: inline-block;
  }
  .org-header {
    font-size: 0;
    padding: 1rem 0;
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

<style lang="scss">
$menuHeight: 4.4rem;

.org-header-menu{
  height: $menuHeight;
  .el-menu{
    background-color: inherit;
    border: 0;
    border-color: transparent;
    height: $menuHeight;
    .el-menu-item{
      border: 0;
      height: $menuHeight;
      line-height: $menuHeight;
      &:hover{
        background-color: inherit;
      }
      &.is-active{
        border: solid transparent;
        border-width: 3px 1px 1px;
        border-radius: 3px 3px 0 0;
        border-color: #e36209 #e1e4e8 transparent;
        background-color: #fff;
      }
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
              id
              name
              description
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
    return {
      owner: {},
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

