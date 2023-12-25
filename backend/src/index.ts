import fs from "fs";
import cors from "cors";
import express from "express";
import multer from "multer";

import { addTrackRecords, getTrackRecords } from "./database/queries";

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
    cb(new Error("Attempted non-audio type file upload."), false);
  }
};

const storage: multer.StorageEngine = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const uploadPath = "./src/database/uploads";
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});

const upload: multer.Multer = multer({ storage: storage, fileFilter: filter });

app.use(cors());

app.get("/api/tracks", async (req: Request, res: any) => {
  try {
    const tracks = await getTrackRecords();
    res.send(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/api/tracks/upload", upload.single("audio"), (req: any, res: any) => {
  console.log("File uploaded:", req.file);
  res.send("File uploaded successfully!");
});

app.listen(port, () => {
  console.log(`ville backend listening on port ${port}`);
});
