import { startListener } from "./server/listener";

require("dotenv").config();
const port: number = parseInt(process.env.PORT || "8080", 10);
const sessionSecret: string =
  process.env.SESSION_SECRET || "DefaultSecretChangeThis";

// start express app listener
startListener(port, sessionSecret);
