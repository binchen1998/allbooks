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
    // 打包js
    config.module
      .rule('js')
      .use('babel-loader')
      .tap(options => {
        // 修改Babel的options
        return {
          ...options,
          presets: [
            ['@babel/preset-env', {
              targets: {
                browsers: [
                  // 指定你想要支持的浏览器版本
                  // 例如，为了支持到IE 11，可以使用：
                  'ie 11',
                  'last 2 versions',
                  '> 1%',
                  'not dead'
                ],
              },
              // 使用'usage'模式来按需引入polyfill
              useBuiltIns: 'usage',
              // 指定core-js版本
              corejs: 3,
            }],
          ],
        };
      });
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
