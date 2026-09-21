import { rejects } from 'assert';
import { v2 as cloudinary } from 'cloudinary'
import { error } from 'console';
import { resolve } from 'path';
import { buffer } from 'stream/consumers';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(file:Blob):Promise<string | null>=>{
if (!file){
    return null
}
try {
const arrayBuffer=await file.arrayBuffer()
const buffer=Buffer.from(arrayBuffer)
return new Promise((resolve,rejects)=>{
    const uploadStram=cloudinary.uploader.upload_stream(
        {resource_type:"auto"},
        (error,result)=>{
            if (error){
                rejects(error)
            }else{
                resolve(result?.secure_url?? null)
            }
        }
    )
    uploadStram.end(buffer)
})
} catch (error) {
    console.log("Error hain bhosre ka from cloudinary error type:",error)
    return null
    
}
} 

export default uploadOnCloudinary;