import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const statusSchema = new Schema ({
    title : {type: String, require:String},
    image:{type:String, require:String, enum:['image','video']
        
    },
    },{ timestamps: true })

    export default model('status', statusSchema);
