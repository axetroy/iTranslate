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
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item>
            <el-button type="primary">更新设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>

