import { checkAllDomain } from "@/actions/domain-actions";
import { performCertificateCheck } from "@/lib/certCheck";
import { NextResponse } from "next/server";

//crontab   * */6 * * * /usr/bin/curl -X GET http://localhost:3009/api/cron
export async function GET(req) {
  try{
    await checkAllDomain();
    return NextResponse.json({success:true});
  }catch(error){
    console.error('定时检查失败', error);
    return NextResponse.error(error,500);
  }
}