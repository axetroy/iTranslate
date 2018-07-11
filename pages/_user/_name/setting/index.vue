<template>
  <div class="setting-basic">
    <panel title="基本设置">
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
    </panel>
    
    <panel title="危险操作区" type="danger">
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
    </panel>
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
</style>

