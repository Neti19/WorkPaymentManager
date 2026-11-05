import mongoose from 'mongoose';
const paymentSchema=new mongoose.Schema({type:{type:String,enum:['Advance','Additional'],default:'Advance'},date:{type:Date,default:Date.now},amount:{type:Number,required:true,min:0.01},description:{type:String,trim:true,maxlength:500,default:''}},{timestamps:true});
const updateSchema=new mongoose.Schema({date:{type:Date,default:Date.now},completed:{type:String,default:'',maxlength:2000},remaining:{type:String,default:'',maxlength:2000},status:{type:String,enum:['Pending','In Progress','Completed'],default:'Pending'}},{_id:true});
const workSchema=new mongoose.Schema({owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},customer:{type:mongoose.Schema.Types.ObjectId,ref:'Customer',required:true},name:{type:String,required:true,trim:true,maxlength:150},description:{type:String,default:'',maxlength:2000},startDate:{type:Date,default:Date.now},expectedCompletionDate:{type:Date},totalAmount:{type:Number,required:true,min:0.01},status:{type:String,enum:['Pending','In Progress','Completed'],default:'Pending'},completed:{type:String,default:'',maxlength:2000},remaining:{type:String,default:'',maxlength:2000},payments:[paymentSchema],updates:[updateSchema],shareToken:{type:String,default:null,index:true},shareEnabled:{type:Boolean,default:false},videoUrl: {
  type: String,
  trim: true,
  default: ''
},},{timestamps:true});
workSchema.index({owner:1,createdAt:-1});
workSchema.virtual('totalReceived').get(function(){return this.payments.reduce((s,p)=>s+p.amount,0)});
workSchema.virtual('remainingAmount').get(function(){return this.totalAmount-this.totalReceived});
workSchema.set('toJSON',{virtuals:true});
export default mongoose.model('Work',workSchema);
