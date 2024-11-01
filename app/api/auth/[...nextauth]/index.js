import CredentialsProvider from "next-auth/providers/credentials";

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
        if(username=='travelx' && (password=='travelX@2024' || password=='qs.Duan@2024')){
          return { id: "1", name: "TravelX User", email: "travelx@example.com" };
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

