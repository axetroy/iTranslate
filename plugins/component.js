import Vue from "vue";
import Panel from "~/components/Panel";
import Aside from "~/components/Aside";

loadComponent("panel", Panel);
loadComponent("aside-menu", Aside);

function loadComponent(name, component) {
  const install = function(Vue) {
    if (install.installed) return;
    install.installed = true;
    Vue.component(name, component);
  };

  Vue.use(install);
}
