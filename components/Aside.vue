<template>
  <ul class="aside">
    <h3 class="aside-title">{{title}}</h3>
    <li class="aside-item" v-for="menu in menus" :key="menu.name" :index=" menu.path">
      <nuxt-link :to="(menu.prefix || '') + menu.path">{{menu.title}}</nuxt-link>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.aside {
  margin-bottom: 15px;
  list-style: none;
  background-color: #fff;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  .aside-title {
    display: block;
    padding: 8px 10px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
    color: #586069;
    background-color: #f3f5f8;
    border-bottom: 1px solid #e1e4e8;
  }
  .aside-item {
    font-weight: 600;
    color: #24292e;
    cursor: default;
    background-color: #fff;
    position: relative;
    display: block;
    padding: 8px 10px;
    border-bottom: 1px solid #e1e4e8;
    font-size: 14px;
    line-height: 1.5;
    a {
      color: #0366d6;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>


<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    menus: {
      type: Array,
      default: [],
      required: false
    }
  }
};
</script>


