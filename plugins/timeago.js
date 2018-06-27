import Vue from "vue";
import moment from "moment";

Vue.filter("timeago", function(value, showAgo = true) {
  if (!value) return "";
  return moment(value).fromNow(showAgo);
});
