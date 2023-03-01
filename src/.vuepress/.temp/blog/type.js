export const typeMap = {"article":{"/":{"path":"/article/","keys":["v-5dc87674","v-53a92e37","v-1a99e9da","v-6c18eb91","v-abbfda4a","v-02088592","v-afcb70c2","v-37b4dfaa","v-6efb869b","v-1db83978","v-26c38688","v-0dc76e64","v-74368525","v-5f08e4a6","v-6fa26d34","v-d27007b4","v-d42a4496","v-568d3b89","v-2f5b5962","v-9d590286","v-741bc49e","v-6623ad5a","v-4938910e","v-2b26d77a","v-22f701e6"]}},"star":{"/":{"path":"/star/","keys":["v-02088592","v-37b4dfaa","v-6efb869b","v-5dc87674","v-53a92e37","v-1a99e9da","v-6c18eb91","v-22f701e6"]}},"timeline":{"/":{"path":"/timeline/","keys":["v-abbfda4a","v-02088592","v-afcb70c2","v-37b4dfaa","v-6efb869b","v-1db83978","v-26c38688"]}}};

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typeMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap);
  });

