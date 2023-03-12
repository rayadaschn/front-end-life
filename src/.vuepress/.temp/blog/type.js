export const typeMap = {"article":{"/":{"path":"/article/","keys":["v-53a92e37","v-6c18eb91","v-622b6a26","v-43949074","v-5eea91d8","v-4faf1f98","v-7182cfc9","v-abbfda4a","v-1be23676","v-afcb70c2","v-37b4dfaa","v-6efb869b","v-1db83978","v-26c38688","v-74368525","v-5f08e4a6","v-6fa26d34","v-d27007b4","v-d42a4496","v-1877ed7f","v-568d3b89","v-2f5b5962","v-5dc87674","v-9d590286","v-1a99e9da","v-741bc49e","v-6623ad5a","v-60a725fe","v-4938910e","v-2b26d77a","v-22f701e6","v-d0cda71a","v-59315bd6","v-2b690886"]}},"star":{"/":{"path":"/star/","keys":["v-4faf1f98","v-7182cfc9","v-1be23676","v-37b4dfaa","v-6efb869b","v-1877ed7f","v-5dc87674","v-53a92e37","v-1a99e9da","v-6c18eb91","v-22f701e6","v-d0cda71a","v-59315bd6","v-2b690886"]}},"timeline":{"/":{"path":"/timeline/","keys":["v-622b6a26","v-43949074","v-5eea91d8","v-4faf1f98","v-7182cfc9","v-abbfda4a","v-1be23676","v-afcb70c2","v-37b4dfaa","v-6efb869b","v-1db83978","v-26c38688"]}}};

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typeMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap);
  });

