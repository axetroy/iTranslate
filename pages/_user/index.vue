<template>
  <div id="content">
    <el-row v-if="isUser" :gutter="0">
      <el-col :span="6" class="user-info">
        <div><img class="avatar" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d?s=290" alt=""></div>
        <div class="meta-block">
          <div class="name-block">
            <span class="username">{{owner.username}}</span>
            <span class="nickname">{{owner.nickname}}</span>
          </div>

          <div class="desc">
            Fool Stand Developer
          </div>

          <el-button class="edit-info">编辑</el-button>
        </div>
        <div class="meta-block">
          <ul>
            <li class="v-detail">{{owner.email}}</li>
            <li class="v-detail">http://axetroy.xyz</li>
            <li class="v-detail">加入于 {{owner.createdAt | date}}</li>
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
            <nuxt-link :to="'/' + owner.username + '/' + v.name">{{v.name}}</nuxt-link>
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
    <el-row class="org" v-else :gutter="0">
      <div class="org-header">
        <div class="logo">
          <img class="avatar" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d?s=290" alt="">
        </div>
        <div class="org-meta">
          <div>{{owner.name}}</div>
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
          <el-menu-item v-for="menu in orgMenus" :key="menu.name" :index="'/admin/dragonB' + menu.path">
            <nuxt-link :to="menu.prefix + '/' + owner.name + menu.path">{{menu.title}}</nuxt-link>
          </el-menu-item>
        </el-menu>
      </div>
      <el-col :span="18" class="content">
        <div v-for="v in publicRepositories" :key="v.id" class="repository">
          <div class="repository-item repository-info">
            <nuxt-link :to="'/' + owner.name + '/' + v.name">{{v.name}}</nuxt-link>
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
      <el-col :span="6">
        <div class="org-box">
          <div class="org-pannel">
            <div class="org-pannel-header"><h4>组织成员</h4></div>
            <div class="org-pannel-body">
              <div v-for="v in members" :key="v.id" class="org-pannel-member">
                <img class="member-logo" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d?s=290"/>
                <div class="member-meta">
                  <div class="member-name"><nuxt-link :to="'/' + v.user.username">{{v.user.username}}</nuxt-link></div>
                  <div class="member-nickname">{{v.user.nickname}}</div>
                </div>
              </div>
            </div>
            <div class="org-pannel-footer">
            <el-dialog class="invite-dialog" title="邀请成员加入组织" :visible.sync="inviteDialogVisible" center @close="onInviteDialogClose">
              <el-form :model="inviteDialogForm" ref="inviteDialogForm" :rules="inviteFormRules">
                <el-form-item prop="username" required>
                  <el-autocomplete
                    v-model="inviteDialogForm.username"
                    style="width: 100%"
                    value-key="value"
                    value="user"
                    :fetch-suggestions="querySearchAsync"
                    :trigger-on-focus="false"
                    @select="onSelectInvateUser"
                    placeholder="请输入用户名搜索用户"
                  >
                    <!-- <template slot="prepend">user</template> -->
                    <template slot="append">
                      <div style="cursor: pointer;" @click="invitePeople(inviteDialogForm.username)">邀请</div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-form>
            </el-dialog>
              <el-button size="small" @click="invite">邀请成员</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
$width: 99rem;
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
  .org-box {
    margin-top: 3rem;
  }
  .org-pannel {
    padding: 1.6rem;
    border: 1px solid #e1e4e8;
    h4 {
      color: #24292e;
      margin-bottom: 0.8rem;
      font-weight: 400;
    }
    .member-logo {
      float: left;
      width: 4rem;
      height: 4rem;
    }
    .member-meta {
      vertical-align: top;
      margin-left: 5rem;
      &::after {
        content: "";
        display: block;
        width: 0;
        height: 0;
        clear: both;
      }
      .member-nickname {
        font-size: 1.2rem;
        color: #586069;
      }
    }
    .org-pannel-footer {
      padding: 1rem;
      background-color: #f6f8fa;
      z-index: 999;
      margin: 1.6rem -1.6rem -1.6rem -1.6rem;
    }
    .org-pannel-member {
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>

<style lang="less">
.invite-dialog {
  .el-dialog {
    width: 42rem !important;
  }
}
</style>


<script>
import { get } from "lodash";

/**
 * 获取项目列表
 */
function getRepositories(meta) {
  return async function(graphql, owner) {
    const repositoriesResponse = await graphql(
      `
        query get($query: FormQuery!, $owner: String) {
          public {
            repositories(query: $query, owner: $owner) {
              data {
                id
                name
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
        },
        owner
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

/**
 * 获取组织的成员列表
 */
function getOrgMembers(orgName, meta) {
  return async function(graphql) {
    const res = await graphql(
      `
        query publicOrgMembers($name: String!) {
          public {
            organizationMembers(name: $name) {
              data {
                id
                user {
                  username
                  nickname
                }
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
      { name: orgName }
    );

    const orgMembers = get(res, ["data", "public", "organizationMembers"]);

    const data = get(orgMembers, ["data"]);
    const meta = get(orgMembers, ["meta"]);

    return { data, meta };
  };
}

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
  async asyncData({ $graphql, query, params }) {
    const { user: ownerName } = params;
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
      { username: ownerName }
    );

    const isUser = !!get(isUserResponse, ["data", "public", "isUser"]);
    let publicRepositories = [];
    let owner = null;
    let meta = null;
    let members = []; // 组织成员，当前是组织页面的时候才生效
    let memberMeta = null;

    if (isUser) {
      // 获取用户信息
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
        { username: ownerName }
      );

      owner = get(userResponse, ["data", "public", "user"]);
    } else {
      // 获取组织详情
      owner = await getOrgDetail(ownerName)($graphql);
      const { data, meta } = await getOrgMembers(ownerName)($graphql);

      members = data;
      memberMeta = meta;
    }

    // 获取项目列表
    const { data, meta: _meta } = await getRepositories({
      page: isNaN(+page) ? 0 : +page,
      limit: isNaN(+limit) ? 10 : +limit
    })($graphql, ownerName);

    publicRepositories = data;
    meta = _meta;

    return {
      owner,
      publicRepositories,
      meta,
      isUser,
      members,
      memberMeta
    };
  },
  data() {
    return {
      isUser: false,
      inviteDialogVisible: false,
      owner: null,
      publicRepositories: [],
      meta: {
        limit: 10,
        page: 0
      },
      form: {
        name: "",
        type: ""
      },
      inviteDialogForm: {
        username: "",
        user: null
      },
      inviteFormRules: {
        username: [{ required: true, message: "请输入要添加的用户名" }]
      },
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
      ],
      members: [],
      memberMeta: {
        limit: 10,
        page: 0
      }
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
        })(this.$graphql, this.$route.params.user);
        this.publicRepositories = publicRepositories;
        this.meta = meta;
        this.$router.push({
          query: { ...this.$route.query, page: this.meta.page }
        });
      } catch (err) {
        this.$error(err.message);
      }
    },
    // 邀请人加入组织
    async invite() {
      this.inviteDialogVisible = !this.inviteDialogVisible;
    },
    // 搜索
    querySearchAsync(queryString, cb) {
      if (!queryString) {
        return;
      }
      this.$graphql(
        `
        query search ($keyword: String!){
          me{
            searchUser(username: $keyword){
              data{
                username
                uid
              }
              meta{
                num
                count
                limit
                count
              }
            }
          }
        }
      `,
        {
          keyword: queryString
        }
      ).then(res => {
        const userList = get(res, ["data", "me", "searchUser", "data"]) || [];
        cb(
          userList.map(v => {
            return {
              value: v.username,
              user: v
            };
          })
        );
      });
    },
    // 当选中邀请的人之后
    onSelectInvateUser({ user }) {
      this.inviteDialogForm.user = user;
    },
    // 点击邀请
    invitePeople() {
      this.$refs.inviteDialogForm.validate(valid => {
        if (valid) {
          this.$graphql(
            `
        mutation invite($name: String!, $username: String!){
          me{
            addMember(name: $name, username: $username){
              id
            }
          }
        }
      `,
            {
              name: this.owner.name,
              username: this.inviteDialogForm.username
            }
          )
            .then(() => {
              this.$success(`添加成功`);
              this.inviteDialogForm.username = "";
              this.$refs.inviteDialogForm.resetFields();
              this.inviteDialogVisible = false;

              // 刷新组织详情
              getOrgDetail(this.owner.name)(this.$graphql).then(orgInfo => {
                this.owner = orgInfo;
              });

              // 刷新组织成员列表
              getOrgMembers(this.owner.name)(this.$graphql).then(
                ({ data, meta }) => {
                  this.members = data;
                  this.memberMeta = meta;
                }
              );
            })
            .catch(err => {
              this.$error(err.message);
            });
        }
      });
    },
    // 当窗口管理
    onInviteDialogClose() {
      this.inviteDialogForm.username = "";
      this.$refs.inviteDialogForm.resetFields();
    }
  }
};
</script>

