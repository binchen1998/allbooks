import * as components from "@element-plus/icons-vue";

export default {
  install: (app) => {
    for (const key in components) {
      const config = components[key];
      app.component(config.name, config);
    }
  },
};
