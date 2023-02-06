export const categoryMap = {"category":{"/":{"path":"/category/","map":{"Guide":{"path":"/category/guide/","keys":["v-74368525","v-5f08e4a6","v-568d3b89","v-6623ad5a"]},"Vegetable":{"path":"/category/vegetable/","keys":["v-1db83978"]}}}},"tag":{"/":{"path":"/tag/","map":{"Markdown":{"path":"/tag/markdown/","keys":["v-5f08e4a6"]},"red":{"path":"/tag/red/","keys":["v-1db83978"]},"round":{"path":"/tag/round/","keys":["v-1db83978"]}}}}};

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoryMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoryMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoryMap);
  });


