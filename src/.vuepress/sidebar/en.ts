import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    {
      icon: "markdown",
      text: "JavaScript",
      prefix: "JavaScript/",
      link: "JavaScript/",
      children: "structure",
    },
    {
      icon: "discover",
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
      icon: "note",
      prefix: "Mac&Linux配置/",
      link: "/Mac&Linux配置/",
      children: "structure",
    },
    "优质博文",
  ],
});
