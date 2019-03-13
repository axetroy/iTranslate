<template>
  <ul class="aside">
    <h3 class="aside-title">{{title}}</h3>
    <li class="aside-item" v-for="menu in menus" :key="menu.name" :index=" menu.path">
      <nuxt-link :to="(menu.prefix || '') + menu.path">{{menu.title}}</nuxt-link>
    </li>
  </ul>
</template>

<style lang="scss" scoped>

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
      default () {
        return []
      },
      required: false
    }
  }
};
</script>


