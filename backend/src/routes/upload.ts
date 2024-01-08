import fs from "fs";
import path from "path";
import express from "express";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import * as mm from "music-metadata";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

import { upload } from "../utils/upload.util";
import { addTrack } from "../utils/tracks.util";
import { getNumberOfTracks } from "../database/queries";
import { validateUser } from "../utils/user.util";

const router: express.Router = express.Router();

// post request for audio file uploading and adding file record to database
router.post("/", upload.single("audio"), async (req: any, res: any) => {
  try {
    const userId: number = validateUser(req);

    const { format } = await mm.parseFile(req.file.path, { duration: true });

    const track = {
      title: path.parse(req.file.originalname).name,
      duration: Math.floor(format.duration || -1),
      path: req.file.path,
    };

    await addTrack(userId, track);

    res.status(200).send({ success: "File uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(401).send({ error: error });
  }
});

// post request for downloading youtube audios and storing in database
router.post("/url", async (req: any, res: any) => {
  try {
    const url = req.body.url;
    const uploadPath: string = "src/database/uploads/";

    const userId: number = validateUser(req);

    fs.mkdirSync(uploadPath, { recursive: true });

    // validate user input url
    if (!url || !ytdl.validateURL(url)) {
      throw "Invalid URL";
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

        const { format } = await mm.parseFile(filePath, { duration: true });

        const track = {
          title: info.videoDetails.title,
          duration: Math.floor(format.duration || -1),
          path: filePath,
        };

        await addTrack(userId, track);
      });

    res.status(200).send({ success: "File uploaded successfully!" });
  } catch (error) {
    console.error("Error downloading file with given URL:", error);
    res.status(401).send({ error: error });
  }
});

export default router;
