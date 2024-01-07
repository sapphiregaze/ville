import express from "express";
import jwt from "jsonwebtoken";

import { getUserTrackRecords } from "../database/queries";

const router: express.Router = express.Router();

require("dotenv").config();
const secretKey: string = process.env.SECRET_KEY || "DefaultSecretChangeThis";

// get request for obtaining list of tracks from database
router.get("/", async (req: any, res: any) => {
  try {
    let userId: number = 0;
    const token: string =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        console.error("Invalid token:", err);
        return res.status(401).send({ error: "Invalid token" });
      }
      userId = decoded.userId;
      console.log(decoded);
    });

    if (userId) {
      const tracks: any = await getUserTrackRecords(userId);
      res.status(200).send(tracks);
    }
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
});

export default router;
