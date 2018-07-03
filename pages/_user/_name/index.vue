<template>
  <div class="container repo-index">
    <el-row>
      <el-col class="repo-info" :span="8">提交历史</el-col>
      <el-col class="repo-info" :span="8">代码分支</el-col>
      <el-col class="repo-info" :span="8">版本发布</el-col>
    </el-row>

    <el-button type="primary" @click="dialogVisible=!dialogVisible">添加</el-button>

    <el-dialog
      title="添加新字段"
      min-width="300px"
      :visible.sync="dialogVisible">
      <div>
        <el-form :model="createForm" label-width="100px">
          <el-form-item label="Key" prop="key" required>
            <el-input v-model="createForm.key"/>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="createForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="翻译">
            <div v-for="v in repo.languages" :key="v" class="create-table">
              <el-input v-model="createForm.value[v]">
                <template slot="prepend">{{v}}</template>
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createNewOne()">创 建</el-button>
      </span>
    </el-dialog>

    <el-table stripe :data="rows">
      <el-table-column prop="code" label="代号" width="100px"/>
      <el-table-column prop="key" label="Key" width="100px"/>
      <el-table-column label="最近更新" width="180px">
        <template slot-scope="scope">
          {{scope.row.updatedAt | date}}
        </template>
      </el-table-column>
      <el-table-column label="描述" width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.id && editingDescId===scope.row.id">
            <el-input size="small" class="editor"
              :autofocus="true"
              v-model="editingDesc"
              type="text"
              @keyup.enter.native="updateDesc(scope.row.id, editingDesc)"
              @blur="cancelEditDesc"/>
          </span>
          <span v-else>
            <i class="el-icon-edit" @click="editDesc(scope.row.id, scope.row.description)"/>
            {{scope.row.description}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="翻译" width="300px">
        <template slot-scope="scope">
          <div v-for="lang in repo.languages" :key="lang">
            <strong class="lang">{{lang}}: </strong>
            <span v-if="editing !== scope.row.id + '.' + lang">
              <i class="el-icon-edit" @click="editField(lang, scope.row.value[lang], scope.row.id)"/>
              {{scope.row.value[lang]}}
              </span>
            <span v-else>
              <el-input size="small" class="editor"
              :autofocus="true"
              v-model="editingValue" 
              type="text" 
              @keyup.enter.native="updateField(scope.row.key, scope.row.id, lang, editingValue)"
              @blur="cancelEditField"/>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="remove(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { get } from "lodash";
import moment from "moment";

async function getRows($graphql, repoId) {
  // 获取字段列表

  const rowsReponse = await $graphql(
    `
      query getRows($id: String!){
        me{
          rows(id: $id){
            data{
              id
              key
              code
              value
              description
              createdAt
              updatedAt
              isActive
            }
          }
        }
      }
    `,
    {
      id: repoId
    }
  );

  const rows = (get(rowsReponse, ["data", "me", "rows", "data"]) || []).map(
    v => {
      v.value = JSON.parse(v.value);
      return v;
    }
  );

  return rows;
}

export default {
  props: ["repo", "owner"],
  async asyncData({ $graphql, params, redirect }) {
    // TODO
    // 应该在这里渲染数据
    // 但是遗憾的是，这里获取不到父级的promise盏
  },
  data() {
    return {
      moment: moment,
      createForm: { value: {} },
      dialogVisible: false,
      // 正在编辑的语言
      editing: "",
      editingValue: "",
      currentLanguage: "",

      // 正在编辑的描述
      editingDescId: "",
      editingDesc: "",
      rows: []
    };
  },
  methods: {
    // 创建一行新的
    createNewOne() {
      const form = this.createForm;
      this.$graphql(
        `
      mutation createNewOnw($argv: CreateItemArgv){
        me{
          createRow(argv: $argv){
            id
          }
        }
      }
      `,
        {
          argv: {
            rid: this.repo.id,
            key: form.key,
            value: JSON.stringify(form.value)
          }
        }
      )
        .then(() => {
          this.$success(`创建成功`);
          this.createForm = { value: {} };
          this.dialogVisible = false;

          return getRows(this.$graphql, this.repo.id);
        })
        .then(rows => {
          this.rows = rows;
        })
        .catch(err => {
          this.$error(err.message);
        });
    },
    // 删除整行
    async remove(row, index) {
      // 如果没有ID的话
      if (!row.id) {
        this.rows.splice(index, 1);
        return;
      }

      try {
        const answer = await this.$confirm(`你确定要删除吗`);
        if (!answer) {
          return;
        }
      } catch (err) {
        return;
      }

      this.$graphql(
        `
      mutation remove($argv: UpdateRowArgv){
        me{
          updateRow(argv: $argv){
            id
            isActive
          }
        }
      }
      `,
        {
          argv: {
            id: row.id,
            isActive: false
          }
        }
      )
        .then(() => {
          this.$success(`删除成功`);
          return getRows(this.$graphql, this.repo.id);
        })
        .then(rows => {
          this.rows = rows;
        })
        .catch(err => {
          this.$error(err.message);
        });
    },
    // 编辑描述
    editDesc(id, desc) {
      this.editingDescId = id;
      this.editingDesc = desc;
    },
    // 更新描述
    async updateDesc(id, description) {
      try {
        await this.$graphql(
          `
        mutation updateItem($argv: UpdateRowArgv){
          me{
            updateRow(argv: $argv){
              id
              description
            }
          }
        }
      `,
          {
            argv: {
              id,
              description
            }
          }
        );
        this.$success(`更新成功`);
        const row = this.rows.find(v => v.id === id);
        row.description = description;
        this.cancelEditDesc();
      } catch (err) {
        this.$error(err.message);
      }
    },
    // 编辑对应的语言信息
    editField(lang, value, id) {
      this.editing = id + "." + lang;
      this.editingValue = value;
    },
    // 更新翻译字段
    async updateField(key, id, lang, value) {
      try {
        await this.$graphql(
          `
        mutation ($id: ID!, $key: String!, $language: String!, $value: String!){
          me{
            updateItem(rid: $id, key: $key, language: $language, value: $value)
          }
        }
      `,
          {
            id,
            key,
            language: lang,
            value
          }
        );

        this.$success(`更新成功`);
        const row = this.rows.find(v => v.id === id);
        row.value[lang] = value;
        this.cancelEditField();
      } catch (err) {
        this.$error(err.message);
      }
    },
    // 撤销编辑翻译
    cancelEditField() {
      this.editingValue = "";
      this.editing = "";
    },
    cancelEditDesc() {
      this.editingDescId = "";
      this.editingDesc = "";
    }
  },
  async mounted() {
    const rows = await getRows(this.$graphql, this.repo.id);
    this.rows = rows;
  }
};
</script>

<style lang="less">
.repo-index {
  .el-dialog {
    min-width: 46rem;
  }
}
</style>


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
    color: #333333;
  }
}

.repo-info {
  text-align: center;
}

.lang {
  width: 6rem;
  display: inline-block;
  text-align: right;
}
</style>

