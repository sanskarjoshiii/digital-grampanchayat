const { Schema, models, model } = require("mongoose");

const DocSchema=new Schema({

    title:{
        type:String,
        require:true,

    },
    // Why this document matters, in the admin's own words. Optional, and blank
    // on everything uploaded before this field existed.
    description:{
        type:String,
        trim:true,
        maxlength:1000,
        default:"",
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
