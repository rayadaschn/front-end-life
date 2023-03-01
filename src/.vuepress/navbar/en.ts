import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  {
    icon: "javascript",
    text: "JavaScript",
    prefix: "JavaScript/",
    link: "/JavaScript/",
  },
  {
    icon: "style",
    text: "CSS",
    prefix: "CSS/",
    link: "/CSS/", // 此处link 要相对目录
  },
  {
    icon: "vue",
    text: "框架类",
    prefix: "框架类/",
    link: "/框架类/", // 此处link 要相对目录
  },
  {
    text: "Mac/Linux配置",
    icon: "note",
    prefix: "Mac&Linux配置/",
    link: "/Mac&Linux配置/",
  },

  //  { text: "Demo", icon: "discover", link: "/demo/" },
  // {
  //   text: "Posts",
  //   icon: "edit",
  //   prefix: "/posts/",
  //   children: [
  //     {
  //       text: "Apple",
  //       icon: "edit",
  //       prefix: "apple/",
  //       children: [
  //         { text: "Apple1", icon: "edit", link: "1" },
  //         { text: "Apple2", icon: "edit", link: "2" },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     {
  //       text: "Banana",
  //       icon: "edit",
  //       prefix: "banana/",
  //       children: [
  //         {
  //           text: "Banana 1",
  //           icon: "edit",
  //           link: "1",
  //         },
  //         {
  //           text: "Banana 2",
  //           icon: "edit",
  //           link: "2",
  //         },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     { text: "Cherry", icon: "edit", link: "cherry" },
  //     { text: "Dragon Fruit", icon: "edit", link: "dragonfruit" },
  //     "tomato",
  //     "strawberry",
  //   ],
  // },
  // {
  //   text: "V2 Docs",
  //   icon: "note",
  //   link: "https://theme-hope.vuejs.vuepress/",
  // },
]);
