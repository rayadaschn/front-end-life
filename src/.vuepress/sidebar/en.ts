import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    {
      icon: "javascript",
      text: "JavaScript",
      prefix: "JavaScript/",
      link: "JavaScript/",
      children: "structure",
    },
    {
      icon: "style",
      text: "CSS",
      prefix: "CSS/",
      link: "CSS/",
      children: "structure",
    },
    {
      text: "小程序",
      icon: "note",
      prefix: "小程序/",
      children: "structure",
    },
    {
      text: "Mac/Linux配置",
      icon: "linux",
      prefix: "Mac&Linux配置/",
      link: "/Mac&Linux配置/",
      children: "structure",
    },
    {
      text: "优质博文",
      icon: "note",
      link: "/优质博文",
      // children: "structure",
    },
  ],
});
