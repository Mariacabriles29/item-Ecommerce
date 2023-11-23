import mongoose from "mongoose";
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected.");
      return;
    }

    // const url =
    //   process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ecommerce";
    const url = "mongodb://127.0.0.1:27017/ecommerce";
    await mongoose.connect(url);

    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default connectDB;
