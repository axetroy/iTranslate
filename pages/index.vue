<template>
  <div id="content">
    <!-- 未登陆的情况下 -->
    <template v-if="!$store.state.user">
      <div style="text-align:center">
        <img src="http://111.230.30.41/img/favicon.png" alt>
        <h1>I18n</h1>
        <h2>一款极易搭建的 I18n 自助服务</h2>
      </div>
      <el-row :gutter="8">
        <el-col :span="12" class="feat-row">
          <h3>
            <img src="/img/rocket.png">易安装
          </h3>
          <p>任何 NodeJS 环境都可以运行，支持多个版本. 还可以通过 Docker 一件安装</p>
        </el-col>
        <el-col :span="12" class="feat-row">
          <h3>
            <img src="/img/computer.png">跨平台
          </h3>
          <p>任何 NodeJS 语言 支持的平台都可以运行, Windows、Mac、Linux 以及 ARM。</p>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="12" class="feat-row">
          <h3>
            <img src="/img/rocket.png">轻量级
          </h3>
          <p>I18n 基于NodeJS开发，只占用了少量的内存, 一个小巧的树莓派都可以运行.</p>
        </el-col>
        <el-col :span="12" class="feat-row">
          <h3>
            <img src="/img/github.png">开源化
          </h3>
          <p>全代码开源在Github上，你可以放心使用，甚至可以不经过我的同意，安装在你们公司内网中。</p>
        </el-col>
      </el-row>
    </template>
    <!-- 已登陆的情况下 -->
    <template v-else>
      <el-row :getter="0">
        <el-col :span="18">hello</el-col>
        <el-col :span="6">
          <el-tabs type="card">
            <el-tab-pane label="仓库">
              <el-card>
                <div slot="header">
                  <span>我的仓库
                    <span class="badge">{{repoMeta.count || 0}}</span>
                  </span>
                  <nuxt-link to="/repo/create">
                    <el-button style="float: right; padding: 3px 0" type="text">+</el-button>
                  </nuxt-link>
                </div>
                <div v-for="repo of repositories" :key="repo.id" class="repo">
                  <nuxt-link :to="'/' + $store.state.user.username + '/' + repo.name">{{repo.name}}</nuxt-link>
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="组织">
              <el-card>
                <div slot="header">
                  <span>我的组织
                    <span class="badge">{{orgsMeta.count || 0}}</span>
                  </span>
                  <nuxt-link to="/org/create">
                    <el-button style="float: right; padding: 3px 0" type="text">+</el-button>
                  </nuxt-link>
                </div>
                <div v-for="org of orgs" :key="org.id" class="repo">
                  <nuxt-link :to="'/' + org.name">{{org.name}}</nuxt-link>
                </div>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import { get } from "lodash";

function getRepositories() {
  return async function(graphql) {
    const data = await graphql(`
      query repo {
        me {
          repositories(query: { limit: 10 }) {
            data {
              name
              description
              isPrivate
              readme
            }
            meta {
              count
            }
          }
        }
      }
    `);
    const entity = get(data, ["data", "me", "repositories"]);
    const repositories = get(entity, ["data"]);
    const meta = get(entity, ["meta"]);
    return { repositories, meta };
  };
}

function getOrgs() {
  return async function(graphql) {
    const data = await graphql(`
      query repo {
        me {
          organizations(query: { limit: 10 }) {
            data {
              id
              name
              description
            }
            meta {
              count
            }
          }
        }
      }
    `);
    const organizations = get(data, ["data", "me", "organizations", "data"]);
    const meta = get(data, ["data", "me", "organizations", "meta"]);
    return { organizations, meta };
  };
}

export default {
  data() {
    return {
      repositories: [],
      repoMeta: {},
      orgs: [],
      orgsMeta: {}
    };
  },
  async asyncData({ store, $graphql }) {
    if (store.state.user) {
      const [
        { repositories, meta: repoMeta },
        { organizations, meta: orgsMeta }
      ] = await Promise.all([getRepositories()($graphql), getOrgs()($graphql)]);

      return {
        repositories,
        orgs: organizations,
        repoMeta,
        orgsMeta
      };
    }
  }
};
</script>

<style scoped lang="scss">
$width: 99rem;

#content {
  width: $width;
  margin: 0 auto;
  .feat-row {
    padding: 2rem 4rem;
    margin: 2rem 0;
    text-align: center;
    img {
      width: 4rem;
      height: 4rem;
      line-height: 4rem;
      vertical-align: middle;
      margin-right: 0.5rem;
    }
    p {
      font-size: 1.6rem;
      line-height: 1.6rem;
      color: #303030;
      margin: 2rem 0;
      padding: 2rem 6rem;
      line-height: 3rem;
    }
  }
}

.repo {
  padding: 1rem 0.5rem;
  &:hover {
    background-color: #e5e5e5;
  }
}

.badge {
  padding: 0px 10px;
  margin-top: -4px;
  margin-left: 0.5rem;
  background-color: #767676;
  border-color: #767676;
  color: #fff;
  border-radius: 0.5rem;
}
</style>
