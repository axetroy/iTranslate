<template>
  <div id="content">
    <div class="create-form">
      <el-form label-width="120px">
        <el-form-item>
          <h3>创建新的组织</h3>
        </el-form-item>
        <el-form-item label="组织名称" required>
          <el-input v-model="form.name"></el-input>
          <div>伟大的组织都有一个简短而寓意深刻的名字。</div>
        </el-form-item>
        <el-form-item label="组织描述" required>
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="组织主页" required>
          <el-input v-model="form.homepage"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { query } from "~/utils/graphql";

export default {
  middleware: ["require-login"],
  data() {
    return {
      form: {}
    };
  },
  methods: {
    submit() {
      // TODO: 表单检验
      const form = this.form;
      this.$graphql(
        `
        mutation createOrg($argv: CreateOrganizationArgv){
          me {
            createOrganization(argv: $argv) {
              id
              name
              description
              createdAt
              updatedAt
            }
          }
        }
      `,
        {
          argv: {
            name: form.name,
            description: form.desc
          }
        }
      )
        .then(() => {
          this.$success(`创建成功.`);
          this.$router.replace({ path: "/" + form.name });
        })
        .catch(err => {
          this.$error(err.message);
        });
    }
  }
};
</script>

<style scoped lang="scss">
$width: 99rem;

#content {
  width: $width;
  margin: 0 auto;
}

.create-form {
  width: 52rem;
  margin: 0 auto;
}
</style>
