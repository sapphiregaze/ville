const cors = require("cors");
import express from "express";

import { addTrackRecords, getTrackRecords } from "./database/queries";

require("dotenv").config();
const app: express.Express = express();
const port: number = parseInt(process.env.PORT || "8080", 10);

app.use(cors());

app.get("/api/tracks", async (req: any, res: any) => {
  try {
    const tracks = await getTrackRecords();
    res.send(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`ville backend listening on port ${port}`);
});
