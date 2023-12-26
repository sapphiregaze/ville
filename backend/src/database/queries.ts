import { Database } from "sqlite3";

const sqlite3 = require("sqlite3").verbose();

// create tables if it doesnt exist
async function createTableIfNotExist(db: Database, name: string) {
  return new Promise<void>((resolve, reject) => {
    const query: string = `
        CREATE TABLE IF NOT EXISTS ${name} (
          id INTEGER PRIMARY KEY,
          title TEXT,
          duration INTEGER,
          path TEXT
        )
      `;

    db.run(query, function (err: Error) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

// add track records to tracks tables
async function addTrackRecords(record: any) {
  return new Promise<void>((resolve, reject) => {
    let db: Database = new sqlite3.Database(
      "./ville.db",
      async (err: Error) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          await createTableIfNotExist(db, "tracks");

          const query: string = `
            INSERT INTO tracks (title, duration, path)
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
                  `${record.title} inserted into tracks successfully`,
                );
                resolve();
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
  return new Promise((resolve, reject) => {
    let tracks: any = [];
    let db: Database = new sqlite3.Database(
      "./ville.db",
      sqlite3.OPEN_READONLY,
      async (err: Error) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          await createTableIfNotExist(db, "tracks");

          const query: string = `SELECT * FROM tracks`;

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
          await createTableIfNotExist(db, "tracks");

          const query: string = `SELECT COUNT(id) as count FROM tracks`;

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

export { addTrackRecords, getTrackRecords, getNumberOfTracks };
