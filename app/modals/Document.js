const { Schema, models, model } = require("mongoose");

const DocSchema=new Schema({
    
    title:{
        type:String,
        require:true,
    
    },
    url:{
        type:String,
        require:true,
    
    },
    createdAt:{
        type:Date
    }
})
const Document = models.Document || model("Document",DocSchema);
export default Document