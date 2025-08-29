import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const statusSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // chemin du fichier
  type: { type: String, enum: ['image', 'video'], required: true } // type fichier
}, { timestamps: true });

export default model('status', statusSchema);
