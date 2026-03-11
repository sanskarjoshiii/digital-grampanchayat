const { Schema, models, model } = require("mongoose");

const OtpSchema=new Schema({
    email:{
        type:String,
        require:true,
    
    },
    otp:{
        type:Number,
        require:true
    }
    ,expireTime:{
        type:Date,
        require:true
    }
})
const Otp = models.Otp || model("Otp",OtpSchema);
export default Otp