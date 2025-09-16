import mongoose from "mongoose";

const connectDB = async () => {

  try{
  // Log when connection is established
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected...");
  });

  // Connect to the "neura" database
  await mongoose.connect(`${process.env.MONGODB_URI}/neura`);

} catch(error){
  console.log(error.message);
}
};

export default connectDB;
