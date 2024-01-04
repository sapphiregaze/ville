import cors from "cors";
import express from "express";

import { createTablesIfNotExist } from "./database/queries";

import audioRoutes from "./routes/audio";
import loginRoutes from "./routes/login";
import tracksRoutes from "./routes/tracks";
import uploadRoutes from "./routes/upload";

require("dotenv").config();

const port: number = parseInt(process.env.PORT || "8080", 10);
const frontendHost: string =
  process.env.FRONTEND_HOST || "http://localhost:3000";

// create express app and enable json, and cross-origin resource sharing
const app: express.Express = express();
app.use(express.json());
app.use(
  cors({
    origin: frontendHost,
    methods: ["GET", "POST"],
  }),
);

createTablesIfNotExist();

app.use("/api/audio", audioRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/tracks", tracksRoutes);
app.use("/api/tracks/upload", uploadRoutes);

// start the express backend listener
app.listen(port, () => {
  console.log(`ville backend listening on port ${port}`);
});
