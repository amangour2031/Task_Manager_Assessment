import mongoose from "mongoose";
import dotenv from "dotenv";

// import models
import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";

dotenv.config();

const clearDatabase = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB Connected");

    // clear collections
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log("Users cleared");
    console.log("Projects cleared");
    console.log("Tasks cleared");

    console.log(
      "Database cleared successfully"
    );

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

clearDatabase();