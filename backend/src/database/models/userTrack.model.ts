import { DataTypes } from "sequelize";

import sequelize from "../connection";

import { User } from "./user.model";
import { Track, addTrackRecord } from "./track.model";

const UserTrack = sequelize.define("UserTrack", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  TrackID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Track,
      key: "id",
    },
  },
});

// define associations
Track.belongsToMany(User, { through: UserTrack, foreignKey: "TrackID" });
User.belongsToMany(Track, { through: UserTrack, foreignKey: "UserID" });

async function getUserTrackRecords(userId: number) {
  try {
    const user: any = await User.findByPk(userId, {
      include: [
        {
          model: Track,
          through: { model: UserTrack },
        },
      ],
    });

    return user.Tracks;
  } catch (error) {
    throw `Error getting user tracks: ${error}`;
  }
}

async function addUserTrackRecord(userId: number, track: any) {
  try {
    const trackId: number = await addTrackRecord(
      track.title,
      track.duration,
      track.path
    );

    await UserTrack.create({
      UserID: userId,
      TrackID: trackId,
    });

    console.log(
      `User ${userId} with Track ${trackId} inserted into UserTracks table successfully!`
    );
  } catch (error) {
    throw `Error adding user track record: ${error}`;
  }
}

export { UserTrack, getUserTrackRecords, addUserTrackRecord };
