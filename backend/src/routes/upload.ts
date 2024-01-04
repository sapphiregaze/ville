import fs from "fs";
import path from "path";
import express from "express";
import ytdl from "ytdl-core";
import jwt from "jsonwebtoken";
import ffmpeg from "fluent-ffmpeg";
import * as mm from "music-metadata";

import { upload } from "../utils/upload.conf";
import { getNumberOfTracks } from "../database/queries";
import { addTrack } from "../utils/records";

const router: express.Router = express.Router();

require("dotenv").config();
const secretKey: string = process.env.SECRET_KEY || "DefaultSecretChangeThis";

// post request for audio file uploading and adding file record to database
router.post("/", upload.single("audio"), async (req: any, res: any) => {
  try {
    let userId: number = -1;
    const token: string =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        console.error("Invalid token:", err);
        return res.status(401).send({ error: "Invalid token" });
      }
      userId = decoded.userId;
    });

    const { format } = await mm.parseFile(req.file.path, {
      duration: true,
    });

    const track = {
      title: path.parse(req.file.originalname).name,
      duration: format.duration || -1,
      path: req.file.path,
    };
    track.duration = Math.floor(track.duration);

    await addTrack(userId, track);

    console.log("File uploaded:", req.file.originalname, "to", req.file.path);
    res.status(200).send({ success: "File uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// post request for downloading youtube audios and storing in database
router.post("/url", async (req: any, res: any) => {
  try {
    let userId: number = -1;
    const token: string =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    const url = req.body.url;

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        console.error("Invalid token:", err);
        return res.status(401).send({ error: "Invalid token" });
      }
      userId = decoded.userId;
    });

    const uploadPath: string = "src/database/uploads/";
    fs.mkdirSync(uploadPath, { recursive: true });

    // validate user input url
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).send("Invalid YouTube URL");
    }

    const numberOfTracks: number = await getNumberOfTracks();

    // get youtube stream with ytdl-core and convert to mp3 using ffmpeg
    const stream: any = ytdl(url, { quality: "highestaudio" });
    ffmpeg(stream)
      .audioBitrate(128)
      .save(uploadPath + `${numberOfTracks + 1}.mp3`)
      .on("end", async () => {
        const info = await ytdl.getInfo(url);
        const filePath: string = uploadPath + `${numberOfTracks + 1}.mp3`;

        const { format } = await mm.parseFile(filePath, {
          duration: true,
        });

        const track = {
          title: info.videoDetails.title,
          duration: format.duration || -1,
          path: filePath,
        };
        track.duration = Math.floor(track.duration);

        await addTrack(userId, track);
      });

    res.status(200).send({ success: "File uploaded successfully!" });
  } catch (error) {
    console.error("Error downloading file with given URL:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
