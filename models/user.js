import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
 pseudo:{
    type:String,
    required:[true,'le pseudo est requis'],
    unique:[true,'le numero de téléphone doit etre unique'],
    trim:true
},
 phone:{
    type:Number,
    required:[true,'le phone est requis'],
    unique:[true,'le numero de téléphone doit etre unique']
},
 password:{
    type:String,
required:[true,'le password est requis est requis'],
},
 region: {
    type: String,
    required: [true,'la region est requise'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
},
{timestamps:true});

export default model('User', userSchema);