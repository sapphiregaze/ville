import { startListener } from "./server/listener";

require("dotenv").config();
const port: number = parseInt(process.env.PORT || "8080", 10);

// start express app listener
startListener(port);
