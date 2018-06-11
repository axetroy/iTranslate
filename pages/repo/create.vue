<template>
  <div id="content">
    <div class="create-form">
      <el-form label-width="120px">
        <el-form-item>
          <h3>创建新的仓库</h3>
        </el-form-item>
        <el-form-item label="拥有者" required>
          <el-select v-model="form.owner" placeholder="请选择">
            <el-option
              v-for="item in owners"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="是否可见" required>
          <el-radio v-model="form.visible" :label="true">可见</el-radio>
          <el-radio v-model="form.visible" :label="false">不可见</el-radio>
          <div>我们建议开源你的翻译方案</div>
        </el-form-item>

        <el-form-item label="仓库名称" required>
          <el-input v-model="form.name"></el-input>
          <div>伟大的仓库名称一般都较短、令人深刻并且 独一无二 的。</div>
        </el-form-item>
        <el-form-item label="仓库描述" required>
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="README" required>
          <el-input type="textarea" :rows="6" v-model="form.readme"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { query } from "~/utils/graphql";
import { Message } from "element-ui";

export default {
  middleware: ["require-login"],
  data() {
    return {
      form: {
        owner: this.$store.state.user.username,
        visible: true
      },
      owners: [
        {
          label: "Axetroy",
          value: "Axetroy"
        }
      ]
    };
  },
  methods: {
    submit() {
      this.$graphql(
        `
        mutation createRepo($argv: CreateRepositoryArgv){
          me {
            createRepository(argv: $argv) {
              name
              description
              readme
              isPrivate
              createdAt
              updatedAt
            }
          }
        }
      `,
        {
          argv: {
            name: this.form.name,
            description: this.form.desc,
            readme: this.form.readme,
            isPrivate: !this.form.visible
          }
        }
      )
        .then(() => {
          Message.success(`创建成功.`);
        })
        .catch(err => {
          Message.error(err.message);
        });
    },
    cancel() {
      console.log(`取消...`);
    }
  }
};
</script>

<style scoped lang="scss">
$width: 990px;

#content {
  width: $width;
  margin: 0 auto;
}

.create-form {
  width: 52rem;
  margin: 0 auto;
}
</style>
