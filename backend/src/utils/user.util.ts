import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

import { User, addUserRecord } from "../database/models/user.model";

require("dotenv").config();
const secretKey: string = process.env.SECRET_KEY || "DefaultSecretChangeThis";

async function login(request: any) {
  const { username, password } = request.body;

  // check for empty field
  if (!username || !password) {
    throw "Cannot leave field empty.";
  }

  // get user corresponding to username
  const user: any = await User.findOne({
    where: { username: username },
  });

  if (!user) {
    throw "Invalid username.";
  }

  // check if password hashes match
  const match: boolean = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw "Incorrect password.";
  }

  // return signed token if no error was thrown
  const token: string = jwt.sign({ userId: user.id }, secretKey, {
    expiresIn: "3d",
  });

  return token;
}

async function register(request: any) {
  const { email, username, password } = request.body;

  // check for empty field
  if (!email || !username || !password) {
    throw "Cannot leave field empty.";
  }

  // validate email
  if (!validator.isEmail(email)) {
    throw "Invalid email input.";
  }

  validator.normalizeEmail(email);

  // check if username or email is in use
  if (
    await User.findOne({
      where: { username: username },
    })
  ) {
    throw "Username already in use.";
  }

  if (
    await User.findOne({
      where: { email: email },
    })
  ) {
    throw "Email already in use.";
  }

  // hash password with salt
  const passwordHash: string = await bcrypt.hash(password, 10);

  // add user to user records
  await addUserRecord(email, username, passwordHash);

  return await login(request);
}

function validateUser(request: any) {
  let userId: number = 0;
  const token: string =
    request.headers.authorization &&
    request.headers.authorization.split(" ")[1];

  // verify token with secret key to get user id
  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      throw "Invalid jwt token.";
    }
    userId = decoded.userId;
  });

  if (!userId) {
    throw "Invalid user.";
  }

  return userId;
}

export { login, register, validateUser };
