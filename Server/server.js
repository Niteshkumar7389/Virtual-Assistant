import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./Gemini.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.send("server is running..");
// });
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", async (req, res) => {
  let prompt = req.query.prompt;
  let data = await geminiResponse(prompt);
  res.json(data);
});

await ConnectDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server Started");
  });
}

export default server;
