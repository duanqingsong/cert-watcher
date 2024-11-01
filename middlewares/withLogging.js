// middleware/withLogging.ts


export const withLogging = (next) => {
  return async (request, _next) => {
    //console.log("中间件，日志 some data here", request.nextUrl.pathname);
    return next(request, _next);
  };
};