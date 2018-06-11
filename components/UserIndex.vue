<template>
  <el-row :getter="0">
    <el-col :span="18">hello</el-col>
    <el-col :span="6">
      <el-tabs type="card">
        <el-tab-pane label="仓库">
          <el-card>
            <div slot="header">
              <span>我的仓库 <span class="badge">{{repoMeta.count || 0}}</span></span>
              <nuxt-link to="/repo/create">
                <el-button style="float: right; padding: 3px 0" type="text">+</el-button>
              </nuxt-link>
            </div>
            {{$store.state.user}}
            <div v-for="repo of repositories" :key="repo.id" class="repo">
              <nuxt-link :to="'/' + $store.state.user.username + '/' + repo.name">{{repo.name}}</nuxt-link>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="组织">
          <el-card>
            <div slot="header">
              <span>我的组织 <span class="badge">{{orgsMeta.count || 0}}</span></span>
              <nuxt-link to="/org/create">
                <el-button style="float: right; padding: 3px 0" type="text">+</el-button>
              </nuxt-link>
            </div>
            <div v-for="org of orgs" :key="org.id" class="repo">
              {{org.name}}
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import { get } from "lodash";

export default {
  data() {
    return {
      repositories: [],
      repoMeta: {},
      orgs: [],
      orgsMeta: {}
    };
  },
  methods: {
    async getRepositories() {
      const data = await this.$graphql(`
      query repo{
        public{
          repositories(query: {limit: 10}){
            data{
              name
              description
              isPrivate
              readme
            }
            meta{
              count
            }
          }
        }
      }
    `);
      const repositories = get(data, [
        "data",
        "public",
        "repositories",
        "data"
      ]);
      const meta = get(data, ["data", "public", "repositories", "meta"]);
      return { repositories, meta };
    },
    async getOrgs() {
      const data = await this.$graphql(`
      query repo{
        me{
          organizations(query: {limit: 10}){
            data{
              id
              name
              description
            }
            meta{
              count
            }
          }
        }
      }
    `);
      const organizations = get(data, [
        "data",
        "me",
        "organizations",
        "data"
      ]);
      const meta = get(data, ["data", "me", "organizations", "meta"]);
      return { organizations, meta };
    }
  },

  mounted() {
    this.getRepositories().then(({ repositories, meta }) => {
      for (const repository of repositories) {
        this.repositories.push(repository);
      }
      this.repoMeta = meta;
    });
    this.getOrgs().then(({ organizations, meta }) => {
      for (const organization of organizations) {
        this.orgs.push(organization);
      }
      this.orgsMeta = meta;
    });
  }
};
</script>


<style lang="less" scoped>
.repo {
  padding: 1rem 0.5rem;
  &:hover {
    background-color: #e5e5e5;
  }
}

.badge {
  padding: 4px 5px;
  margin-top: -4px;
  margin-left: 0.5rem;
  vertical-align: middle;
  background-color: #767676;
  border-color: #767676;
  color: #fff;
  border-radius: 0.5rem;
}
</style>
