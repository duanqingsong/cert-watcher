import { NextResponse } from 'next/server'
import {stackMiddlewares} from '@/middlewares/stackMiddlewares'
import { withHeaders } from "@/middlewares/withHeaders";
import { withLogging } from "@/middlewares/withLogging";
import { withAuthorization } from './middlewares/withAuthorization';

// eslint-disable-next-line no-unused-vars
export function defaultMiddleware(next) {
  // eslint-disable-next-line no-unused-vars
  return async (req, _next) => {
    return NextResponse.next();
  }
}


export default stackMiddlewares([withLogging,withHeaders,withAuthorization]);

