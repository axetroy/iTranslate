<template>
  <div id="content">
    <el-row :gutter="0">
      <el-col :span="6">
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
      <el-col :span="18">仓库列表</el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
$width: 990px;

#content {
  width: $width;
  margin: 0 auto;
}

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
</style>

<script>
import { get } from "lodash";

export default {
  async asyncData({ $graphql, params }) {
    const username = params.user;

    const res = await $graphql(
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
        username
      }
    );

    const userInfo = get(res, ["data", "public", "user"]);

    return { userInfo };
  },
  data() {
    return { userInfo: {} };
  }
};
</script>

