<template>
  <div>
    issue
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  async asyncData({ $graphql, params, redirect }) {
    // console.log(`params`, params);
    // if (!params.name) {
    //   return redirect("/404");
    // }
    // const data = await $graphql(
    //   `
    //   query detail($name: String!){
    //     me {
    //       repository(name: $name) {
    //         id
    //         name
    //         owner{
    //           username
    //         }
    //         description
    //         languages
    //       }
    //     }
    //   }
    // `,
    //   { name: params.name }
    // );
    // const repo = get(data, ["data", "me", "repository"]);
    // if (!repo) {
    //   return redirect("/404");
    // }
    // return {
    //   repo
    // };
  },
  data() {
    return {
      form: {}
    };
  },
  methods: {}
};
</script>

<style lang="less">
.editor {
  display: inline;
  input {
    width: auto !important;
  }
}

.create-table {
  margin: 1rem 0;
}
</style>

<style lang="less" scoped>
.owner,
.repo {
  font-size: 3rem;
  text-decoration: none;
}

.container {
  width: 98rem;
  margin: 0 auto;
}

.meta {
  margin: 1rem 0;
  .desc {
    // margin: 1rem 0;
    color: #333333;
  }
}

.repo-info {
  text-align: center;
}
</style>

