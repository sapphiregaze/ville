import cors from "cors";
import express from "express";
import session from "express-session";

import { createTablesIfNotExist } from "./database/queries";

import audioRoutes from "./routes/audio";
import tracksRoutes from "./routes/tracks";
import uploadRoutes from "./routes/upload";

require("dotenv").config();

const port: number = parseInt(process.env.PORT || "8080", 10);
const frontendHost: string =
  process.env.FRONTEND_HOST || "http://localhost:3000";
const sessionSecret: string =
  process.env.SESSION_SECRET || "DefaultSecretChangeThis";

// create express app and enable json, cross-origin resource sharing, and sessions
const app: express.Express = express();
app.use(express.json());
app.use(
  cors({
    origin: frontendHost,
    methods: ["GET", "POST"],
  }),
);
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  }),
);

createTablesIfNotExist();

app.use("/api/audio", audioRoutes);
app.use("/api/tracks", tracksRoutes);
app.use("/api/tracks/upload", uploadRoutes);

// start the express backend listener
app.listen(port, () => {
  console.log(`ville backend listening on port ${port}`);
});
