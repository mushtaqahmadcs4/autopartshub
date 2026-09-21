
import mongoose from "mongoose";
const mongodbUrl = process.env.MONGODB_URI
if (!mongodbUrl) {
    throw new Error("MongoDB url is not responding...")
}


let cache= global.mongoose;
if(!cache){
    cache = global.mongoose = {conn:null, promise:null}
}
const connectDb=async()=>{
    if(cache.conn){
        return cache.conn;
    }
    if(!cache.promise){
        cache.promise=mongoose.connect(mongodbUrl).then((conn)=>conn.connection)}
    try{
        cache.conn=await cache.promise

    } catch(error){
        console.log(error);
    }
    return cache.conn
}
export default connectDb