import Vue from "vue";

Vue.filter("firstUpperCase", function(value) {
  if (!value) return ''
  value.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
});
