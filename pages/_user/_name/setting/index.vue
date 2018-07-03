<template>
  <div class="setting-basic">
    <div class="pannel">
      <div class="pannel-header">
        <p class="pannel-title">基本设置</p>
      </div>
      <div class="pannel-content">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="仓库名称" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="仓库描述" required>
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="支持的语言" required>
            <el-transfer :titles="['可选语言', '当前语言']" v-model="form.languages" :data="spportLanguages"></el-transfer>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update">更新设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="pannel danger">
      <div class="pannel-header">
        <p class="pannel-title">危险操作区</p>
      </div>
      <div class="pannel-content">
        <div class="danger-content">
          <div class="danger-content-left">
            <h5>清除Wiki数据</h5>
            <p>清除 Wiki 数据操作不可逆转，请三思而后行。</p>
          </div>
          <div class="danger-content-right">
            <el-button type="danger" plain>清除Wiki数据</el-button>
          </div>
        </div>
        <div class="danger-content">
          <div class="danger-content-left">
            <h5>转移仓库所有权</h5>
            <p>您可以将仓库转移至您拥有管理员权限的帐户或组织。</p>
          </div>
          <div class="danger-content-right">
            <el-button type="danger" plain>转移仓库所有权</el-button>
          </div>
        </div>
        <div class="danger-content">
          <div class="danger-content-left">
            <h5>删除本仓库</h5>
            <p>删除仓库操作不可逆转，请三思而后行。</p>
          </div>
          <div class="danger-content-right">
            <el-button type="danger" plain>删除本仓库</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  props: ["repo"],
  async asyncData({ $graphql }) {
    // 获取语言列表
    const languagesResponse = await $graphql(`
      query getLanguage{
        public{
          languages
        }
      }
    `);

    const languages = get(languagesResponse, ["data", "public", "languages"]);
    return {
      spportLanguages: languages.map(v => {
        return {
          key: v,
          label: "语言 " + v
        };
      })
    };
  },
  data() {
    return {
      spportLanguages: [],
      form: {
        name: this.repo.name,
        description: this.repo.description,
        languages: this.repo.languages
      }
    };
  },
  methods: {
    async update() {
      const form = this.form;
      try {
        const res = await this.$graphql(
          `
        mutation updateRepo($argv: UpdateRepositoryArgv){
          me{
            updateRepository(argv: $argv){
              id
              name
              owner{
                username
              }
              description
              languages
            }
          }
        }
      `,
          {
            argv: {
              id: this.repo.id,
              name: form.name,
              description: form.description,
              languages: form.languages
            }
          }
        );
        const repo = get(res, ["data", "me", "updateRepository"]);
        this.$success(`更新成功`);
      } catch (err) {
        this.$error(err.message);
      }
    }
  }
};
</script>

<style lang="less">
.setting-basic {
  .el-checkbox-group {
    > label {
      margin-left: 30px;
    }
  }
}
</style>


<style lang="less" scoped>
.pannel {
  padding: 2rem;
  border: 1px solid #e5e5e5;
  margin-bottom: 3rem;
  &.danger {
    border: 1px solid #f0c36d;
    .pannel-header {
      background-color: #f9edbe;
    }
    .danger-content {
      overflow: hidden;
      margin: 2rem 0;
    }
    .danger-content-left {
      float: left;
    }
    .danger-content-right {
      float: right;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
  .pannel-header {
    background-color: #f0f0f0;
    margin: -2rem -2rem 2rem -2rem;
    .pannel-title {
      padding-left: 2rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
      font-size: 1.5rem;
      color: #000;
    }
  }
}
</style>

