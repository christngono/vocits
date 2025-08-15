import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const voteSchema = new Schema({
   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   choice: {
     type: String,
     enum: ['pour', 'contre', 'abstention'],
     required: true
   }
 }, { _id: false });

const vocitSchema = new Schema({
  image: { 
    type: String, 
    required:[true,'le image est requis']
  },
  title: 
  { type: String, 
    required:[true,'le title est requis'], 
    trim:true
  },
  content: { 
    type: String, 
    required:false, 
    trim:true
  },
 
  categorie: {
    type: String,
    default: 'autre',
    trim:true
  },
  tags: [String],
  datePublication: { type: Date, default: Date.now },
  votePour: { type: Number, default: 0 },
  voteContre: { type: Number, default: 0 },
  voteAbstention: { type: Number, default: 0 },
  votes: [voteSchema] // 📌 votes par utilisateur
}, { timestamps: true });

export default model('vocit', vocitSchema);
