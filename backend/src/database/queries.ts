import { Database } from "sqlite3";

const sqlite3 = require("sqlite3").verbose();

// create tables if it doesnt exist
function createTablesIfNotExist() {
  return new Promise<void>((resolve, reject) => {
    let db: Database = new sqlite3.Database("./ville.db", (err: Error) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        const usersQuery: string = `
            CREATE TABLE IF NOT EXISTS Users (
              id INTEGER PRIMARY KEY,
              email TEXT,
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
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

// add track records to tracks tables
function addTrackRecords(record: any) {
  return new Promise<number>((resolve, reject) => {
    let db: Database = new sqlite3.Database("./ville.db", (err: Error) => {
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
              console.log(`${record.title} inserted into Tracks successfully`);
              resolve(this.lastID);
              db.close();
            }
          }
        );
      }
    });
  });
}

// add user records to users tables
function addUserRecords(user: any) {
  return new Promise<number>((resolve, reject) => {
    let db: Database = new sqlite3.Database("./ville.db", (err: Error) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        const query: string = `
            INSERT INTO Users (email, username, password_hash)
            VALUES (?, ?, ?);
          `;

        db.run(
          query,
          [user.email, user.username, user.password_hash],
          function (err: Error) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              console.log(`${user.username} inserted into Users successfully`);
              resolve(this.lastID);
              db.close();
            }
          }
        );
      }
    });
  });
}

// add user id corresponded with track id
function addUserTrackRecords(userId: number, trackId: number) {
  return new Promise<void>((resolve, reject) => {
    let db: Database = new sqlite3.Database("./ville.db", (err: Error) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        const query: string = `
            INSERT INTO UserTracks (UserID, TrackID)
            VALUES (?, ?);
          `;

        db.run(query, [userId, trackId], function (err: Error) {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            console.log(
              `Track ${trackId} with user ${userId} inserted into UserTracks successfully`
            );
            resolve();
            db.close();
          }
        });
      }
    });
  });
}

// get tracks corresponding with user id in the tracks table
function getUserTrackRecords(userId: number) {
  return new Promise<void>((resolve, reject) => {
    let tracks: any = [];
    let db: Database = new sqlite3.Database(
      "./ville.db",
      sqlite3.OPEN_READONLY,
      (err: Error) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const query: string = `
            SELECT Tracks.*
            FROM Tracks
            JOIN UserTracks ON Tracks.id = UserTracks.TrackID
            WHERE UserTracks.UserID = (?);
          `;

          db.each(
            query,
            [userId],
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
            }
          );
        }
      }
    );
  });
}

// get all tracks in the tracks table
function getAllTrackRecords() {
  return new Promise<void>((resolve, reject) => {
    let tracks: any = [];
    let db: Database = new sqlite3.Database(
      "./ville.db",
      sqlite3.OPEN_READONLY,
      (err: Error) => {
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
            }
          );
        }
      }
    );
  });
}

// get number of tracks in the tracks table
function getNumberOfTracks() {
  return new Promise<number>((resolve, reject) => {
    let db: Database = new sqlite3.Database("./ville.db", (err: Error) => {
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
    });
  });
}

// get number of tracks in the tracks table
function getPathOfFile(id: number) {
  return new Promise<string>((resolve, reject) => {
    let db: Database = new sqlite3.Database("./ville.db", (err: Error) => {
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
    });
  });
}

function usernameExists(username: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      sqlite3.OPEN_READONLY,
      (err: Error) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          const query = `SELECT COUNT(*) as count 
          FROM Users WHERE username = ?`;

          db.get(query, [username], (err: Error, row: any) => {
            if (err) {
              reject(err);
            } else {
              const exist: boolean = row.count > 0;
              resolve(exist);
            }
          });
        }
      }
    );
  });
}

function emailExists(email: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      sqlite3.OPEN_READONLY,
      (err: Error) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          const query = `SELECT COUNT(*) as count 
          FROM Users WHERE email = ?`;

          db.get(query, [email], (err: Error, row: any) => {
            if (err) {
              reject(err);
            } else {
              const exist: boolean = row.count > 0;
              resolve(exist);
            }
          });
        }
      }
    );
  });
}

function getUser(username: string) {
  return new Promise((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      sqlite3.OPEN_READONLY,
      (err: Error) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          const query = `SELECT * FROM Users WHERE username = ?`;

          db.get(query, [username], (err: Error, row: any) => {
            if (err) {
              reject(err);
            } else {
              const user = row;
              resolve(user);
            }
          });
        }
      }
    );
  });
}

export {
  createTablesIfNotExist,
  addTrackRecords,
  addUserRecords,
  addUserTrackRecords,
  getUserTrackRecords,
  getAllTrackRecords,
  getNumberOfTracks,
  getPathOfFile,
  usernameExists,
  emailExists,
  getUser,
};
