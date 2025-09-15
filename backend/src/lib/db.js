import mongoose from 'mongoose';

export const connectDB = async () => {
  try{
    const {MONGO_URI} = process.env;
    if(!MONGO_URI){
      throw new Error('MONGO_URI is not defined');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connected successfully: ', conn.connection.host);
  }catch(err){
    console.log('DB connection failed : ', err);
    process.exit(1);
  }
}