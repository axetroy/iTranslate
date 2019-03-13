<template>
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
        <template slot="append">
        <div style="cursor: pointer;" @click="invitePeople(inviteDialogForm.username)">邀请</div>
        </template>
      </el-autocomplete>
    </el-form-item>
  </el-form>
</template>

<script>
import { get } from 'lodash'
export default {
  props: ['org'],
  data () {
    return {
      inviteDialogForm: {
        username: "",
        user: null
      },
      inviteFormRules: {
        username: [{ required: true, message: "请输入要添加的用户名" }]
      },
    }
  },
  methods: {
    // 搜索用户
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
              name: this.org.name,
              username: this.inviteDialogForm.username
            }
          )
            .then(() => {
              this.$success(`添加成功`);
              this.inviteDialogForm.username = "";
              this.$refs.inviteDialogForm.resetFields();

              // 触发成功事件
              this.$emit('success')
            })
            .catch(err => {
              this.$error(err.message);
              // 触发错误事件
              this.$emit('error')
            });
        }
      });
    },
  }
}
</script>

