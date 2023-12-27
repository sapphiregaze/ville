import fs from "fs";
import path from "path";
import multer from "multer";

import { getNumberOfTracks } from "./queries";

const filter: any = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  // filter out non-audio files using mimetype
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Non-audio type file upload attempted."), false);
  }
};

const storage: multer.StorageEngine = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    // recursively create upload path if path doesn't exist
    const uploadPath: string = "./src/database/uploads";
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: async function (req: any, file: any, cb: any) {
    // obtain amount of record and use it as filename
    try {
      const numberOfTracks: number = await getNumberOfTracks();
      cb(null, String(numberOfTracks + 1) + path.extname(file.originalname));
    } catch (error) {
      console.error("Error obtaining records:", error);
      cb(error);
    }
  },
});

export const upload: multer.Multer = multer({
  storage: storage,
  fileFilter: filter,
});
