import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import multer from "multer";
import mime from "mime-types";
import * as mm from "music-metadata";

import {
  addTrackRecords,
  getNumberOfTracks,
  getPathOfFile,
  getTrackRecords,
} from "./database/queries";

require("dotenv").config();
const app: express.Express = express();
const port: number = parseInt(process.env.PORT || "8080", 10);

const filter: any = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Non-audio type file upload attempted."), false);
  }
};

const storage: multer.StorageEngine = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const uploadPath: string = "./src/database/uploads";
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: async function (req: any, file: any, cb: any) {
    try {
      const numberOfTracks: number = await getNumberOfTracks();
      cb(null, String(numberOfTracks + 1) + path.extname(file.originalname));
    } catch (error) {
      console.error("Error obtaining records:", error);
      cb(error);
    }
  },
});

const upload: multer.Multer = multer({ storage: storage, fileFilter: filter });

app.use(cors());

app.get("/api/tracks", async (req: Request, res: any) => {
  try {
    const tracks: any = await getTrackRecords();
    res.send(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

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

app.post(
  "/api/tracks/upload",
  upload.single("audio"),
  async (req: any, res: any) => {
    try {
      const { format } = await mm.parseFile(req.file.path, { duration: true });

      const track = {
        title: path.parse(req.file.originalname).name,
        duration: format.duration || -1,
        path: req.file.path,
      };
      track.duration = Math.floor(track.duration);

      await addTrackRecords(track);

      console.log("File uploaded:", req.file.originalname, "to", req.file.path);
      res.send("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
);

app.listen(port, () => {
  console.log(`ville backend listening on port ${port}`);
});
