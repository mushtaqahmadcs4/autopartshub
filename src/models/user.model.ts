import mongoose from "mongoose"
interface IUser {
    _id: mongoose.Types.ObjectId;
    name:string;
    email:string;
    password?:string;
    mobile?:string;
    role:"user"  | "admin" | "vendor";
    image?:string    
}
const userSchema = new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    mobile:{
        type:String,
        required:false
    },
    role:{
        type:String,
        enum:["user","admin","vendor"],
        default:"user"
    },
    image:{
        type:String
    }


},{timestamps:true})

// Look closely at the "as mongoose.Model<IUser>" part
const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", userSchema);

export default User;