import Otp from "@/app/modals/Otp";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { email } = await req.json();

  try {
    await connectToDB();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "smartcoder0852@gmail.com",
        pass: "iuyk wfjm wswv ejyq",
      },
    });

    // Function to generate OTP
    function generateOTP() {
      let digits = "0123456789";
      let OTP = "";
      let len = digits.length;
      for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * len)];
      }
      return OTP;
    }

    let otp = generateOTP();

    const mail = await transporter.sendMail({
      from: "smartcoder0852@gmail.com",
      to: email,
      subject: `Your OTP for creating an account`,
      html: `<h1>Your OTP for creating an account is ${otp}</h1>`,
    });

    // Set expiration time to 5 minutes from now
    const expireTime = new Date(Date.now() + 5 * 60 * 1000);
const otpdata= await Otp.findOne({email});
if(otpdata){
    const createOtp = await Otp.updateOne({ email, otp, expireTime });

}else{
    const createOtp = await Otp.create({ email, otp, expireTime });
}

    return NextResponse.json({ message: "Success: email was sent" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "COULD NOT SEND MESSAGE" }, { status: 500 });
  }
}
