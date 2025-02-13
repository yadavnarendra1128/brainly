import mongoose, { mongo } from "mongoose";

const tagSchema = new mongoose.Schema({
    title:String,
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true}
})

const Tag = mongoose.model('Tag',tagSchema)
export default Tag;