import { hopeTheme } from "vuepress-theme-hope";
import { Navbar } from "./navbar/index.js";

export default hopeTheme({
  author: {
    name: "Huy",
    url: "https://github.com/rayadaschn",
  },

  iconAssets: "iconfont",

  logo: "logo.png",
  sidebar: "structure", // 自动生成侧边栏

  // 项目仓库地址
  repo: "https://github.com/rayadaschn",

  docsDir: "src", // 文档所属文件夹，默认为仓库根目录
  darkmode: "toggle",

  contributors: false,

  blog: {
    medias: {
      GitHub: "https://github.com/rayadaschn",
    },
  },

  editLinkPattern:
    "https://github.com/rayadaschn/front-end-life/tree/sourcecode/:path",

  locales: {
    "/": {
      navbar: Navbar,
      navbarAutoHide: "mobile",

      footer: "MIT Licensed | Copyright",

      displayFooter: true,

      blog: {
        description: "自先沉稳 而后爱人",
      },

      metaLocales: {
        editLink: "帮助博主改进此页面ヾ(=･ω･=)o",
      },
    },
  },

  encrypt: {
    global: true,
  },

  plugins: {
    blog: true,

    // Disable features you don’t want here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },
  },
});
