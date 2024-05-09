const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath:
    process.env.NODE_ENV === "production"
      ? "https://www.coding61.com/html/allbooks/dist/"
      : "/",
  transpileDependencies: true,
  productionSourceMap: false, // 生产模式不打包map文件
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require("postcss-pxtorem")({
              // 把px单位换算成rem
              rootValue: 128,
              propList: ["*"],
            }),
          ],
        },
      },
    },
  },
  chainWebpack: (config) => {
    // 页面标题
    config.plugin("html").tap((args) => {
      args[0].title = "在线电子课本";
      return args;
    });
    // 处理console.log和debugger
    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress.drop_console = true;
      args[0].terserOptions.compress.drop_debugger = true;
      return args;
    });
  },
});
