import mongoose, { mongo } from "mongoose";
const userModel = new mongoose.Schema({
  name: String,
  email: { type: String, required: true,unique: true},
  password: { type: String, required: true },
  username:{ type: String, required: true,unique: true},
  
  content: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
    }
  ],
  tags:[{ type: mongoose.Schema.Types.ObjectId, ref:'Tag'}]
});

const User = mongoose.model('User',userModel)
export default User;