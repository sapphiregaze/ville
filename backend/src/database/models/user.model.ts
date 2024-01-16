import { DataTypes } from "sequelize";

import sequelize from "../connection";

const User: any = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

async function addUserRecord(
  email: string,
  username: string,
  password_hash: string
) {
  try {
    const user: any = await User.create({
      email: email,
      username: username,
      password_hash: password_hash,
    });

    console.log(`${username} inserted into Users table successfully!`);

    return user.id;
  } catch (error) {
    throw `Error adding user record: ${error}`;
  }
}

export { User, addUserRecord };
