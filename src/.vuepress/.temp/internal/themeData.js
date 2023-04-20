export const themeData = JSON.parse("{\"encrypt\":{\"config\":{\"/demo/encrypt.html\":[\"$2a$10$EG.M6/JtDruliikfOF6Y1.ghZgwdDtlsjHkF4HRyKqRsso9R1wvaq\"],\"/zh/demo/encrypt.html\":[\"$2a$10$JH7zZS4JPtzDxJv67toOK.Zqs4NO.F8ui1.zklYDfZhYT58GsNqRu\"]}},\"darkmode\":\"auto\",\"blog\":{\"medias\":{\"GitHub\":\"https://github.com/rayadaschn\"}},\"locales\":{\"/\":{\"lang\":\"zh-CN\",\"navbarLocales\":{\"langName\":\"简体中文\",\"selectLangAriaLabel\":\"选择语言\"},\"metaLocales\":{\"author\":\"作者\",\"date\":\"写作日期\",\"origin\":\"原创\",\"views\":\"访问量\",\"category\":\"分类\",\"tag\":\"标签\",\"readingTime\":\"阅读时间\",\"words\":\"字数\",\"toc\":\"此页内容\",\"prev\":\"上一页\",\"next\":\"下一页\",\"lastUpdated\":\"上次编辑于\",\"contributors\":\"贡献者\",\"editLink\":\"Edit this page on GitHub\"},\"blogLocales\":{\"article\":\"文章\",\"articleList\":\"文章列表\",\"category\":\"分类\",\"tag\":\"标签\",\"timeline\":\"时间轴\",\"timelineTitle\":\"昨日不在\",\"all\":\"全部\",\"intro\":\"个人介绍\",\"star\":\"收藏\"},\"paginationLocales\":{\"prev\":\"上一页\",\"next\":\"下一页\",\"navigate\":\"跳转到\",\"action\":\"前往\",\"errorText\":\"请输入 1 到 $page 之前的页码！\"},\"outlookLocales\":{\"themeColor\":\"主题色\",\"darkmode\":\"外观\",\"fullscreen\":\"全屏\"},\"encryptLocales\":{\"iconLabel\":\"文章已加密\",\"placeholder\":\"输入密码\",\"remember\":\"记住密码\",\"errorHint\":\"请输入正确的密码\"},\"routeLocales\":{\"skipToContent\":\"跳至主要內容\",\"notFoundTitle\":\"页面不存在\",\"notFoundMsg\":[\"这里什么也没有\",\"我们是怎么来到这儿的？\",\"这 是 四 零 四 !\",\"看起来你访问了一个失效的链接\"],\"back\":\"返回上一页\",\"home\":\"带我回家\",\"openInNewWindow\":\"Open in new window\"},\"author\":{\"name\":\"Huy\",\"url\":\"https://github.com/rayadaschn\"},\"logo\":\"logo.png\",\"sidebar\":\"structure\",\"repo\":\"https://github.com/rayadaschn\",\"docsDir\":\"src\",\"editLinkPattern\":\"https://github.com/rayadaschn/front-end-life/tree/sourcecode/:path\",\"navbar\":[\"/\",{\"icon\":\"nodeJS\",\"text\":\"JS/Node\",\"prefix\":\"JavaScript/\",\"link\":\"/JavaScript/\"},{\"icon\":\"react\",\"text\":\"框架类\",\"prefix\":\"Framework/\",\"link\":\"/Framework/\"},{\"text\":\"Mac/Linux配置\",\"icon\":\"note\",\"prefix\":\"SystemRequirements/\",\"link\":\"/SystemRequirements/\"},{\"icon\":\"style\",\"text\":\"CSS\",\"prefix\":\"CSS/\",\"link\":\"/CSS/\"},{\"text\":\"不止Coder\",\"icon\":\"anonymous\",\"prefix\":\"OneMoreThing/\",\"link\":\"/OneMoreThing/\"}],\"navbarAutoHide\":\"mobile\",\"footer\":\"MIT Licensed | Copyright\",\"displayFooter\":true,\"blog\":{\"description\":\"自先沉稳 而后爱人\"}}}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
