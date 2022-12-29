import CountTo from "./index.vue";

const UILib = {
  install(Vue) {
    Vue.component("CountTo", CountTo);
  },
};

export default UILib;
