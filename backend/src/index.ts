import cors from "cors";
import express from "express";

import audioRoutes from "./routes/audio";
import userRoutes from "./routes/user";
import tracksRoutes from "./routes/tracks";
import uploadRoutes from "./routes/upload";

import sequelize from "./database/connection";

require("dotenv").config();
const port: number = parseInt(process.env.PORT || "8080", 10);

// create express app and enable json, and cross-origin resource sharing
const app: express.Express = express();
app.use(express.json());
app.use(cors({ methods: ["GET", "POST"] }));

app.use("/api/audio", audioRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tracks", tracksRoutes);
app.use("/api/upload", uploadRoutes);

// test connection to backend
app.get("/", (req: any, res: any) => {
  res.status(200).json({ message: "ville is up and listening." });
});

// start the express backend listener
app.listen(port, async () => {
  await sequelize.sync();
  console.log(`ville backend listening on port ${port}`);
});
