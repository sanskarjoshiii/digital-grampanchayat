import Funds from "@/app/modals/Funds";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

export async function GET(req,{params}){

// const data =await Funds.
  // Extract the year from query parameters
  try {
    
      await connectToDB();
      
      let data = await Funds.find();

  // Filter data based on the provided year
  if (params.year) {

    data = data.filter((item) => {
      return new Date(item.date).getFullYear() == params.year;
    });
  }
  return NextResponse.json(data,{status:200});
  
} catch (error) {
    return NextResponse.json({message:error.message},{status:400});
  
}
}