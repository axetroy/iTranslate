<template>
  <el-row>
    <el-col :span="4">
      <aside-menu title="组织设置" :menus="menus" />
    </el-col>
    <el-col :span="20">
      <div style="margin-left: 2rem;">
        <nuxt-child :owner="owner"/>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['owner'],
  data () {
    const route = this.$route;
    return {
      menus: [
        {
          name: "index",
          path: "",
          title: "基本设置"
        },
        {
          name: "hooks",
          path: "/hooks",
          title: "管理 Web 钩子"
        }
      ].map(v => {
        v.prefix = "/org/" + route.params.owner + "/setting";
        return v;
      }),
    }
  }
}
</script>

