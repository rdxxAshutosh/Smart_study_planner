import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import recRoute from "./routes/recommendations.js";
import todosRoute from "./routes/todos.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/todos", todosRoute);
app.use("/api/recommendations", recRoute);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI, { })
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log("Server listening on", PORT));
  })
  .catch(err => console.error("DB connect error", err));
