import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Email from "next-auth/providers/email"
import connectDb from "./lib/db"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
import { use } from "react"
import Google from "next-auth/providers/google"
import { error } from "console"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials:{
        email:{label:"email",type:"email"},
        password:{label:"password",type:"password"}
        },
async authorize(credentials, request) {
    
        await connectDb()
        const email=credentials?.email as string;
        const password=credentials?.password as string;
        const user= await User.findOne({email})
        if(!user){
          throw new Error("user does not exists")
        }
        if(!user.password){
          throw new Error("Please sign in with Google or reset your password");
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if (!isMatch){
          throw new Error("incorrect password")
        }
        return{
          id:user._id.toString(),
          email:user.email,
          name:user.name,
          role:user.role
        }
},
    }),
      Google({
        clientId:process.env.GOOGLE_CLIENT_ID,
       clientSecret:process.env.GOOGLE_CLIENT_SECRET
      })
  ],
 callbacks: {
    async signIn({user,account}){
      if(account?.provider=="google"){
        await connectDb()
        let DBuser=await User.findOne({email:user.email})
        if(!DBuser){
        DBuser= await User.create({
        name: user.name,
        email:user.email,
        image:user.image??"",
        });
        }
        user.id=DBuser._id.toString()??"",
        (user as any).role=DBuser.role
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // We cast 'user' as any so TypeScript stops complaining about the 'role' field
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Transfer the data from the token (where it is stored) to the session (where the UI sees it)
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session; 
    },
  },
  pages:{
    signIn:"/login",
    error:"/login"
  },
  session:{
    strategy:"jwt",
    maxAge:10*24*60*60*1000
  },
  secret:process.env.AUTH_SECRET
  })