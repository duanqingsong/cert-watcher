
import { default as nextAuthMiddleware } from "next-auth/middleware"
//export const config = { matcher: ["/dashboard"] }
export const withAuthorization = (next) => {
  return async (request, _next) => {
    const pathname = request.nextUrl.pathname;
    //console.log("判断匹配admin，pathname==>",pathname)
    //   /((admin).*)
    // 不含 images,login,api,_next
    const reg = new RegExp('^/(?!images|login|api|_next)');
    const needAuth=reg.test(pathname)
    if (needAuth) {
      return nextAuthMiddleware(request,_next)
    }
    else{
      return next(request, _next);
    }
  };
};




// export const withAuthorization = (next) => {
//   return async (request, _next) => {
//     const pathname = request.nextUrl.pathname;

//     if (["/admin"]?.some((path) => pathname.startsWith(path))) {
//       const token = await getToken({
//         req: request,
//         secret: process.env.NEXTAUTH_SECRET,
//       });
//       if (!token) {
//         const url = new URL(`/api/auth/signin`, request.url);
//         url.searchParams.set("callbackUrl ", encodeURI(request.url));
//         return NextResponse.redirect(url);
//       }
//       if (token.role !== "admin") {
//         const url = new URL(`/403`, request.url);
//         return NextResponse.rewrite(url);
//       }
//     }
//     return next(request, _next);
//   };
// };