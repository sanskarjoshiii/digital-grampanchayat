import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        await connectToDB();
        const {email}=await req.json();
        const data = await User.findOne({email})
        if(!data){
            throw new Error("User Not Found")
        }
        return NextResponse.json({name:data.name,email:data.email,phoneNo:data.phoneNo,profile:data.profile||"",userType:data.userType},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Invalid User",error:error.message},{status:404})
    }
}
export async function PUT(req){
    try {
        await connectToDB();
        const {email,phoneNo,name,profile}=await req.json();
        const data = await User.findOne({email})
        if(!data){
            throw new Error("User Not Found")
        }
        await User.updateOne({email:email},{phoneNo,name,profile})
        return NextResponse.json({message:"data updated"},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Invalid User"},{status:404})
    }
}