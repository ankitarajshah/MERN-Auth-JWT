import mongoose from "mongoose";
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("DB connected"));
    const dbURI = `${process.env.MONGODB_URI}/mern-auth`;

    // Connect to MongoDB
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {}
};

export default connectDB;
