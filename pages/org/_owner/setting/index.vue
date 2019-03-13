<template>
  <div class="org">
    <panel title="基本设置">
      <el-form ref="form" :model="basicForm" label-width="120px" label-position="top">
        <!-- <el-form-item label="组织头像">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false">
            <img v-if="basicForm.logo" :src="basicForm.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="组织显示名称">
          <el-input v-model="basicForm.name"></el-input>
        </el-form-item>
        <el-form-item label="组织描述">
          <el-input v-model="basicForm.description"></el-input>
        </el-form-item>
        <!-- <el-form-item label="组织邮箱">
          <el-input v-model="basicForm.email"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="basicForm.url"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="basicForm.location"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="update()">更新设置</el-button>
        </el-form-item>
      </el-form>
    </panel>

    <panel title="危险操作区" type="danger">
      <div class="danger-content">
        <div class="danger-content-left">
          <h5>转移组织所有权</h5>
          <p>可以将组织的所有权转义给某个账户</p>
        </div>
        <div class="danger-content-right">
          <el-button type="danger" plain>转移组织所有权</el-button>
        </div>
      </div>
      <div class="danger-content">
        <div class="danger-content-left">
          <h5>删除本组织</h5>
          <p>删除组织操作不可逆转，请三思而后行。</p>
        </div>
        <div class="danger-content-right">
          <el-button type="danger" plain>删除组织</el-button>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  props: ['owner'],
  data () {
    return {
      basicForm: {

      }
    }
  },
  methods: {
    async update () {
      const form = this.basicForm
      try {
        const res = await this.$graphql(`
          mutation updateOrgInfo ($argv: UpdateOrganizationArgv){
            me {
              updateOrganization (argv: $argv) {
                id
              }
            }
          }
        `, 
        {
          argv: {
            id: form.id,
            name: form.name,
            description: form.description
          }
        }
       )

       this.$success("更新成功")
      } catch (err) {
        this.$error(err.message)
      }
    }
  },
  watch: {
    owner (newOnwer, oldOwner) {
      console.log(newOwner)
    }
  },
  mounted () {
    this.basicForm = { ...this.owner }
  }
}
</script>

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