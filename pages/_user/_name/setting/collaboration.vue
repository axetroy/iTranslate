<template>
  <div>
    <!-- 如果是组织的项目，则显示 -->
    <panel title="默认仓库权限">
      <p>团队的默认权限为只读，团队每一个成员都有读权限.</p>
      <p>您可以在此组织的成员权限页面上更改或删除默认存储库权限设置。</p>
    </panel>

    <!-- 如果是组织的项目，则显示 -->
    <panel title="团队">
      <p>现在还没有任何团队有权限访问这个项目，请在下方添加。</p>
    </panel>

    <!-- 总是显示 -->
    <panel title="合作者">
      <div class="collaboration-list">
        <el-row v-for="v in collaborators" :key="v.id" class="collaboration-item">
          <el-col :span="6">
            <nuxt-link :to="'/' + v.user.username" class="collaboration-name">{{v.user.username}}</nuxt-link>
          </el-col>
          <el-col :span="14">
            <el-select v-model="v.role" placeholder="请选择" style="width:100px" @change="changeRole(v.user.uid, v.role)">
              <el-option
                v-for="role in roles" :key="role.value"
                :label="role.label"
                :disabled="v.user.uid === repo.owner"
                :value="role.value">
              </el-option>
            </el-select>
            <span v-for="role in roles" :key="role.value" v-if="role.value===v.role" class="role-desc">
              {{role.description}}
            </span>
            </el-col>
          <el-col :span="4"><span class="el-icon-remove collaboration-remove" @click="removeRole(v.user.uid)"></span></el-col>
        </el-row>
      </div>

      <div class="collaboration-add">
        <div class="collaboration-add-meta">
          你可以输入用户名来搜索用户，或者输入邮箱匹配
        </div>
        <el-form ref="collaboration" :model="collaboration" :inline="true">
          <el-form-item required style="width:100%">
            <el-row>
              <el-col :span="20">
                <el-autocomplete
                  v-model="collaboration.username"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请搜索用户名"
                  style="width:100%"
                />
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="addCollaboration">添加协作者</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </panel>
  </div>
</template>

<script>
import { get } from "lodash";

function getMembers(owner, name) {
  return async function(graphql) {
    const res = await graphql(
      `
        query Members($owner: String!, $name: String!, $query: FormQuery!) {
          public {
            collaborators(owner: $owner, name: $name, query: $query) {
              data {
                id
                user {
                  uid
                  username
                }
                role
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
        owner,
        name,
        query: {
          limit: 100,
          sort: ["+createdAt"]
        }
      }
    );
    return get(res, ["data", "public", "collaborators", "data"]) || [];
  };
}

export default {
  props: ["repo"],
  data() {
    return {
      collaboration: {},
      restaurants: [],
      state4: "",
      timeout: null,
      collaborators: [],
      // 项目成员的角色
      roles: [
        {
          label: "游客",
          value: "visitor",
          description: "游客只有读取权限"
        },
        {
          label: "贡献者",
          value: "user",
          description: "拥有读写权限"
        },
        {
          label: "管理员",
          value: "admin",
          description: "拥有读写权限和项目设置, 不包括删除/转让项目"
        },
        {
          label: "拥有者",
          value: "owner",
          description: "拥有对项目的所有权限"
        }
      ]
    };
  },
  async asyncData({ $graphql, params }) {
    const collaborators = await getMembers(params.user, params.name)($graphql);
    return { collaborators };
  },
  methods: {
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
    // 添加协作者
    addCollaboration() {
      const collaboration = this.collaboration;
      const repo = this.repo;
      this.$graphql(
        `
        mutation addCollaborator($username: String!, $repoId: String!){
          me{
            addCollaborator(username: $username, repoId: $repoId){
              user{
                username
                uid
              }
            }
          }
        }
      `,
        {
          username: collaboration.username,
          repoId: repo.id
        }
      )
        .then(() => {
          this.collaboration.username = "";
          return getMembers(this.repo.owner.username, this.repo.name)(
            this.$graphql
          );
        })
        .then(collaborators => {
          this.collaborators = collaborators;
        })
        .catch(err => {
          this.$error(err.message);
        });
    },
    // 更改角色
    changeRole(uid, role) {
      this.$graphql(
        `
      mutation changeRole($uid: ID!, $repoId: ID!, $role: String!){
        me{
          updateCollaboratorRole(uid: $uid, repoId: $repoId, role: $role){
            id
          }
        }
      }
      `,
        {
          uid,
          repoId: this.repo.id,
          role
        }
      )
        .then(() => {
          this.$success(`变更成功`);
        })
        .catch(err => {
          this.$error(err.message);
        });
    },
    // 删除角色
    removeRole(uid) {
      this.$graphql(
        `
      mutation removeCollaborator($uid: ID!, $repoId: ID!){
        me{
          removeCollaborator(uid: $uid, repoId: $repoId){
            id
          }
        }
      }
      `,
        {
          uid,
          repoId: this.repo.id
        }
      )
        .then(() => {
          return getMembers(this.repo.owner.username, this.repo.name)(
            this.$graphql
          );
        })
        .then(collaborators => {
          this.collaborators = collaborators;
        })
        .catch(err => {
          this.$error(err.message);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.collaboration-list {
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e5e5;
}

.collaboration-add {
  padding-top: 2rem;
}

.collaboration-add-meta {
  padding-bottom: 2rem;
  font-weight: 600;
  color: #586069;
}

.collaboration-item {
  margin: 1rem 0;
  padding: 1rem 0.5rem;
  line-height: 6rem;
  &:hover {
    background-color: #f0f0f0;
  }
}

.collaboration-remove {
  color: #303030;
  font-size: 2rem;
  cursor: pointer;
}

.collaboration-name {
  color: #303030;
}

.role-desc {
  font-size: 1.2rem;
  color: #909090;
}
</style>

