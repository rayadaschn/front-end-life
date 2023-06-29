import { navbar } from 'vuepress-theme-hope'

export const Navbar = navbar([
  '/',
  {
    text: 'JS/Node',
    icon: 'nodeJS',
    prefix: 'JavaScript/',
    link: '/JavaScript/',
  },
  {
    text: '框架类',
    icon: 'react',
    prefix: 'Framework/',
    link: '/Framework/', // 此处link 要相对目录
  },
  {
    text: '运维环境',
    icon: 'note',
    prefix: 'SystemRequirements/',
    link: '/SystemRequirements/',
  },
  {
    text: 'CSS',
    icon: 'style',
    prefix: 'CSS/',
    link: '/CSS/', // 此处link 要相对目录
  },
  {
    text: '不止代码',
    icon: 'anonymous',
    prefix: 'OneMoreThing/',
    link: '/OneMoreThing/',
  },
])
