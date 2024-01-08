import express from "express";

import { login, register } from "../utils/user.util";

const router: express.Router = express.Router();
router.use(express.json());

router.post("/login", async (req: any, res: any) => {
  try {
    const token: string = await login(req);

    res.status(200).send({ token: token });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).send({ error: error });
  }
});

router.post("/register", async (req: any, res: any) => {
  try {
    const token: string = await register(req);

    res.status(200).send({ token: token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(401).send({ error: error });
  }
});

export default router;
