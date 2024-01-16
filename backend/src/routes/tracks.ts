import express from "express";

import { validateUser } from "../utils/user.util";

import { getUserTrackRecords } from "../database/models/userTrack.model";

const router: express.Router = express.Router();

// get request for obtaining list of tracks from database
router.get("/", async (req: any, res: any) => {
  try {
    const userId: number = validateUser(req);
    const tracks: any = await getUserTrackRecords(userId);

    res.status(200).send(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(401).send({ error: error });
  }
});

export default router;
