import express from "express";
import jwt from "jsonwebtoken";

const router: express.Router = express.Router();
router.use(express.json());

require("dotenv").config();
const secretKey: string = process.env.SECRET_KEY || "DefaultSecretChangeThis";

router.post("/login", (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    // test user auth logic
    const users = [
      { id: 1, username: "user1", password: "password1" },
      { id: 2, username: "user2", password: "password2" },
    ];
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "3d" });

    res.status(200).send({ token: token });
  } catch (error) {
    console.error("Error authenticating user:", error);
  }
});

export default router;
