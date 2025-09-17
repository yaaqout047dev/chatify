import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
  try{
    const {MONGO_URI} = ENV;
    if(!MONGO_URI){
      throw new Error('MONGO_URI is not defined');
    }
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log('DB connected successfully: ', conn.connection.host);
  }catch(err){
    console.log('DB connection failed : ', err);
    process.exit(1);
  }
}