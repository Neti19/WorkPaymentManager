import mongoose from 'mongoose';
const customerSchema=new mongoose.Schema({owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},name:{type:String,required:true,trim:true,maxlength:100},instagramProfile:{type:String,trim:true,default:'',maxlength:300}},{timestamps:true});
customerSchema.index({owner:1,name:1});
export default mongoose.model('Customer',customerSchema);
