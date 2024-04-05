import { hopeTheme } from 'vuepress-theme-hope'
import { Navbar } from './navbar/index.js'

export default hopeTheme({
  author: {
    name: 'Huy',
    url: 'https://github.com/rayadaschn',
  },

  iconAssets: 'iconfont',
  logo: 'logo.png',

  sidebar: 'structure', // 自动生成侧边栏

  // 项目仓库地址
  repo: 'https://github.com/rayadaschn',
  docsDir: 'docs/', // 文档所属文件夹，默认为仓库根目录

  //页面元数据：贡献者，最后修改时间，编辑链接
  contributors: false,
  lastUpdated: true,
  editLink: true,

  // 主题颜色
  themeColor: {
    blue: '#2196f3',
    red: '#f26d6d',
    green: '#3eaf7c',
    orange: '#fb9b5f',
  },
  darkmode: 'toggle', // 主题模式手动切换
  fullscreen: true,

  blog: {
    intro: '/intro.html',
    medias: {
      GitHub: 'https://github.com/rayadaschn',
    },
  },

  editLinkPattern:
    'https://github.com/rayadaschn/front-end-life/tree/sourcecode/:path',

  locales: {
    '/': {
      navbar: Navbar,
      navbarAutoHide: 'mobile',

      footer:
        '本站原创内容基于 <a class="underline" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> 共享, 转载请注明出处。',

      displayFooter: true,

      blog: {
        description: '功不唐捐 日拱一卒',
      },

      metaLocales: {
        editLink: '帮助博主改进此页面ヾ(=･ω･=)o',
      },
    },
  },

  encrypt: {
    global: true,
    config: {
      '/OneMoreThing/encrypt/': ['onlyme'],
    },
  },

  plugins: {
    blog: true,

    //评论配置
    comment: {
      // Giscus 备用配置
      provider: 'Giscus',
      repo: 'rayadaschn/front-end-life',
      repoId: 'R_kgDOI6dLbA',
      category: 'Announcements',
      categoryId: 'DIC_kwDOI6dLbM4CWVPS',
    },

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
        presets: ['ts', 'vue'],
      },
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
      },
      stylize: [
        {
          matcher: 'Recommended',
          replacer: ({ tag }) => {
            if (tag === 'em')
              return {
                tag: 'Badge',
                attrs: { type: 'tip' },
                content: 'Recommended',
              }
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
})
