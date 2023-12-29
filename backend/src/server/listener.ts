import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import mime from "mime-types";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import * as mm from "music-metadata";

import {
  addTrackRecords,
  getTrackRecords,
  getNumberOfTracks,
  getPathOfFile,
} from "../database/queries";

import { upload } from "../database/upload";

export function startListener(port: number) {
  // create express app and enable cross-origin resource sharing
  const app: express.Express = express();
  app.use(cors());
  app.use(express.json());

  // get request for obtaining list of tracks from database
  app.get("/api/tracks", async (req: Request, res: any) => {
    try {
      const tracks: any = await getTrackRecords();
      res.status(200).send(tracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  // get request for audio streaming
  app.get("/api/audio/:key", async function (req: any, res: any) {
    try {
      const key: number = req.params.key;
      const music: string = await getPathOfFile(key);
      const contentType: string | false = mime.lookup(music);

      const stat = fs.statSync(music);
      const range = req.headers.range;
      let readStream;

      if (range !== undefined) {
        const parts: string = range.replace(/bytes=/, "").split("-");

        const partial_start: string = parts[0];
        const partial_end: string = parts[1];

        if (
          (isNaN(partial_start as unknown as number) &&
            partial_start.length > 1) ||
          (isNaN(partial_end as unknown as number) && partial_end.length > 1)
        ) {
          return res.status(500).send({ error: "Internal Server Error" });
        }

        const start: number = parseInt(partial_start, 10);
        const end: number = partial_end
          ? parseInt(partial_end, 10)
          : stat.size - 1;
        const content_length: number = end - start + 1;

        res.status(206).header({
          "Content-Type": contentType,
          "Content-Length": content_length,
          "Content-Range": "bytes " + start + "-" + end + "/" + stat.size,
        });

        readStream = fs.createReadStream(music, { start: start, end: end });
      } else {
        res.header({
          "Content-Type": contentType,
          "Content-Length": stat.size,
        });
        readStream = fs.createReadStream(music);
      }
      readStream.pipe(res);
    } catch (error) {
      console.error("Error streaming audio file:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  // post request for downloading youtube audios and storing in database
  app.post("/api/tracks/uploadUrl", async function (req: any, res: any) {
    try {
      const url = req.body.url;

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

          await addTrackRecords(track);

          console.log("Audio file finished uploading.");
        });

      res.status(200).send({ success: "File uploaded successfully!" });
    } catch (error) {
      console.error("Error downloading file with given URL:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  // post request for audio file uploading and adding file record to database
  app.post(
    "/api/tracks/upload",
    upload.single("audio"),
    async (req: any, res: any) => {
      try {
        const { format } = await mm.parseFile(req.file.path, {
          duration: true,
        });

        const track = {
          title: path.parse(req.file.originalname).name,
          duration: format.duration || -1,
          path: req.file.path,
        };
        track.duration = Math.floor(track.duration);

        await addTrackRecords(track);

        console.log(
          "File uploaded:",
          req.file.originalname,
          "to",
          req.file.path,
        );
        res.status(200).send({ success: "File uploaded successfully!" });
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // start the express backend listener
  app.listen(port, () => {
    console.log(`ville backend listening on port ${port}`);
  });
}
