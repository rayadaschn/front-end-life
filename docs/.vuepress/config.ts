import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";

import theme from "./theme.js";
import { path } from "@vuepress/utils";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import vue from "@vitejs/plugin-vue";

export default defineUserConfig({
  base: "/front-end-life/", // github
  // base: "/", // 自定义 nginx

  locales: {
    "/": {
      lang: "zh-CN", // 网站语言，默认为中文
      title: "Huy's Blog", // 网站标题
      description: "A blogfront-end blog", // 网站描述
    },
  },

  theme,
  //修改页面模板，@vuepress-theme-hope/templates/index.build.html
  templateBuild: path.resolve(__dirname, "templateBuild.html"),

  // 配置插件
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),
  ],

  shouldPrefetch: true, // 预拉取

  // 打包优化
  bundler: viteBundler({
    viteOptions: {
      plugins: [],
    },
    vuePluginOptions: {
      template: {
        compilerOptions: {
          whitespace: "condense",
          optimizeImports: true,
        },
      },
    },
  }),
});
