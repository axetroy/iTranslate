<template>
  <div id="org-people">
    <div class="search-bar">
      <el-input v-model="searchForm.keyword" placeholder="搜索" style="width: 20rem"></el-input>
      <div class="pull-right">
        <el-button type="success" @click="inviteDialogVisible = true">邀请</el-button>
      </div>
    </div>
    <panel>
      <div slot="header" class="panel-title">
        <el-checkbox v-model="selectAll">全选</el-checkbox>
      </div>
      <el-table :data="data" style="width: 100%" :show-header="false">
        <el-table-column>
          <template slot-scope="scope">
            <div class="logo">
              <img class="avatar" src="https://secure.gravatar.com/avatar/c1234b1cdbb60fc6d988bb97f41c562d?s=290" alt="">
            </div>
            <div class="name">
              <p>
                <nuxt-link :to="'/' + scope.row.user.username">{{scope.row.user.username}}</nuxt-link>
              </p>
              <p>{{scope.row.user.nickname}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            {{scope.row.role | firstUpperCase}}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>移除组织</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

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

      <el-dialog class="invite-dialog" title="邀请成员加入组织" :visible.sync="inviteDialogVisible" center>
        <invite :org="owner" @success="onInviteSuccess()"/>
      </el-dialog>
    </panel>
  </div>
</template>

<style lang="scss">
#org-people{
  .search-bar{
    overflow: hidden;
    margin-bottom: 1rem;
  }
  .logo {
    font-size: 1.6rem;
    margin-right: 1rem;
    display: inline-block;
    vertical-align: middle;
    img {
      width: 5rem;
      height: 5rem;
    }
  }
  .name{
    display: inline-block;
    vertical-align: middle;
  }
}

.invite-dialog {
  .el-dialog {
    width: 42rem !important;
  }
}
</style>


<script>
import { get } from 'lodash'
import InviteUser2OrgDialog from '~/components/InviteUser2OrgDialog'
/**
 * 获取组织的成员列表
 */
function getOrgMembers(orgName, _meta) {
  return async function(graphql) {
    const res = await graphql(
      `
        query publicOrgMembers($name: String!, $query: FormQuery!) {
          public {
            organizationMembers(name: $name, query: $query) {
              data {
                id
                user {
                  username
                  nickname
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
        name: orgName,
        query: {
          limit: _meta.limit,
          page: _meta.page
        }
      }
    );

    const orgMembers = get(res, ["data", "public", "organizationMembers"]);

    const data = get(orgMembers, ["data"]);
    const meta = get(orgMembers, ["meta"]);

    return { data, meta };
  };
}

export default {
  props: ['owner'],
  components: {
    'invite': InviteUser2OrgDialog
  },
  data () {
    return {
      data: [],
      meta: {
        limit: 10,
        page: 0
      },
      selectAll: true,
      searchForm: {
        keyword: ''
      },
      inviteDialogVisible: false
    }
  },
  methods: {
    async changePage(page) {
      try {
        await this.getOrgMembers(this.meta.page + 1)
        this.$router.push({
          query: { ...this.$route.query, page: this.meta.page }
        });
      } catch (err) {
        this.$error(err.message);
      }
    },
    async getOrgMembers (page) {
      const _meta = { ...this.meta }
      if (typeof page === 'number') {
        _meta.page = page
      }
      const { data, meta } = await getOrgMembers(this.owner.name, _meta)(this.$graphql);
      console.log(data, meta)
      this.data = data
      this.meta = meta
    },
    onInviteSuccess () {
      this.inviteDialogVisible = false
    }
  },
  mounted () {
    this.getOrgMembers()
  }
}
</script>
