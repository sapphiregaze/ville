import { Database } from "sqlite3";

const sqlite3 = require("sqlite3").verbose();

// create tables if it doesnt exist
function createTablesIfNotExist() {
  return new Promise<void>((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      async (err: Error) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          const usersQuery: string = `
            CREATE TABLE IF NOT EXISTS Users (
              id INTEGER PRIMARY KEY,
              username TEXT,
              password_hash TEXT
            )
          `;

          const tracksQuery: string = `
            CREATE TABLE IF NOT EXISTS Tracks (
              id INTEGER PRIMARY KEY,
              title TEXT,
              duration INTEGER,
              path TEXT
            )
          `;

          const userTracksQuery: string = `
            CREATE TABLE IF NOT EXISTS UserTracks (
              UserID INTEGER,
              TrackID INTEGER,
              FOREIGN KEY (UserID) REFERENCES Users(id),
              FOREIGN KEY (TrackID) REFERENCES Tracks(id),
              PRIMARY KEY (UserID, TrackID)
            )
          `;

          db.run(usersQuery, function (err: Error) {
            if (err) {
              reject(err);
            } else {
              db.run(tracksQuery, function (err: Error) {
                if (err) {
                  reject(err);
                } else {
                  db.run(userTracksQuery, function (err: Error) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                      db.close();
                      console.log("Database is now ready.");
                    }
                  });
                }
              });
            }
          });
        }
      },
    );
  });
}

// add track records to tracks tables
async function addTrackRecords(record: any) {
  return new Promise<number>((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      async (err: Error) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          const query: string = `
            INSERT INTO Tracks (title, duration, path)
            VALUES (?, ?, ?);
          `;

          db.run(
            query,
            [record.title, record.duration, record.path],
            function (err: Error) {
              if (err) {
                console.error(err.message);
                reject(err);
              } else {
                console.log(
                  `${record.title} inserted into Tracks successfully`,
                );
                resolve(this.lastID);
                db.close();
              }
            },
          );
        }
      },
    );
  });
}

// add user records to users tables
async function addUserRecords(user: any) {
  return new Promise<number>((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      async (err: Error) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          const query: string = `
            INSERT INTO Users (username, password_hash)
            VALUES (?, ?);
          `;

          db.run(
            query,
            [user.username, user.password_hash],
            function (err: Error) {
              if (err) {
                console.error(err.message);
                reject(err);
              } else {
                console.log(
                  `${user.username} inserted into Tracks successfully`,
                );
                resolve(this.lastID);
                db.close();
              }
            },
          );
        }
      },
    );
  });
}

// get all tracks in the tracks table
async function getTrackRecords() {
  return new Promise<void>((resolve, reject) => {
    let tracks: any = [];
    let db: Database = new sqlite3.Database(
      "./ville.db",
      sqlite3.OPEN_READONLY,
      async (err: Error) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const query: string = `SELECT * FROM Tracks`;

          db.each(
            query,
            [],
            (err: Error, row: any) => {
              if (err) {
                reject(err);
              }
              tracks.push(row);
            },
            (err: Error) => {
              if (err) {
                reject(err);
              }
              resolve(tracks);
              db.close();
            },
          );
        }
      },
    );
  });
}

// get number of tracks in the tracks table
async function getNumberOfTracks() {
  return new Promise<number>((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      async (err: Error) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const query: string = `SELECT COUNT(id) as count FROM Tracks`;

          db.get(query, function (err: Error, row: any) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              const count: number = row ? row.count : 0;
              resolve(count);
              db.close();
            }
          });
        }
      },
    );
  });
}

// get number of tracks in the tracks table
async function getPathOfFile(id: number) {
  return new Promise<string>((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      async (err: Error) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const query: string = `SELECT path FROM Tracks
            WHERE id = (?)`;

          db.get(query, [id], function (err: Error, row: any) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              const path: string = row ? row.path : "";
              resolve(path);
              db.close();
            }
          });
        }
      },
    );
  });
}

export {
  createTablesIfNotExist,
  addTrackRecords,
  addUserRecords,
  getTrackRecords,
  getNumberOfTracks,
  getPathOfFile,
};
