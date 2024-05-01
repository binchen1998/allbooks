const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false, // 生产模式不打包map文件
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require("postcss-pxtorem")({
              // 把px单位换算成rem
              rootValue: 128, // html默认字体大小16px
              propList: ["*"],
            }),
          ],
        },
      },
    },
  },
});
