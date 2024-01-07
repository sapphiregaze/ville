import bcrypt from "bcrypt";
import validator from "validator";

import {
  addUserRecords,
  emailExists,
  usernameExists,
  getUser,
} from "../database/queries";

async function login(request: any) {
  const { username, password } = request.body;

  // check for empty field
  if (!username || !password) {
    throw "Cannot leave field empty.";
  }

  const user: any = await getUser(username);
  if (!user) {
    throw "Invalid username.";
  }

  const match: boolean = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw "Incorrect password.";
  }

  return user;
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
  if (await usernameExists(username)) {
    throw "Username already in use.";
  }
  if (await emailExists(email)) {
    throw "Email already in use.";
  }

  // hash password with salt
  const passwordHash: string = await bcrypt.hash(password, 10);

  // add user to user records
  const user: any = {
    email: email,
    username: username,
    password_hash: passwordHash,
  };
  await addUserRecords(user);

  return await login(request);
}

export { login, register };
