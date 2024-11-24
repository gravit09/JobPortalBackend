import express from "express";
import bodyParser from "body-parser";
import connectDb from "./db/index.js";
import cors from "cors";
import { authenticateJWT } from "./middlewares/isAuthenticated.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

import jobRouter from "./routes/job.routes.js";
import userRouter from "./routes/user.routes.js";
import orgRouter from "./routes/org.routes.js";
app.use("/api/job", jobRouter);
app.use("/api/user", userRouter);
app.use("/api/org", orgRouter);

//To check wether user have valid token or not
app.get("/api/protected", authenticateJWT, (req, res) => {
  res.status(200);
  res.json({
    success: true,
    message: "valid Token",
  });
});

connectDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("application is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error while connecting to db", err);
  });
