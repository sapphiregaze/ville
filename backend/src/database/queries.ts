const sqlite3 = require("sqlite3").verbose();

// create tables if it doesnt exist
async function createTableIfNotExist(db: any, name: string) {
  return new Promise<void>((resolve, reject) => {
    const query = `
        CREATE TABLE IF NOT EXISTS ${name} (
          id INTEGER PRIMARY KEY,
          title TEXT,
          duration INTEGER
        )
      `;

    db.run(query, function (err: Error) {
      if (err) {
        reject(err);
      }
      console.log(`Table ${name} created or already exists`);
      resolve();
    });
  });
}

// add track records to tracks tables
async function addTrackRecords(record: any) {
  return new Promise<void>((resolve, reject) => {
    let db: any = new sqlite3.Database("./ville.db", async (err: Error) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        await createTableIfNotExist(db, "tracks");

        console.log("Connected to ville database to inserting track records.");

        const query = `
            INSERT INTO tracks (title, duration)
            VALUES ('${record.title}', ${record.duration});
          `;

        db.run(query, function (err: Error) {
          if (err) {
            console.error(err.message);
            reject(err);
          }
          console.log(`${record.title} inserted into tracks successfully`);
          resolve();
        });

        db.close();
      }
    });
  });
}

// get all tracks in the tracks table
async function getTrackRecords() {
  return new Promise((resolve, reject) => {
    let tracks: any = [];
    let db: any = new sqlite3.Database(
      "./ville.db",
      sqlite3.OPEN_READONLY,
      async (err: Error) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          await createTableIfNotExist(db, "tracks");

          console.log(
            "Connected to ville database for fetching track records.",
          );

          const query = `SELECT * FROM tracks`;

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
            },
          );
        }
      },
    );
  });
}

export { addTrackRecords, getTrackRecords };
