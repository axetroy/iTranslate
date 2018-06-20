<template>
  <div>

    <!-- 如果是组织的项目，则显示 -->
    <div class="pannel">
      <div class="pannel-header">
        <p class="pannel-title">默认仓库权限</p>
      </div>
      <div class="pannel-content">
        <p>团队的默认权限为只读，团队每一个成员都有读权限.</p>
        <p>您可以在此组织的成员权限页面上更改或删除默认存储库权限设置。</p>
      </div>
    </div>

    <!-- 如果是组织的项目，则显示 -->
    <div class="pannel">
      <div class="pannel-header">
        <p class="pannel-title">团队</p>
      </div>
      <div class="pannel-content">
        <div>
         现在还没有任何团队有权限访问这个项目，请在下方添加。
        </div>
      </div>
    </div>

    <!-- 总是显示 -->
    <div class="pannel">
      <div class="pannel-header">
        <p class="pannel-title">合作者</p>
      </div>
      <div class="pannel-content">
        <el-form ref="collaboration" :model="collaboration" label-width="120px">
          <el-form-item label="用户名" required>
            <el-autocomplete
              v-model="collaboration.username"
              :fetch-suggestions="querySearchAsync"
              placeholder="请搜索用户名"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addCollaboration">添加协作者</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  data() {
    return {
      collaboration: {},
      restaurants: [],
      state4: "",
      timeout: null
    };
  },
  methods: {
    // 搜索
    querySearchAsync(queryString, cb) {
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
      this.$graphql(``);
    }
  }
};
</script>

<style lang="less" scoped>
</style>

