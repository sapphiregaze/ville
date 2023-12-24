import express from "express";

require("dotenv").config();
const app: express.Express = express();
const port: number = parseInt(process.env.PORT || "8080", 10);

app.get("/api/tracks", (req: any, res: any) => {
  res.send("Tracks");
});

app.listen(port, () => {
  console.log(`ville backend listening on port ${port}`);
});
