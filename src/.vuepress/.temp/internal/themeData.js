export const themeData = JSON.parse("{\"encrypt\":{\"config\":{\"/demo/encrypt.html\":[\"$2a$10$MNCa9E50VeiY/CHdTiq0WeskgHPr3aTqjECcataUJtipmKz7A.vcm\"],\"/zh/demo/encrypt.html\":[\"$2a$10$TzT1lav9uPTDWaGMeVS18OeSQ1reeoj43FmQQS91TK/3vfVm3QsUi\"]}},\"blog\":{\"medias\":{\"GitHub\":\"https://github.com/rayadaschn\"}},\"locales\":{\"/\":{\"lang\":\"en-US\",\"navbarLocales\":{\"langName\":\"English\",\"selectLangAriaLabel\":\"Select language\"},\"metaLocales\":{\"author\":\"Author\",\"date\":\"Writing Date\",\"origin\":\"Original\",\"views\":\"Page views\",\"category\":\"Category\",\"tag\":\"Tag\",\"readingTime\":\"Reading Time\",\"words\":\"Words\",\"toc\":\"On This Page\",\"prev\":\"Prev\",\"next\":\"Next\",\"lastUpdated\":\"Last update\",\"contributors\":\"Contributors\",\"editLink\":\"Edit this page on GitHub\"},\"blogLocales\":{\"article\":\"Articles\",\"articleList\":\"Article List\",\"category\":\"Category\",\"tag\":\"Tag\",\"timeline\":\"Timeline\",\"timelineTitle\":\"Yesterday Once More!\",\"all\":\"All\",\"intro\":\"Personal Intro\",\"star\":\"Star\"},\"paginationLocales\":{\"prev\":\"Prev\",\"next\":\"Next\",\"navigate\":\"Jump to\",\"action\":\"Go\",\"errorText\":\"Please enter a number between 1 and $page !\"},\"outlookLocales\":{\"themeColor\":\"Theme Color\",\"darkmode\":\"Theme Mode\",\"fullscreen\":\"Full Screen\"},\"encryptLocales\":{\"iconLabel\":\"Page Encrypted\",\"placeholder\":\"Enter password\",\"remember\":\"Remember password\",\"errorHint\":\"Please enter the correct password!\"},\"routeLocales\":{\"skipToContent\":\"Skip to main content\",\"notFoundTitle\":\"Page not found\",\"notFoundMsg\":[\"There’s nothing here.\",\"How did we get here?\",\"That’s a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"back\":\"Go back\",\"home\":\"Take me home\",\"openInNewWindow\":\"Open in new window\"},\"author\":{\"name\":\"Huy\",\"url\":\"https://github.com/rayadaschn\"},\"logo\":\"/logo.png\",\"docsDir\":\"docs\",\"navbar\":[\"/\",{\"icon\":\"javascript\",\"text\":\"JavaScript\",\"prefix\":\"JavaScript/\",\"link\":\"/JavaScript/\"},{\"icon\":\"style\",\"text\":\"CSS\",\"prefix\":\"CSS/\",\"link\":\"/CSS/\"},{\"icon\":\"vue\",\"text\":\"框架类\",\"prefix\":\"框架类/\",\"link\":\"/框架类/\"},{\"text\":\"Mac/Linux配置\",\"icon\":\"note\",\"prefix\":\"Mac&Linux配置/\",\"link\":\"/Mac&Linux配置/\"},{\"text\":\"不止Coder\",\"icon\":\"anonymous\",\"prefix\":\"Mac&Linux配置/\",\"link\":\"/不止代码/\"}],\"navbarAutoHide\":\"always\",\"footer\":\"MIT Licensed | Copyright\",\"displayFooter\":true,\"blog\":{\"description\":\"自先沉稳 而后爱人\"}}}}")

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
