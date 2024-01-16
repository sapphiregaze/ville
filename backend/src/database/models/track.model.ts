import { DataTypes } from "sequelize";

import sequelize from "../connection";

const Track: any = sequelize.define("Tracks", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

async function addTrackRecord(title: string, duration: number, path: string) {
  try {
    const track: any = await Track.create({
      title: title,
      duration: duration,
      path: path,
    });

    console.log(`${title} inserted into Tracks table successfully!`);

    return track.id;
  } catch (error) {
    throw `Error adding track record: ${error}`;
  }
}

export { Track, addTrackRecord };
