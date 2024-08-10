import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}}`
    );
    console.log(
      `\n Mongo DB conneted !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB Connection FAILED: ", error);
    process.exit(1);
  }
};

export default connectDB;

