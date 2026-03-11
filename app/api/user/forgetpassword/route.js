import Otp from "@/app/modals/Otp";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

export async function POST(req){
try {
    await connectToDB();
    const {email,otp,password}=await req.json()
    const otpdata=await Otp.findOne({email,otp});
    if(otpdata){
await User.updateOne({email},{password});
await Otp.findOneAndDelete({_id:otpdata._id})
return NextResponse.json("password updated",{status:200})
}else{
        return NextResponse.json("otp not send",{status:201})

    }
} catch (error) {
    return NextResponse.json(error.message,{status:400})
    
}
}