import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import mime from "mime-types";
import * as mm from "music-metadata";

import {
  addTrackRecords,
  getPathOfFile,
  getTrackRecords,
} from "../database/queries";

import { upload } from "../database/upload";

export function startListener(port: number) {
  // create express app and enable cross-origin resource sharing
  const app: express.Express = express();
  app.use(cors());

  // get request for obtaining list of tracks from database
  app.get("/api/tracks", async (req: Request, res: any) => {
    try {
      const tracks: any = await getTrackRecords();
      res.send(tracks);
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
          return res.sendStatus(500);
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
        res.send("File uploaded successfully!");
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
