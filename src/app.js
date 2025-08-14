import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

// it normally blocks the req. if the front and backend are on different ports
import cors from "cors";
dotenv.config({ path: "./src/.env" });

const app = express();
// .use--> adds middleware to server
app.use(
  cors({
    //  tells browser which frontend to send request
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
//  midldewares

// restricts max JSON  size`
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser())


import healthcheckroutes from "./routes/healthcheckroutes.js"

app.use("/api/v1/healthcheck",healthcheckroutes)
export { app };
