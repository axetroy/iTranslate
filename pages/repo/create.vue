<template>
  <div id="content">
    <div class="create-form">
      <el-form label-width="120px">
        <el-form-item>
          <h3>创建新的仓库</h3>
        </el-form-item>
        <el-form-item label="拥有者" required>
          <el-select v-model="form.owner" placeholder="请选择">
            <el-option :value="me.uid" :label="me.username"/>
            <el-option
              v-for="v in organizations"
              :key="v.id"
              :label="v.name"
              :value="v.id">
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
        <el-form-item label="支持的语言" required>
          <el-checkbox-group v-model="form.languages">
            <el-checkbox v-for="v in spportLanguages" :key="v" :label="v"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="README" required>
          <el-input type="textarea" :rows="6" v-model="form.readme"></el-input>
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
import { get } from "lodash";

export default {
  middleware: ["require-login"],
  async asyncData({ $graphql }) {
    //获取服务器当前支持的语言
    const res = await $graphql(`
      query getLanguage{
        public{
          languages
        }
      }
    `);
    const languages = get(res, ["data", "public", "languages"]) || [];

    const orgsResponse = await $graphql(
      `
      query getOrgs($query: FormQuery!){
        me{
          organizations(query: $query){
            data{
              id
              name
              createdAt
              updatedAt
            }
          }
        }
      }
    `,
      {
        query: { limit: 100 }
      }
    );

    const organizations = get(orgsResponse, [
      "data",
      "me",
      "organizations",
      "data"
    ]);

    return {
      spportLanguages: languages,
      organizations
    };
  },
  data() {
    const me = this.me;
    console.log(me);
    return {
      spportLanguages: [],
      form: {
        owner: this.$store.state.user.uid,
        visible: true,
        languages: ["en-us", "zh-cn"]
      },
      owners: [
        {
          label: "Axetroy",
          value: "Axetroy"
        }
      ],
      organizations: []
    };
  },
  computed: {
    me: {
      get() {
        return this.$store.state.user;
      }
    }
  },
  methods: {
    submit() {
      // TODO: 表单验证
      const form = this.form;
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
            name: form.name,
            // 如果是为自己创建项目，则不用指定owner
            // 如果是为组织创建项目，则需要指定owner
            owner: form.owner === this.me.uid ? undefined : form.owner,
            description: form.desc,
            languages: form.languages,
            readme: form.readme,
            isPrivate: !form.visible
          }
        }
      )
        .then(() => {
          this.$success(`创建成功.`);
          const ownerName =
            form.owner === this.me.uid
              ? this.me.username
              : this.organizations.find(v => v.id === form.owner).name;
          this.$router.replace({
            path: `/${ownerName}/${form.name}`
          });
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
