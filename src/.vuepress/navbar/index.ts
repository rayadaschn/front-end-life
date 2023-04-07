import { navbar } from "vuepress-theme-hope";

export const Navbar = navbar([
  "/",
  {
    icon: "javascript",
    text: "JavaScript",
    prefix: "JavaScript/",
    link: "/JavaScript/",
  },
  {
    icon: "react",
    text: "框架类",
    prefix: "Framework/",
    link: "/Framework/", // 此处link 要相对目录
  },
  {
    text: "Mac/Linux配置",
    icon: "note",
    prefix: "SystemRequirements/",
    link: "/SystemRequirements/",
  },
  {
    icon: "style",
    text: "CSS",
    prefix: "CSS/",
    link: "/CSS/", // 此处link 要相对目录
  },
  {
    text: "不止Coder",
    icon: "anonymous",
    prefix: "OneMoreThing/",
    link: "/OneMoreThing/",
  },
]);
