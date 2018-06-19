import Vue from "vue";
import moment from "moment";

Vue.filter("date", function(value, layout = "YYYY-MM-DD HH:mm:ss") {
  if (!value) return "";
  return moment(value).format(layout);
});
