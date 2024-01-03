import express from "express";

import { getTrackRecords } from "../database/queries";

const router: express.Router = express.Router();

// get request for obtaining list of tracks from database
router.get("/", async (req: Request, res: any) => {
  try {
    const tracks: any = await getTrackRecords();
    res.status(200).send(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
