<template>
  <div id="content">
    <el-row v-if="isUser" :gutter="0">
      <el-col :span="6" class="user-info">
        <div><img class="avatar" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d?s=290" alt=""></div>
        <div class="meta-block">
          <div class="name-block">
            <span class="username">{{userInfo.username}}</span>
            <span class="nickname">{{userInfo.nickname}}</span>
          </div>

          <div class="desc">
            Fool Stand Developer
          </div>

          <el-button class="edit-info">编辑</el-button>
        </div>
        <div class="meta-block">
          <ul>
            <li class="v-detail">{{userInfo.email}}</li>
            <li class="v-detail">http://axetroy.xyz</li>
            <li class="v-detail">加入于 {{userInfo.createdAt | date}}</li>
            <li class="v-detail">0 关注着 - 0 关注中</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="18" class="content">
        <el-form :inline="true" :model="form" class="search-block">
          <el-form-item>
            <el-input v-model="form.name" placeholder="搜索仓库..."></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.type" placeholder="请选择类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="原创" value="source"></el-option>
              <el-option label="克隆" value="fork"></el-option>
              <el-option label="镜像" value="mirror"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
        <div v-for="v in publicRepositories" :key="v.id" class="repository">
          <div class="repository-item repository-info">
            <nuxt-link :to="'/' + v.owner.username + '/' + v.name">{{v.name}}</nuxt-link>
          </div>
          <div class="repository-item repository-desc">
            <p>{{v.description}}</p>
          </div>
          <div class="repository-item repository-meta">
            创建于 {{v.createdAt | timeago}} 更新于 {{v.updatedAt | timeago}}
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            @current-change="changePage"
            background
            layout="prev, pager, next"
            :current-page="meta.page + 1"
            :pager-count="11"
            :page-size="meta.limit"
            :total="meta.count">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-row class="org" v-if="isOrganization" :gutter="0">
      <div class="org-header">
        <div class="logo">
          <img class="avatar" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d?s=290" alt="">
        </div>
        <div class="org-meta">
          <div>{{organization.name}}</div>
          <div>这是组织描述</div>
          <div class="org-detail">
            <span>上海</span>
            <span>http://example.com</span>
            <span>email@example.com</span>
          </div>
        </div>
      </div>
      <div>
        <el-menu mode="horizontal" :default-active="$route.path" :unique-opened="true">
          <el-menu-item v-for="menu in orgMenus" :key="menu.name" :index="'/admin/dragonB' + menu.path" @click="$router.replace('/' + repo.owner.username + '/' + repo.name + menu.path)">
            {{menu.title}}
          </el-menu-item>
        </el-menu>
      </div>
      <el-col :span="18">
        组织列表
      </el-col>
      <el-col :span="6">
        组织详情
        {{organization}}
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
$width: 990px;
$borderColor: #e1e4e8;

#content {
  width: $width;
  margin: 0 auto;
}

.user-info {
  .meta-block {
    padding: 1.6rem 0;
    border-bottom: 1px solid #e1e4e8;
  }

  .edit-info {
    width: 100%;
  }

  .desc {
    margin-bottom: 1.6rem;
    overflow: hidden;
    font-size: 1.4rem;
    color: #6a737d;
  }

  .name-block {
    margin: 0 0 1.6rem 0;
    .username {
      font-size: 2.6rem;
      line-height: 3rem;
      font-weight: 600;
      display: block;
    }

    .nickname {
      font-size: 2rem;
      font-style: normal;
      font-weight: 300;
      line-height: 2.4rem;
      color: #666;
      display: block;
    }
  }

  .v-detail {
    font-size: 1.4rem;
    margin: 0.5rem 0;
  }
}

.content {
  padding: 1rem;
  .search-block {
    border-bottom: 1px solid $borderColor;
  }
  .repository {
    padding: 2rem 0;
    border-bottom: 1px solid $borderColor;
    .repository-info {
      a {
        color: #0366d6;
        font-size: 2rem;
      }
    }
    .repository-item {
      margin: 1rem;
    }
    .repository-desc {
      color: #586069;
      font-size: 1.2rem;
    }
  }
}

.org {
  .org-meta,
  .logo {
    display: inline-block;
  }
  .org-header {
    font-size: 0;
  }
  .logo {
    font-size: 1.6rem;
    img {
      width: 10rem;
      height: 10rem;
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

function getRepositories(meta) {
  return async function(graphql) {
    const repositoriesResponse = await graphql(
      `
        query get($query: FormQuery!) {
          public {
            repositories(query: $query) {
              data {
                id
                name
                owner {
                  username
                }
                description
                createdAt
                updatedAt
              }
              meta {
                limit
                page
                count
                num
              }
            }
          }
        }
      `,
      {
        query: {
          limit: meta.limit,
          page: meta.page
        }
      }
    );
    const { data, meta: _meta } = get(repositoriesResponse, [
      "data",
      "public",
      "repositories"
    ]);
    return { data, meta: _meta };
  };
}

export default {
  async asyncData({ $graphql, query, params }) {
    const { user } = params;
    const { page, limit } = query;

    // 先判断user是用户，还是组织
    const isUserResponse = await $graphql(
      `
      query getUserInfo($username: String!){
        public{
          isUser(username: $username)
        }
      }
    `,
      { username: user }
    );

    const isUser = !!get(isUserResponse, ["data", "public", "isUser"]);

    if (isUser) {
      const userResponse = await $graphql(
        `
      query getUserInfo($username: String!){
        public{
          user(username: $username){
            username
            nickname
            email
            createdAt
          }
        }
      }
    `,
        {
          username: user
        }
      );

      // 获取项目列表
      const { data: publicRepositories, meta } = await getRepositories({
        page: isNaN(+page) ? 0 : +page,
        limit: isNaN(+limit) ? 10 : +limit
      })($graphql);

      const userInfo = get(userResponse, ["data", "public", "user"]);

      return { userInfo, publicRepositories, meta, isUser };
    } else {
      // 如果是组织的话

      // 获取组织详情
      const orgResponse = await $graphql(
        `
      query getPublicOrg($name: String!){
        public{
          organization(name: $name){
            name
            createdAt
            updatedAt
          }
        }
      }
      `,
        {
          name: user
        }
      );

      const organization = get(orgResponse, ["data", "public", "organization"]);

      return { isOrganization: true, organization };
    }
  },
  data() {
    return {
      isUser: false,
      isOrganization: false,
      userInfo: {},
      publicRepositories: [],
      meta: {
        limit: 10,
        page: 0
      },
      form: {
        name: "",
        type: ""
      },
      orgMenus: [
        {
          name: "index",
          path: "",
          title: "项目"
        },
        {
          name: "people",
          path: "/people",
          title: "成员"
        }
      ]
    };
  },
  methods: {
    search() {
      console.log(`搜索...`);
    },
    async changePage(page) {
      try {
        const { data: publicRepositories, meta } = await getRepositories({
          page: page - 1,
          limit: this.meta.limit
        })(this.$graphql);
        this.publicRepositories = publicRepositories;
        this.meta = meta;
        this.$router.push({
          query: { ...this.$route.query, page: this.meta.page }
        });
      } catch (err) {
        this.$error(err.message);
      }
    }
  }
};
</script>

