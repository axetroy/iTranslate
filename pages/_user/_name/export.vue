<template>
  <div>
    导出页面
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  async asyncData({ $graphql, params, redirect }) {
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

