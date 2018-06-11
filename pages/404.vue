<template>
  <div id="content">
    <div style="text-align:center">
      <img src="http://111.230.30.41/img/favicon.png" alt="">
      <h1>I18n</h1>
      <h2>一款极易搭建的 I18n 自助服务</h2>
    </div>
    <el-row :gutter="8">
      <el-col :span="12" class="feat-row">
        <h3><img src="/img/rocket.png">易安装</h3>
        <p>任何 NodeJS 环境都可以运行，支持多个版本. 还可以通过 Docker 一件安装</p>
      </el-col>
      <el-col :span="12" class="feat-row">
        <h3><img src="/img/computer.png">跨平台</h3>
        <p>任何 NodeJS 语言 支持的平台都可以运行, Windows、Mac、Linux 以及 ARM。</p>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="12" class="feat-row">
        <h3><img src="/img/rocket.png">轻量级</h3>
        <p>I18n 基于NodeJS开发，只占用了少量的内存, 一个小巧的树莓派都可以运行.</p>
      </el-col>
      <el-col :span="12" class="feat-row">
        <h3><img src="/img/github.png">开源化</h3>
        <p>全代码开源在Github上，你可以放心使用，甚至可以不经过我的同意，安装在你们公司内网中。</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AppLogo from "~/components/AppLogo.vue";

export default {
  components: {
    AppLogo
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
$width: 990px;

#content {
  width: $width;
  margin: 0 auto;
  .feat-row {
    padding: 2rem 4rem;
    margin: 2rem 0;
    text-align: center;
    img {
      width: 4rem;
      height: 4rem;
      line-height: 4rem;
      vertical-align: middle;
      margin-right: 0.5rem;
    }
    p {
      font-size: 1.6rem;
      line-height: 1.6rem;
      color: #303030;
      margin: 2rem 0;
      padding: 2rem 6rem;
      line-height: 3rem;
    }
  }
}
</style>
