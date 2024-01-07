import express from "express";
import jwt from "jsonwebtoken";

import { login, register } from "../utils/user.util";

const router: express.Router = express.Router();
router.use(express.json());

require("dotenv").config();
const secretKey: string = process.env.SECRET_KEY || "DefaultSecretChangeThis";

router.post("/login", async (req: any, res: any) => {
  try {
    const user: any = await login(req);

    const token: string = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "3d",
    });

    res.status(200).send({ token: token });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).send({ error: error });
  }
});

router.post("/register", async (req: any, res: any) => {
  try {
    const user: any = await register(req);

    const token: string = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "3d",
    });

    res.status(200).send({ token: token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(401).send({ error: error });
  }
});

export default router;
