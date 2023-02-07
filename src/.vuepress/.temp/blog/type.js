export const typeMap = {"article":{"/":{"path":"/article/","keys":["v-02088592","v-4c52b85c","v-37b4dfaa","v-6efb869b","v-1db83978","v-26c38688","v-0dc76e64","v-74368525","v-5f08e4a6","v-d27007b4","v-568d3b89","v-1fd1f647","v-2f5b5962","v-b2ec27e0","v-6623ad5a","v-4938910e","v-abbfda4a"]}},"star":{"/":{"path":"/star/","keys":["v-02088592","v-37b4dfaa","v-6efb869b"]}},"timeline":{"/":{"path":"/timeline/","keys":["v-02088592","v-4c52b85c","v-37b4dfaa","v-6efb869b","v-1db83978","v-26c38688"]}}};

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typeMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap);
  });

