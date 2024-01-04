import fs from "fs";
import mime from "mime-types";
import express from "express";

import { getPathOfFile } from "../database/queries";

const router: express.Router = express.Router();

// get request for audio streaming
router.get("/:key", async (req: any, res: any) => {
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
  }
});

export default router;
