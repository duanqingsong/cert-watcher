// middlewares/withHeaders.ts

export const withHeaders = (next) => {
  return async (request, _next) => {
    //console.log(`中间件，header `)
    const res = await next(request, _next);
   
    // if (res) {
    //   //console.log(`中间件，header `,res.headers)
    //   res.headers.set("x-content-type-options", "nosniff");
    //   res.headers.set("x-dns-prefetch-control", "false");
    //   res.headers.set("x-download-options", "noopen");
    //   res.headers.set("x-frame-options", "SAMEORIGIN");
    // }
    return res;
  };
};