import CredentialsProvider from "next-auth/providers/credentials";
import { userLogin } from "./userLogin";

export const  authOptions={
  session:{
    strategy:'jwt'
  },
  providers: [
    CredentialsProvider({
      id:'credentials',
      name:'Credentials',
      async authorize(credentials){
        const {username, password} = credentials;
        // 從數據庫中檢查用戶是否存在
        const user=await userLogin(username,password);
        if(user){
          const userInfo={ id: user.id, name: user.nickname||'', email:user.email };
          return {name: user.nickname||'', email:userInfo };
        }else{
          const error=encodeURIComponent("帐号或密码错误!");
          throw new Error(error);
        }
      }
    })
  ],
  pages: {
    error: "/login",
    signIn:'/login',
  },
  
}

