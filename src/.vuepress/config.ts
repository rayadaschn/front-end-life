import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  base: "/front-end-life/", // github
  // base: "/", // 自定义 nginx

  locales: {
    "/": {
      lang: "en-US",
      title: "Huy's Blog",
      description: "A blogfront-end blog",
    },
  },

  theme,
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

  shouldPrefetch: false,
});
